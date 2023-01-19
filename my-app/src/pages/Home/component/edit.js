import { useState } from "react";
import { v4 } from "uuid";
const Edit = ({ add, summitting ,set , d ,t}) => {
  const [note, setNote] = useState("");
  function notechange(e) {
    setNote(e.target.value);
  }

  const [date, setDate] = useState("");
  function datechange(e) {
    setDate(e.target.value);
  }

  const [time, setTime] = useState("");
  function timechange(e) {
    setTime(e.target.value);
  }
  
  function addItem() {
    summitting.current = true;
    const remain = ""
    add(function (prevData) {
      return [
        {
          id: v4(),
          note,
          date,
          time,
          remain,
        },...prevData,
      ];
    });
  }

  return (
    <div>
      <p>{set}</p>
      <h1>備忘錄</h1>
      <p>事件:</p>
      <input type="text" value={note} onChange={notechange}></input>
      <p>日期:</p>
      <input type="date" value={date} onChange={datechange}></input>
      <p>時間:</p>
      <input type="time" value={time} onChange={timechange}></input>
      <button onClick={addItem} className="add">
        新增
      </button>
    </div>
  );
};

export default Edit;
