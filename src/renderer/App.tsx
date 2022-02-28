import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState  } from 'react';
import { Button, Card} from 'semantic-ui-react';
import './App.css';
const { myAPI } = window;

const styles : {[key: string]:React.CSSProperties} = {
  container:{
      display: 'flex',
      height: '100vh',
  },
  sidebar:{
      width: '210px',
      background: '#f9c',
      overflowY: 'auto',
  },
  body:{
      flex: 1,
      background: '#9cf',
      overflowY: 'auto',
  }
}

const Home:React.FC = () => {
  const [images1, setImages1] = useState([""]);
  const [images2, setImages2] = useState([""]);
  const [imgNum,setImgNum] = useState(0);

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
    <div style={styles.container}>
      <div style={styles.sidebar}>
      <Card.Group itemsPerRow={2}>
      {images1.map((image,index) => (
        <>
        <Card raised image={image} onClick={()=>{setImgNum(index)}} />
        <Card raised image={images2[index] } onClick={()=>{setImgNum(index)}} />
        </>
      ))}
      </Card.Group>
      </div>
      <div style={styles.body}>
        <div><Button onClick={()=>myAPI.openDir("images1")}>OPEN_DIR</Button></div>
        <div><Button onClick={()=>myAPI.openDir("images2")}>OPEN_DIR</Button></div>
        <button onClick={()=>{setImgNum(imgNum-1)}}>previous</button>
        <button onClick={()=>{setImgNum(imgNum+1)}}>next</button>
        <button onClick={()=>{myAPI.deleteImage(images1[imgNum],images2[imgNum])}}>delete</button>
        <img src={images1[imgNum]}></img>
        <img src={images2[imgNum]}></img>
      </div>
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
