import "./header-table.scss";

type Row = {
  name: string;
  id: number;
};

const ROWS: Row[] = [
  { name: "Актив", id: 1 },
  { name: "Количество", id: 2 },
  { name: "Цена", id: 3 },
  { name: "Общая стоимость", id: 4 },
  { name: "Изм. за 24 ч.", id: 5 },
  { name: "% портфеля", id: 6 },
];

const HeaderTable = () => {
  return (
    <div className="header-table">
      {ROWS.map(({ name, id }) => (
        <div className="header-row-item" key={id}>
          {name}
        </div>
      ))}
    </div>
  );
};

export default HeaderTable;
