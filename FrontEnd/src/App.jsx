import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './components/home/home.jsx'
import Retrieve from './components/retrievePage/retrieve.jsx'
import Login from './components/auth/Login.jsx'
import Signup from './components/auth/Signup.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/retrieve" element={<Retrieve/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
