import './App.css';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import About from "./components/About";
import { Home } from "./components/Home";
import Navbar from "./components/Navbar";
import NoteState from './context/notes/Notestate';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
function App() {
   
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null)
    },1500)
  } 

  return (
    <>
      <NoteState>//wrapping application in NoteState context so that all the variables inside it can be available inside all the components
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              {/* <Route  strict exact path="/about"><About/></Route>
              <Route strict exact  path="/"><Home/></Route> */}
              <Route path="/" element={<Home showAlert={showAlert} />}></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/login" element={<Login showAlert={showAlert} />}></Route>
              <Route path="/signup" element={<Signup showAlert={showAlert} />}></Route>

            </Routes>
          </div>
        </Router>
      </NoteState>

    </>
  );
}

export default App;
