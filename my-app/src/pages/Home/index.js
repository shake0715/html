import { useEffect, useState, useRef } from "react";
import { API_GET_DATA } from "../../global/constants";
import Edit from "./component/edit";
import List from "./component/list";
import "./index.css";

function getdate(date){
  return new Promise((done)=>{
    var days = date/1000/3600/24
    var day = Math.floor(days)
    var hours = (days-day)*24
    var hour = Math.floor(hours)
    var minutes = (hours-hour)*60
    var minute = Math.floor(minutes)
    var seconds = (minutes-minute)*60
    var second = Math.floor(seconds)
    var str="剩餘"+day.toString()+"天"+hour.toString()+"時"+minute.toString()+"分"+second.toString()+"秒"
     done(str)
  });
  
};
async function FetchTime(setData, summitting,time,date1,setreset) {
  const res = await fetch(API_GET_DATA);
  const { data } = await res.json();
  const d =date1
  summitting.current=true;
  for(let i=0;i<data.length;i++){
    var str = "";
    str=str+(data[i].date).toString()+" "+(data[i].time).toString()
    var temp = new Date(str)
    var day = temp.getTime();
    var time1 = d+time
    //console.log(day-time1)
    if(day-time1>-1000&&day-time1<=0){
      alert( data[i].note + "時間到")
      setData(data.filter(item=>item.time!==data[i].time))
      setreset(false)
      break;
    }
    else{
      getdate(day-time1).then((value)=>{
        data[i].remain=value
      }).then(()=>{
        setData(data)
      })
      
    }
  }
}

async function FetchData(setData, setpending,summitting) {
  const res = await fetch(API_GET_DATA);
  const { data } = await res.json();
  const date = new Date();
  summitting.current=true;
  setData(data.filter(function (item){
    var str = "";
    str=str+(item.date).toString()+" "+(item.time).toString()
    const day = new Date(str)
    return day>date
  }));
  setpending(false);
}
async function fetchset(data) {
  await fetch(API_GET_DATA, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
}
const Home = () => {
  const [data, setData] = useState([]);
  const [pending, setpending] = useState(true);
  const [reset,setreset] = useState(true);
  const [time,setTime] = useState(0)
  const date = useRef(0)
  const summitting = useRef(false);
  const interval = useRef(null)
  useEffect(()=>{
    if(reset===false) {
      setreset(true)
      setTime(0)
      return clearInterval(interval.current);
    }
    clearInterval(interval.current);
    date.current = new Date().getTime();
    interval.current = setInterval(() => {
      setTime(prevtime=>prevtime+1000)
    }, 1000);
  },[reset])
  
  
  useEffect(()=>{
    FetchTime(setData, summitting,time,date.current,setreset)
  },[time])

  useEffect(() => {
    if (!summitting.current) {
      return;
    }
    fetchset(data).then((data) => (summitting.current = false));
  }, [data]);
  
  useEffect(() => {
    setTimeout(() => {
      FetchData(setData, setpending,summitting);
    }, 1000);
  }, []);

  return (
    <div className="app">
      <Edit set={time} add={setData} summitting={summitting} />
      {pending && <div>Loading...</div>}
      <List listData={data} deleteData={setData} summitting={summitting} />
    </div>
  );
};

export default Home;
