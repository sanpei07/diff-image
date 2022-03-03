import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState  } from 'react';
import { Button, Card ,Segment} from 'semantic-ui-react';
import './App.css';
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
  },
  bodyImageWrap:{
    width:'50%',
    height:'100%',
    display: 'inline-flex',
    alignItems: "center",
    justifyContent:"center",
    verticalAlign:"middle",
  },
  bodyImage:{
    width:'100%',
  },
  dropArea:{
    width:'70%',
    height:'70%',
    border:"1rem solid #aaa",
    borderRadius:'1rem',
    fontSize:"3rem",
    display: 'inline-flex',
    alignItems: "center",
    justifyContent:"center",
    verticalAlign:"middle",
    cursor: "pointer",
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
  const [images1, setImages1] = useState<string[]>([]);
  const [images2, setImages2] = useState<string[]>([]);
  const [imgNum,setImgNum] = useState(0);

  const openImage1Dir = () =>{
    myAPI.openDir("images1");
  }
  const openImage2Dir = () =>{
    myAPI.openDir("images2");
  }

  const imageNext = () =>{
    (imgNum>0)?setImgNum(imgNum-1):setImgNum(images1.length-1);
  }
  const imagePrevious =() =>{
    (imgNum<images1.length-1)?setImgNum(imgNum+1):setImgNum(0);
  }

  const imageDelete =()=>{
    myAPI.deleteImage(images1[imgNum],images2[imgNum]);
    images1.splice(imgNum,1);
    images2.splice(imgNum,1);
    setImages1([...images1]);
    setImages2([...images2]);
  }

  useEffect(()=>{
    myAPI.myPing();
    ///images1.pop();
    //setImages1([...images1]);
    console.log(images1.length);
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
      
      <div style={styles.body}>

        <div style={styles.bodyImageWrap}>
          {(images1.length > 0)? 
            (<img src={images1[imgNum]} style={styles.bodyImage} ></img>):
            (<div style={styles.dropArea} onClick={()=>{openImage1Dir()}}>FOLDER1</div>)}
        </div>
        <div style={styles.bodyImageWrap}>
          {(images2.length > 0)? 　
            (<img src={images2[imgNum]} style={styles.bodyImage} ></img>):
            (<div style={styles.dropArea} onClick={()=>{openImage2Dir()}}>FOLDER2</div>)}
        </div>

        <div style={styles.fixedwrap}><div style={styles.editbar}>
          <Segment>
            <Button icon="arrow alternate circle left outline" style={styles.editbutton} onClick={()=>{imageNext()}}></Button>
            <Button icon="folder open outline" onClick={()=>{openImage1Dir()}}/>
            <Button icon="trash alternate outline" style={styles.editbutton} onClick={()=>{
              var result = window.confirm('ボタンをクリックしてください');
              }}>  
            </Button>
            <Button icon="folder open outline" onClick={()=>{openImage2Dir()}}/>
            <Button icon="arrow alternate circle right outline" style={styles.editbutton} onClick={()=>{imagePrevious()}}></Button>
          </Segment>
        </div>
      </div>
      </div>

      <div style={styles.sidebar}>
        <Card.Group itemsPerRow={2}>
          {(images1.length>images2.length)?(images1.map((image,index) => (
          <>
          <Card raised image={image} onClick={()=>{setImgNum(index)}} />
          <Card raised image={images2[index] } onClick={()=>{setImgNum(index)}} />
          </>
          ))):(images2.map((image,index) => (
            <>
            <Card raised image={images1[index]} onClick={()=>{setImgNum(index)}} />
            <Card raised image={image} onClick={()=>{setImgNum(index)}} />
            </>
            )))}
        </Card.Group>
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
