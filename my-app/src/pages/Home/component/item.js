const Item = ({ id, note, date, time, remain, deleteData, summitting }) => {
  function deletedata() {
    summitting.current = true;
    deleteData(function (prev) {
      return prev.filter((item) => id !== item.id);
    });
  }
  return (
    <div className="item">
      <div>
        <p>{note}</p>
        <p>{`${date} ${time}`}</p>
      </div>
      <p>{remain}</p>
      <button onClick={deletedata} className="remove">
        刪除
      </button>
    </div>
  );
};

export default Item;
