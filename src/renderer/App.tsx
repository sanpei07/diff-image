import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState, useCallback  } from 'react';
import { useKey } from "rooks";
import { Button, Card ,Segment} from 'semantic-ui-react';
import './App.css';
const { myAPI } = window;

const APIMsg = {
  IMAGES1:"iamges1",
  IMAGES2:"iamges2",
}

const styles : {[key: string]:React.CSSProperties} = {
  dropAreaNormal:{
    //background:"#000"
    transition: "0.1s",
  },
  dropAreaOver:{
    //background:"#f00",
    //width:"80%",
    transition: "0.3s",
    transform:"scale(1.1,1.1)"
  }
}

const Home:React.FC = () => {
  const [images1, setImages1] = useState<string[]>([]);
  const [images2, setImages2] = useState<string[]>([]);
  const [imgNum,setImgNum] = useState(0);
  const [isOver1, setIsOver1] = useState(false);
  const [isOver2, setIsOver2] = useState(false);

  useKey(['ArrowLeft'],()=>{imagePrevious()});
  useKey(['ArrowRight'],()=>{imageNext()});
  useKey(['Delete'],()=>{imageDelete()});

  const openImage1Dir = () =>{
    myAPI.openDir(APIMsg.IMAGES1);
  }
  const openImage2Dir = () =>{
    myAPI.openDir(APIMsg.IMAGES2);
  }

  const imagePrevious  = () =>{
    if(images1.length > images2.length){
      (imgNum>0)?setImgNum(imgNum-1):setImgNum(images1.length-1);
    }else{
      (imgNum>0)?setImgNum(imgNum-1):setImgNum(images2.length-1);
    }
  }
  const imageNext =() =>{
    if(images1.length > images2.length){
      (imgNum<images1.length-1)?setImgNum(imgNum+1):setImgNum(0);
    }else{
      (imgNum<images2.length-1)?setImgNum(imgNum+1):setImgNum(0);
    }
  }

  const imageDelete =()=>{
    var result = window.confirm('削除してもよろしいでしょうか?');
    if(result){
      myAPI.deleteImage(images1[imgNum],images2[imgNum]);
      images1.splice(imgNum,1);
      images2.splice(imgNum,1);
      setImages1([...images1]);
      setImages2([...images2]);
    }
  }

  const dropFolder1 = (e:React.DragEvent) =>{
    setIsOver1(false);
    if(e.type == 'drop'){
      const fileList = e.dataTransfer.files;
      const path = fileList.item(0)?.path;
      if(path){
        myAPI.dropFolder(path,APIMsg.IMAGES1);
      }
    }
    if(e.type == "dragover"){
      setIsOver1(true);
    }
    e.preventDefault();
  }

  const dropFolder2 = (e:React.DragEvent) =>{
    setIsOver2(false);
    if(e.type == 'drop'){
      const fileList = e.dataTransfer.files
      const path = fileList.item(0)?.path;
      if(path){
        myAPI.dropFolder(path,APIMsg.IMAGES2);
      }
    }
    if(e.type == "dragover"){
      setIsOver2(true);
    }
    e.preventDefault();
  }

  const editbar = () =>{
    if(images1.length > 0 || images2.length > 0){
      return(
      <div className='flexdwrap'>
        <div id='editbar'>
        <Segment inverted>
            <Button className='editbutton' icon="arrow alternate circle left outline" onClick={()=>{imagePrevious()}}/>
            <Button className='editbutton' icon="folder open outline" onClick={()=>{openImage1Dir()}}/>
            <Button className='editbutton' icon="trash alternate outline" onClick={()=>{imageDelete();}}/>  
            <Button className='editbutton' icon="folder open outline" onClick={()=>{openImage2Dir()}}/>
            <Button className='editbutton' icon="arrow alternate circle right outline" onClick={()=>{imageNext()}}/>
          </Segment>
        </div>
      </div>);
    }else{
      return(<></>);
    }
  }

  useEffect(()=>{
    myAPI.myPing();
    const removeListener = myAPI.onReceiveImages((files: string[],msg:string) => {
      if(msg == APIMsg.IMAGES1) setImages1(files);
      if(msg == APIMsg.IMAGES2) setImages2(files);
      console.log(msg);
    });
    return ()=>{
      removeListener();
    };
  },[])

  return (

    <div id='container'>
      
      <div id='body'>
        <div className='bodyImageWrap'>
          {(images1.length > 0)? 
            (<img src={images1[imgNum]}
              style={(isOver1)?styles.dropAreaOver:styles.dropAreaNormal} 
              className='bodyImage'
              onDragOver={(e)=>{dropFolder1(e)}}
                onDragEnter={(e)=>{dropFolder1(e)}}
                onDrop={(e)=>{dropFolder1(e)}}
                onDragLeave={(e)=>{dropFolder1(e)}}/>):
            (<div
                style={(isOver1)?styles.dropAreaOver:styles.dropAreaNormal}
                className='dropArea' 
                onDragOver={(e)=>{dropFolder1(e)}}
                onDragEnter={(e)=>{dropFolder1(e)}}
                onDrop={(e)=>{dropFolder1(e)}}
                onDragLeave={(e)=>{dropFolder1(e)}}
                onClick={()=>{openImage1Dir()}}>
                FOLDER1
              </div>)}
        </div>
        <div className='bodyImageWrap'>
          {(images2.length > 0)? 
            (<img src={images2[imgNum]}
              style={(isOver2)?styles.dropAreaOver:styles.dropAreaNormal}
              onDragOver={(e)=>{dropFolder2(e)}}
              onDragEnter={(e)=>{dropFolder2(e)}}
              onDrop={(e)=>{dropFolder2(e)}}
              onDragLeave={(e)=>{dropFolder2(e)}}
              className='bodyImage' />):
            (<div
                style={(isOver2)?styles.dropAreaOver:styles.dropAreaNormal}
                className='dropArea'
                onDragOver={(e)=>{dropFolder2(e)}}
                onDragEnter={(e)=>{dropFolder2(e)}}
                onDrop={(e)=>{dropFolder2(e)}}
                onDragLeave={(e)=>{dropFolder2(e)}}
              onClick={()=>{openImage2Dir()}}>
              FOLDER2
            </div>)}
        </div>
        {editbar()}
      </div>

      <div id='sidebar'>
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
