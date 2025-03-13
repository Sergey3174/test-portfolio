import Button from "../button/button";
import "./header.scss";
import { FC } from "react";

interface HeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({ setIsOpen }) => {
  return (
    <header className="header">
      <h1>Portfolio Overview</h1>
      <Button text="Добавить" onClick={() => setIsOpen(true)} />
    </header>
  );
};

export default Header;
