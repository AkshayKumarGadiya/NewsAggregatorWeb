// import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Home from './components/home';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Preference from './components/preferences';
import AuthUser from './services/authenticationapi';
import { Profile } from './components/profile';
function App() {
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');

  const {getToken, token, logOut} = AuthUser();

  // Check if there is any token assigned to current user
  const logOutUser = () => {
      logOut();
  }
  if(!getToken()){
    return (<div>
      <div class="p-2 bg-secondary text-white text-center">
        <h1>News Aggregator Website</h1>
        <p>You can watch latest news from NewsAPI, OpenNews, and New York Times.</p> 
      </div>
      <Login />
    </div>
    )
  }
  return (
    <div>
      <div class="p-2 bg-secondary text-white text-center">
        <h1>News Aggregator Website</h1>
        <p>You can watch latest news from NewsAPI, OpenNews, and New York Times.</p> 
      </div>

      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link class="nav-link" to="/home">Home</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/setpreferences">Set Preferences</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/userprofile">Profile</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" onClick={logOutUser}>Sign Out</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/home" element={<Home author={author} source={source} />} />
          <Route path="/" element={<Login />} />
          <Route path="/setpreferences" element={<Preference setAuthor={setAuthor} setSourcesInfo={setSource} />} />
          <Route path="/userprofile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;