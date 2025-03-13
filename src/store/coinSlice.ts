import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { recalculatePortfolio } from "../utils/recalculate";
import { saveAssetsToLocalStorage } from "../utils/saveLocalStore";
import { loadAssetsFromLocalStorage } from "../utils/loadLocalStorage";

interface Coin {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: string;
  priceChangePercent: string;
}

export interface Asset {
  name: string;
  symbol: string;
  quantity: number;
  currentPrice: number;
  purchasePrice: number;
  change24h: number;
  percentageOfPortfolio?: number;
}

export interface CoinsState {
  assets: Asset[];
  coins: Coin[];
  status: "idle" | "loading" | "resolved" | "failed";
  error: string | null;
  totalPrice: number;
}

const initialState: CoinsState = {
  assets: loadAssetsFromLocalStorage(),
  coins: [],
  status: "idle",
  error: null,
  totalPrice: 0,
};

type ApiCoin = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

type updateAsset = {
  symbol: string;
  quantity: number;
};

export const fetchCoins = createAsyncThunk<
  Coin[],
  void,
  { rejectValue: string }
>("coins/fetchCoins", async function (_, { rejectWithValue }) {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");

    if (!response.ok) {
      throw new Error("Ошибка при загрузке данных");
    }

    const data: ApiCoin[] = await response.json();

    return data
      .filter((item) => item.symbol.includes("USDT"))
      .map((item) => ({
        symbol: item.symbol,
        baseAsset: item.symbol.replace("USDT", ""),
        quoteAsset: "USDT",
        lastPrice: item.lastPrice,
        priceChangePercent: item.priceChangePercent,
      }));
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Неизвестная ошибка"
    );
  }
});

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    addAsset(state, action: PayloadAction<Asset>) {
      state.assets.push(action.payload);
      recalculatePortfolio(state);
      saveAssetsToLocalStorage(state.assets);
    },
    updateAsset(
      state,
      action: PayloadAction<{ symbol: string; quantity: number }>
    ) {
      state.assets = state.assets.map((asset) =>
        asset.symbol === action.payload.symbol
          ? { ...asset, quantity: asset.quantity + action.payload.quantity }
          : asset
      );

      recalculatePortfolio(state);
      saveAssetsToLocalStorage(state.assets);
    },

    updateAssetWebSocket(
      state,
      action: PayloadAction<{
        symbol: string;
        currentPrice: number;
        change24h: number;
      }>
    ) {
      state.assets = state.assets.map((asset) =>
        asset.symbol === action.payload.symbol
          ? {
              ...asset,
              currentPrice: action.payload.currentPrice,
              change24h: action.payload.change24h,
            }
          : asset
      );
      recalculatePortfolio(state);
      saveAssetsToLocalStorage(state.assets);
    },

    deleteAsset(state, action: PayloadAction<{ symbol: string }>) {
      state.assets = state.assets.filter(
        ({ symbol }) => symbol !== action.payload.symbol
      );

      recalculatePortfolio(state);
      saveAssetsToLocalStorage(state.assets);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<Coin[]>) => {
        state.status = "resolved";
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Неизвестная ошибка";
      });
  },
});

export const { addAsset, updateAsset, updateAssetWebSocket, deleteAsset } =
  coinsSlice.actions;
export default coinsSlice.reducer;
