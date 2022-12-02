import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './App.css';
import { UserContext } from './context/UserContext';

import ConfirmationPage from './pages/ConfirmationPage';
import HomePage from './pages/HomePage';
import ValidationPage from './pages/ValidationPage';


function App() {

  const [username, setUsername] = useState("");

  return (
    <UserContext.Provider value={{
      user: username,
      setUser: (u) => {
        setUsername(u)
      }
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
