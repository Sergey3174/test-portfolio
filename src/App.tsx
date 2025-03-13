import { useEffect, useState } from "react";
import Modal from "./components/modal/modal";
import "./App.scss";
import Header from "./components/header/header";
import { fetchCoins } from "./store/coinSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import PortfolioTable from "./components/portfolio-table/portfolio-table";
import Loader from "./components/loader/loader";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const assets = useSelector((state: RootState) => state.coins.assets);
  const status = useSelector((state: RootState) => state.coins.status);
  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  const renderContent = () => {
    if (status === "loading" || status === "idle") return <Loader />;
    if (assets.length) return <PortfolioTable />;
    return (
      <div className="message">
        <h1>
          Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
        </h1>
      </div>
    );
  };

  return (
    <div className="container-app">
      <Header setIsOpen={setIsOpen} />
      {renderContent()}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default App;
