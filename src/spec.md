# Specification

## Summary
**Goal:** Build the Aurex paper trading app (virtual investing simulator) with per-user accounts using Internet Identity, allowing simulated BUY/SELL market orders using a user-managed price board, plus dashboard/portfolio/history views and basic branding/theme.

**Planned changes:**
- Add Internet Identity authentication and ensure all simulator data (cash, holdings, history, prices) is isolated per authenticated user.
- Backend (single Motoko main actor): persist per-user virtual cash profile, positions per symbol, trade history (reverse-chronological), and a symbol->latest price board used for fills and valuation.
- Backend: implement BUY/SELL market order endpoints with validation (non-empty symbol, positive integer quantity, sufficient cash/holdings) and clear errors; return updated cash and position on success.
- Frontend: create sections/pages for Dashboard, Trade (BUY/SELL form), Portfolio (positions + valuation/P&L using latest prices), and History; navigate without reloads and refresh data after trades via React Query invalidation/refetch.
- Frontend + Backend: add UI to set/update the latest price per symbol for the simulator; require a price to exist before orders/valuation (prompt or clear error if missing).
- Frontend: add Aurex branding (prominent app name) and an About section that includes plain text “CEO: Harsh Gupta” without implying verification.
- Frontend: apply a coherent non-blue/non-purple primary visual theme (colors, typography, spacing, component styling) across the app.

**User-visible outcome:** Users can sign in with Internet Identity, manage a personal paper-trading account with virtual cash, set symbol prices, place simulated BUY/SELL market orders, and view their dashboard, portfolio valuation/P&L, and executed trade history in a consistently themed Aurex UI.
