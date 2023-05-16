import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthUser(){
    const navigate = useNavigate();

    // Get Token as well as user info for frontend application
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userTokenInfo = JSON.parse(tokenString);
        return userTokenInfo;
    }

    const getUserInfo = () => {
        const userString = sessionStorage.getItem('user');
        const userInformation = JSON.parse(userString);
        return userInformation;
    }

    const logOut = () => {
        sessionStorage.clear();
        navigate('/');
    }

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUserInfo());

    const saveTokentoSessionStorage = (user, token) => {
        sessionStorage.setItem('token',JSON.stringify(token));
        sessionStorage.setItem('user',JSON.stringify(user));

        setToken(token);
        setUser(user);
        navigate('/home');
    }
    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/api",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    return{
        saveTokentoSessionStorage: saveTokentoSessionStorage,
        token,
        user,
        getToken,
        logOut,
        http
    }
}