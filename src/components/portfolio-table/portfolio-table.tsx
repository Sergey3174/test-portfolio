import "./portfolio-table.scss";
import HeaderTable from "./header-table/header-table";
import ListRows from "./list-rows/list-rows";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useMemo } from "react";
import { updateAssetWebSocket } from "../../store/coinSlice";

const UPDATE_INTERVAL = 5000;

const PortfolioTable = () => {
  const assets = useSelector((state: RootState) => state.coins.assets);
  const dispatch = useDispatch();

  const coinsSymbols = useMemo(
    () =>
      assets.length > 0
        ? assets.map(({ symbol }) => `${symbol.toLowerCase()}@ticker`).join("/")
        : null,
    [assets]
  );

  useEffect(() => {
    if (!coinsSymbols) return;

    const fetchData = () => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/stream?streams=${coinsSymbols}`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data?.stream && data?.data) {
          const { s: symbol, c: price, P: change24h } = data.data;

          dispatch(
            updateAssetWebSocket({
              symbol,
              currentPrice: Number(price),
              change24h: Number(change24h),
            })
          );
        }
      };

      ws.onerror = () => {
        ws.close();
      };

      setTimeout(() => {
        ws.close();
      }, 2000);
    };

    fetchData();
    const interval = setInterval(fetchData, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, coinsSymbols]);

  return (
    <div className="portfolio-table">
      <HeaderTable />
      <ListRows />
    </div>
  );
};

export default PortfolioTable;
