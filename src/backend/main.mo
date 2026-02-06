import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Persistent authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // -------- Core Types ---------
  public type Symbol = Text;
  public type Currency = Text;

  public type OrderType = { #buy; #sell };
  public type Holding = { symbol : Symbol; quantity : Nat };
  public type LimitOrder = {
    id : Nat;
    symbol : Symbol;
    orderType : OrderType;
    price : Nat;
    quantity : Nat;
    remaining : Nat;
    isActive : Bool;
  };

  public type Trade = {
    symbol : Symbol;
    orderType : OrderType;
    entryPrice : Nat;
    exitPrice : Nat;
    positionSize : Nat;
    profitLoss : Int;
  };

  public type UserProfile = {
    cashBalance : Nat;
    holdings : [Holding];
    tradeHistory : [Trade];
    openLimitOrders : [LimitOrder];
  };

  public type Price = {
    symbol : Symbol;
    price : Nat;
  };

  public type PortfolioValuation = {
    cashBalance : Nat;
    totalEquity : Nat;
    holdingsValue : Nat;
    openPositionsValue : Nat;
  };

  // -------- State ---------
  var nextOrderId = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();
  let prices = Map.empty<Symbol, Price>();

  // -------- Price Board ---------
  public shared ({ caller }) func updatePrice(_price : Price) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update prices");
    };
    prices.add(_price.symbol, _price);
  };

  public query ({ caller }) func getPrice(symbol : Symbol) : async ?Price {
    prices.get(symbol);
  };

  // -------- Required User Profile Management Functions ---------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // -------- User Profile Management ---------
  public shared ({ caller }) func initializeProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize profiles");
    };
    let profile : UserProfile = {
      cashBalance = 0;
      holdings = [];
      tradeHistory = [];
      openLimitOrders = [];
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // -------- Paper Trading Endpoints ---------
  public shared ({ caller }) func depositFunds(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };
    let profile = getUserProfileInternal(caller);
    let newBalance = profile.cashBalance + amount;
    let updatedProfile = { profile with cashBalance = newBalance };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func placeMarketOrder(symbol : Symbol, orderType : OrderType, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let currentPrice = getCurrentPrice(symbol);
    let profile = getUserProfileInternal(caller);

    switch (orderType) {
      case (#buy) {
        let orderCost = currentPrice.price * quantity;
        if (profile.cashBalance < orderCost) {
          Runtime.trap("Insufficient funds for market buy order");
        };
        let newBalance = safeNatSub(profile.cashBalance, orderCost);
        let newHolding = { symbol; quantity = quantity };
        let updatedProfile = { profile with cashBalance = newBalance; holdings = profile.holdings.concat([newHolding]) };
        userProfiles.add(caller, updatedProfile);
      };
      case (#sell) {
        let holding = profile.holdings.find(func(h) { h.symbol == symbol });
        switch (holding) {
          case (null) { Runtime.trap("No holdings to sell for this symbol") };
          case (?h) {
            if (h.quantity < quantity) {
              Runtime.trap("Insufficient holdings to sell");
            };
            let saleProceeds = currentPrice.price * quantity;
            let newBalance = profile.cashBalance + saleProceeds;
            let remainingQuantity = safeNatSub(h.quantity, quantity);
            let updatedHoldings =
              if (remainingQuantity == 0) {
                profile.holdings.filter(func(h) { h.symbol != symbol });
              } else {
                profile.holdings.concat([{ symbol; quantity = remainingQuantity }]);
              };
            let updatedProfile = { profile with cashBalance = newBalance; holdings = updatedHoldings };
            userProfiles.add(caller, updatedProfile);
          };
        };
      };
    };
    nextOrderId += 1;
    nextOrderId - 1;
  };

  public shared ({ caller }) func placeLimitOrder(symbol : Symbol, orderType : OrderType, price : Nat, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let profile = getUserProfileInternal(caller);
    let limitOrder = {
      id = nextOrderId;
      symbol;
      orderType;
      price;
      quantity;
      remaining = quantity;
      isActive = true;
    };

    switch (orderType) {
      case (#buy) {
        let orderCost = price * quantity;
        if (profile.cashBalance < orderCost) {
          Runtime.trap("Insufficient funds for limit buy order");
        };
        let newBalance = safeNatSub(profile.cashBalance, orderCost);
        let updatedProfile = { profile with cashBalance = newBalance; openLimitOrders = profile.openLimitOrders.concat([limitOrder]) };
        userProfiles.add(caller, updatedProfile);
      };
      case (#sell) {
        let holding = profile.holdings.find(func(h) { h.symbol == symbol });
        switch (holding) {
          case (null) { Runtime.trap("No holdings to place limit sell order") };
          case (?h) {
            if (h.quantity < quantity) {
              Runtime.trap("Insufficient holdings to place limit sell order");
            };
            let remainingQuantity = safeNatSub(h.quantity, quantity);
            let updatedHoldings =
              if (remainingQuantity == 0) {
                profile.holdings.filter(func(h) { h.symbol != symbol });
              } else {
                profile.holdings.concat([{ symbol; quantity = remainingQuantity }]);
              };
            let updatedProfile = { profile with holdings = updatedHoldings; openLimitOrders = profile.openLimitOrders.concat([limitOrder]) };
            userProfiles.add(caller, updatedProfile);
          };
        };
      };
    };

    nextOrderId += 1;
    nextOrderId - 1;
  };

  public query ({ caller }) func getHoldings() : async [Holding] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view holdings");
    };
    let profile = getUserProfileInternal(caller);
    profile.holdings;
  };

  public query ({ caller }) func getActiveLimitOrders() : async [LimitOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    let profile = getUserProfileInternal(caller);
    profile.openLimitOrders.filter(func(order) { order.isActive });
  };

  public query ({ caller }) func getPortfolioValuation() : async PortfolioValuation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio valuation");
    };
    let profile = getUserProfileInternal(caller);
    var holdingsValue = 0;
    for (h in profile.holdings.values()) {
      let currentPrice = getCurrentPrice(h.symbol);
      holdingsValue += currentPrice.price * h.quantity;
    };

    var openPositionsValue = 0;
    for (order in profile.openLimitOrders.values()) {
      if (order.isActive) {
        openPositionsValue += order.price * order.remaining;
      };
    };

    let totalEquity = profile.cashBalance + holdingsValue + openPositionsValue;

    {
      cashBalance = profile.cashBalance;
      totalEquity;
      holdingsValue;
      openPositionsValue;
    };
  };

  // --------- Helper Functions ---------
  module PortfolioValuation {
    public func compare(pv1 : PortfolioValuation, pv2 : PortfolioValuation) : Order.Order {
      Nat.compare(pv1.totalEquity, pv2.totalEquity);
    };
  };

  module Price {
    public func compare(price1 : Price, price2 : Price) : Order.Order {
      switch (Text.compare(price1.symbol, price2.symbol)) {
        case (#greater) { #greater };
        case (#less) { #less };
        case (#equal) { Nat.compare(price1.price, price2.price) };
      };
    };
  };

  func getUserProfileInternal(user : Principal) : UserProfile {
    switch (userProfiles.get(user)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  func getCurrentPrice(symbol : Symbol) : Price {
    switch (prices.get(symbol)) {
      case (?price) { price };
      case (null) { Runtime.trap("Symbol does not exist") };
    };
  };

  func safeNatSub(a : Nat, b : Nat) : Nat {
    Int.abs(a - b);
  };

  public query ({ caller }) func getAllPrices() : async [Price] {
    prices.values().toArray().sort();
  };

  public query ({ caller }) func getPriceStats(symbol : Symbol) : async Price {
    switch (prices.get(symbol)) {
      case (?price) { price };
      case (null) { Runtime.trap("Symbol does not exist") };
    };
  };
};
