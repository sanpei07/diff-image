import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState  } from 'react';
const { myAPI } = window;

const Home:React.FC = () => {
  const [images1, setImages1] = useState([""]);
  const [images2, setImages2] = useState([""]);

  useEffect(()=>{
    myAPI.myPing();
    const removeListener = myAPI.onReceiveImages((files: string[],msg:string) => {
      if(msg == "images1") setImages1(files);
      if(msg == "images2") setImages2(files);
      console.log(msg);
    });
    return ()=>{
      removeListener();
    };
  },[])
  return (
    <div>
      <h1>Diff image</h1>
      <div><button onClick={()=>myAPI.openDir("images1")}>OPEN_DIR</button></div>
      {images1.map((image,index) => (
      <div style={{textAlign:'center',background:'#000',width:'200px'}}>
        <img src={image} height={200} style={{objectFit:"contain",}} onClick={()=>{}}></img>
        <img src={image} height={200} style={{objectFit:"contain",}} onClick={()=>{}}></img>
      </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
