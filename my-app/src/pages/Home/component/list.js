import Item from "./item";

const List = ({ listData, deleteData, summitting }) => {
  return (
    <div className="list">
      {listData.map((item) => {
        const { id, note, date, time , remain} = item;
        return (
          <Item
            key={id}
            id={id}
            note={note}
            date={date}
            time={time}
            remain={remain}
            deleteData={deleteData}
            summitting={summitting}
          />
        );
      })}
    </div>
  );
};

export default List;
