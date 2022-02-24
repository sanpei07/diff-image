import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState  } from 'react';
import { Button, Card} from 'semantic-ui-react';


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
      <div><Button onClick={()=>myAPI.openDir("images1")}>OPEN_DIR</Button></div>
      <div><Button onClick={()=>myAPI.openDir("images2")}>OPEN_DIR</Button></div>
      <div style={{"width":200}}>
      <Card.Group itemsPerRow={2}>
      {images1.map((image,index) => (
        <>
        <Card raised image={image} />
        <Card raised image={images2[index]} />
        </>
      ))}
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
