import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState  } from 'react';
import { Button, Card ,Segment} from 'semantic-ui-react';
import './App.css';
import { callbackify } from 'util';
const { myAPI } = window;

const styles : {[key: string]:React.CSSProperties} = {
  container:{
      display: 'flex',
      height: '100vh',
  },
  sidebar:{
      width: '220px',
      background: '#f9c',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding:'10px'
  },
  body:{
      flex: 1,
      background: '#9cf',
      overflowY: 'auto',
      //margin:'0 auto',
      //alignItems: 'center',
      //justifyContent: 'center',
      //width: '100vh',
      // height: '100vh',
  },
  bodyImage:{
    width:'50%',
  },
  fixedwrap:{
    //position:'fixed',
    width:'100%',
    //height: '100%',
    //textAlign:'center',
    margin:'0 auto',
  },
  editbar:{
    position:'fixed',
    bottom:"10%",
    //left: '50%', //leftを使用すると親できなくなるので使用しない
    transform:'translateX(-50%)',
    //margin:'auto',
    //inset: 0,
    //display:'inline-block',
    marginLeft:'calc(50% - 110px)',
  },
  editbutton:{
    width:'75px',
    height:'75px'
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
        <Card><Button icon="folder open outline" onClick={()=>myAPI.openDir("images1")}/></Card>
        <Card><Button icon="folder open outline" onClick={()=>myAPI.openDir("images2")}></Button></Card>
      {images1.map((image,index) => (
        <>
        <Card raised image={image} onClick={()=>{setImgNum(index)}} />
        <Card raised image={images2[index] } onClick={()=>{setImgNum(index)}} />
        </>
      ))}
      </Card.Group>
      </div>
      <div style={styles.body}>
        <img src={images1[imgNum]} style={styles.bodyImage} ></img>
        <img src={images2[imgNum] } style={styles.bodyImage}></img>
        <div style={styles.fixedwrap}><div style={styles.editbar}>
        <Segment>
        <Button icon="arrow alternate circle left outline" style={styles.editbutton} onClick={()=>{setImgNum(imgNum-1)}}></Button>
        <Button icon="arrow alternate circle left outline" style={styles.editbutton} onClick={()=>{setImgNum(imgNum-1)}}></Button>
        <Button icon="arrow alternate circle right outline" style={styles.editbutton} onClick={()=>{setImgNum(imgNum+1)}}></Button>
        <Button icon="trash alternate outline" style={styles.editbutton} onClick={()=>{
          myAPI.deleteImage(images1[imgNum],images2[imgNum]);
          images1.splice(imgNum,1);
          images2.splice(imgNum,1);
          setImages1([...images1]);
          setImages2([...images2]);
          }}></Button>
          </Segment>
          </div>
          </div>
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
