import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState, useCallback,useRef  } from 'react';
import { useKey } from "rooks";
import Modal from "react-modal";
import { Button, Card ,Segment} from 'semantic-ui-react';
import {AiFillFolderOpen} from 'react-icons/ai'
import {BsArrowLeftCircle,BsArrowRightCircle,BsFolderSymlink} from 'react-icons/bs'
import {RiDeleteBin6Line} from 'react-icons/ri'
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
  },
}
const modalStyle : {[key: string]:React.CSSProperties} = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.85)"
  },
  content:{
    position:"absolute",
    top: "50%",
    left: "50%",
    padding:0,
    backgroundColor: "#333",
    color: "#fff",
    border: 0,
    borderRadius:"0.6rem",
    width:"30rem",
    height:"15rem",
    transform:"translateX(-50%) translateY(-50%) ",
    boxShadow: "0 0 8px black",
    overflow:"hidden"
  }
}

const Home:React.FC = () => {
  const [images1, setImages1] = useState<string[]>([]);
  const [images2, setImages2] = useState<string[]>([]);
  const [imgNum,setImgNum] = useState(0);
  const [isOver1, setIsOver1] = useState(false);
  const [isOver2, setIsOver2] = useState(false);
  const [isOpenDialog,setIsOpenDialog] = useState(false);

  useKey(['ArrowLeft'],()=>{imagePrevious()});
  useKey(['ArrowRight'],()=>{imageNext()});
  useKey(['Delete'],()=>{showDeleteDialog()});

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
  const showDeleteDialog =()=>{
    if(images1.length >0 || images2.length > 0)setIsOpenDialog(true);
  }

  const closeDeleteDialog =()=>{
    setIsOpenDialog(false);
  }

  const imageDelete =()=>{
      myAPI.deleteImage(images1[imgNum],images2[imgNum]);
      images1.splice(imgNum,1);
      images2.splice(imgNum,1);
      setImages1([...images1]);
      setImages2([...images2]);
      if(imgNum >= images1.length && imgNum >= images2.length){
        setImgNum(Math.max(images1.length-1 , images2.length-1));
      }
      closeDeleteDialog();
  }

  const dropFolder1 = (e:React.DragEvent) =>{
    setIsOver1(false);
    
    if(e.type == 'drop'){
      
      const fileList = e.dataTransfer.files;
      let path = fileList.item(0)?.path;
      const type = fileList.item(0)?.type;
      
      if(path){
        if(type=="image/jpeg" || type=="image/png"){
          var s1 = path.split("\\").pop();
          path = path.replace(s1!,"");
          console.log(path)
        }
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
      let path = fileList.item(0)?.path;
      const type = fileList.item(0)?.type;

      if(path){
        if(type=="image/jpeg" || type=="image/png"){
          var s1 = path.split("\\").pop();
          path = path.replace(s1!,"");
          console.log(path)
        }
        myAPI.dropFolder(path,APIMsg.IMAGES2);
      }
    }
    if(e.type == "dragover"){
      setIsOver2(true);
    }
    e.preventDefault();
  }

  const editbar = () =>{
    if(images1.length >= 0 || images2.length >= 0){
      return(
      <div className='flexdwrap'>
        <div id='editbar'>
        
            <button className='editbutton' onClick={()=>{imagePrevious()}}>
              <BsArrowLeftCircle size={50}  color={"#fff"}/>
            </button>
            <button  className='editbutton' onClick={()=>{openImage1Dir()}}>
              <AiFillFolderOpen size={50}  color={"#fff"}/>
            </button>
            <button className='editbutton' onClick={()=>{showDeleteDialog();}}>
              <RiDeleteBin6Line size={50} color={"#fff"} />
            </button>
            <button  className='editbutton' onClick={()=>{openImage2Dir()}}>
              <AiFillFolderOpen size={50}  color={"#fff"}/>
            </button>
            <button className='editbutton' onClick={()=>{imageNext()}}>
              <BsArrowRightCircle size={50}  color={"#fff"}/>
            </button>
          
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
      setImgNum(0);
      ////console.log(msg);
    });
    return ()=>{
      removeListener();
    };
  },[])

  return (
    <>
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
                <BsFolderSymlink size={100} color={"#ddd"}/>
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
              <BsFolderSymlink size={100} color={"#ddd"}/>
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
      <Modal style={modalStyle} isOpen={isOpenDialog}  onRequestClose={() => setIsOpenDialog(false)}>
        <div className='dialog-headder'>
          <h3>このファイルを削除しますか?</h3>
        </div>
        <div className='dialog-content'>
          このファイルを削除してもよろしてでしょうか?
        </div>
        <footer className='dialog-footer'>
          <button className='dialog-delete' onClick={()=>{imageDelete()}}>削除</button>
          <button className='dialog-cancel' onClick={()=>{closeDeleteDialog()}}>キャンセル</button>
        </footer>
    </Modal>
    </div>
    
    </>
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
