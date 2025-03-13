import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { deleteAsset } from "../../../store/coinSlice";
import "./list-rows.scss";

const ROW_HEIGHT = 50;

const ListRows = () => {
  const assets = useSelector((state: RootState) => state.coins.assets);
  const dispatch = useDispatch();

  const itemData = useMemo(() => assets, [assets]);

  const handleDelete = useCallback(
    (symbol: string) => {
      dispatch(deleteAsset({ symbol }));
    },
    [dispatch]
  );

  const RowRenderer = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const asset = itemData[index];
      return (
        <div
          style={style}
          className="table-row"
          key={asset.symbol}
          onClick={() => handleDelete(asset.symbol)}
        >
          <div className="table-row-item">{asset.name}</div>
          <div className="table-row-item">{asset.quantity}</div>
          <div className="table-row-item">${asset.currentPrice}</div>
          <div className="table-row-item">
            ${(asset.currentPrice * asset.quantity).toFixed(2)}
          </div>
          <div
            className={`table-row-item ${
              asset.change24h < 0 ? "red" : "green"
            }`}
          >
            {asset.change24h}%
          </div>
          <div className="table-row-item">{asset.percentageOfPortfolio}%</div>
        </div>
      );
    },
    [itemData, handleDelete]
  );

  return (
    <List
      height={500}
      itemCount={itemData.length}
      itemSize={ROW_HEIGHT}
      width="100%"
    >
      {RowRenderer}
    </List>
  );
};

export default ListRows;
