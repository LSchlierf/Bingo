import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BingoGame from './BingoGame';
import Imprint from './Imprint';
import EditSet from './EditSet';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='game' element={<BingoGame />} />
      <Route path='imprint' element={<Imprint />} />
      <Route path='contact' element={<Navigate replace to='/imprint' />} />
      <Route path='edit' element={<EditSet />} />
    </Routes>
  </BrowserRouter>
);