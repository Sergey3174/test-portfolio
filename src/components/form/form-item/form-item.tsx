import { FC } from "react";
import "./form-item.scss";

interface FormItemProps {
  baseAsset: string;
  lastPrice: string;
  priceChangePercent: string;
  setCurrentItem: () => void;
}

const FormItem: FC<FormItemProps> = ({
  baseAsset,
  lastPrice,
  priceChangePercent,
  setCurrentItem,
}) => {
  return (
    <div className="form-item" onClick={setCurrentItem}>
      <span>{baseAsset}</span>
      <span>${lastPrice}</span>
      <span className={Number(priceChangePercent) >= 0 ? "plus" : "minus"}>
        {priceChangePercent}%
      </span>
    </div>
  );
};

export default FormItem;
