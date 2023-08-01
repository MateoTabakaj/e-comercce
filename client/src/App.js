import React, {useEffect,useState} from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./utils/theme";
import Main from "./Views/Main";
import LoginForm from "./Components/Login";
import RegistrationForm from "./Components/Register";
import Layout from "./Views/Layout";
import Profile from "./Components/Profile";
import Logout from "./Components/Logout";
import CreatePost from "./Components/CreatePost";
import UserSearch from "./Components/UserSearch";
import UserList from "./Components/UserList";
function App() {
  return (
    <div className="App">
          <ThemeProvider theme={theme}>

       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Main/>} />
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/search" element={<UserSearch/>}/>
          <Route path="/user/:id" element={<Profile/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path='/post/:id' element={<CreatePost/>} />
        </Route>
      </Routes>
    </BrowserRouter>
        </ThemeProvider>

    </div>
  );
}

export default App;
