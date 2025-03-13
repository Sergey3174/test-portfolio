import { Asset } from "../store/coinSlice";

export const saveAssetsToLocalStorage = (assets: Asset[]) => {
  try {
    localStorage.setItem("assets", JSON.stringify(assets));
  } catch (error) {
    console.error("Ошибка сохранения assets в localStorage:", error);
  }
};
