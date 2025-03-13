import { CoinsState } from "../store/coinSlice";

export const recalculatePortfolio = (state: CoinsState) => {
  state.totalPrice = state.assets.reduce(
    (acc, { currentPrice, quantity }) => acc + currentPrice * quantity,
    0
  );

  state.assets = state.assets.map((asset) => ({
    ...asset,
    percentageOfPortfolio:
      Math.round(
        ((asset.quantity * asset.currentPrice) / state.totalPrice) * 100 * 100
      ) / 100,
  }));
};
