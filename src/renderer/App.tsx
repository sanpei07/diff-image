import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState  } from 'react';
const { myAPI } = window;

const Home:React.FC = () => {
  useEffect(()=>{
    myAPI.myPing();
  },[])
  return (
    <div>
      <h1>Diff image</h1>
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
