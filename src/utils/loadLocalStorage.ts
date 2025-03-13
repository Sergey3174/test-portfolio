import { Asset } from "../store/coinSlice";

export const loadAssetsFromLocalStorage = (): Asset[] => {
  try {
    const assets = localStorage.getItem("assets");
    return assets ? JSON.parse(assets) : [];
  } catch (error) {
    console.error("Ошибка загрузки assets из localStorage:", error);
    return [];
  }
};
