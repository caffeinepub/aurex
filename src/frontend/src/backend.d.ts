import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    tradeHistory: Array<Trade>;
    openLimitOrders: Array<LimitOrder>;
    holdings: Array<Holding>;
    cashBalance: bigint;
}
export type Symbol = string;
export interface Holding {
    quantity: bigint;
    symbol: Symbol;
}
export interface Trade {
    profitLoss: bigint;
    orderType: OrderType;
    positionSize: bigint;
    entryPrice: bigint;
    exitPrice: bigint;
    symbol: Symbol;
}
export interface PortfolioValuation {
    openPositionsValue: bigint;
    totalEquity: bigint;
    cashBalance: bigint;
    holdingsValue: bigint;
}
export interface LimitOrder {
    id: bigint;
    orderType: OrderType;
    isActive: boolean;
    quantity: bigint;
    remaining: bigint;
    price: bigint;
    symbol: Symbol;
}
export interface Price {
    price: bigint;
    symbol: Symbol;
}
export enum OrderType {
    buy = "buy",
    sell = "sell"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    depositFunds(amount: bigint): Promise<void>;
    getActiveLimitOrders(): Promise<Array<LimitOrder>>;
    getAllPrices(): Promise<Array<Price>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHoldings(): Promise<Array<Holding>>;
    getPortfolioValuation(): Promise<PortfolioValuation>;
    getPrice(symbol: Symbol): Promise<Price | null>;
    getPriceStats(symbol: Symbol): Promise<Price>;
    getProfile(): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeProfile(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeLimitOrder(symbol: Symbol, orderType: OrderType, price: bigint, quantity: bigint): Promise<bigint>;
    placeMarketOrder(symbol: Symbol, orderType: OrderType, quantity: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePrice(_price: Price): Promise<void>;
}
