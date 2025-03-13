import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button";
import "./form.scss";
import { FC, useState } from "react";
import FormItem from "./form-item/form-item";
import Input from "../input/input";
import { RootState } from "../../store";
import { addAsset, updateAsset } from "../../store/coinSlice";

interface FormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const Form: FC<FormProps> = ({ setIsOpen }) => {
  const [currentItem, setCurrentItem] = useState<null | {
    baseAsset: string;
    lastPrice: string;
    priceChangePercent: string;
    symbol: string;
  }>(null);

  const [searchCoin, setSearchCoin] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");

  const dispatch = useDispatch();

  const coins = useSelector((state: RootState) => state.coins.coins);
  const assets = useSelector((state: RootState) => state.coins.assets);

  const filterCoins =
    coins?.filter(({ baseAsset }) =>
      baseAsset.toUpperCase().includes(searchCoin.toUpperCase())
    ) || [];

  const handleAddAsset = () => {
    if (currentItem && quantity) {
      if (assets.find(({ symbol }) => symbol === currentItem.symbol)) {
        dispatch(updateAsset({ symbol: currentItem.symbol, quantity }));
      } else {
        dispatch(
          addAsset({
            name: currentItem?.baseAsset,
            symbol: currentItem?.symbol,
            quantity: quantity,
            currentPrice: Number(currentItem?.lastPrice),
            purchasePrice: Number(currentItem?.lastPrice),
            change24h: Number(currentItem?.priceChangePercent),
          })
        );
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="form-container">
      <Input
        placeholder="Поиск валюты"
        value={searchCoin}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchCoin(e.target.value)
        }
      />
      <div className="list-coin">
        {filterCoins.map(
          ({ baseAsset, lastPrice, priceChangePercent, symbol }) => (
            <FormItem
              key={symbol}
              baseAsset={baseAsset}
              lastPrice={lastPrice}
              priceChangePercent={priceChangePercent}
              setCurrentItem={() =>
                setCurrentItem({
                  baseAsset,
                  lastPrice,
                  priceChangePercent,
                  symbol,
                })
              }
            />
          )
        )}
      </div>
      {currentItem && (
        <div className="add-block">
          <div className="current-coin">
            <span>{currentItem.baseAsset}</span>
            <span>{currentItem.lastPrice}</span>
          </div>
          <Input
            placeholder="Количество"
            type="number"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuantity(Number(e.target.value))
            }
            min={1}
            max={1000}
          />
          <div className="add-block__buttons">
            <Button
              text="Добавить"
              disabled={!quantity}
              onClick={handleAddAsset}
            />
            <Button text="Отмена" onClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
