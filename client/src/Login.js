import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const add = () => {
        console.log(email, password);
        let data = JSON.stringify({
            email: email,
            password: password,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4000',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios
            .request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                toast.success(response.data.message);
                localStorage.setItem("email", email);
                localStorage.setItem("token", response.data.token);
                setTimeout(() => {
                    navigate('/todo');
                },3000);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const nav = () => {
        navigate('/register');
    };

    // useEffect(() => {
    //     const socket = new WebSocket('ws://localhost:8080');
    //     socket.onmessage = (e) => {
    //         console.log(e)
    //         toast(e.data)
    //     }
    // })

    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-box">
                <h2>Login</h2>
                <div className="input-group">
                    <label>Email</label>
                    <input name="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={add} className="submit-btn">Submit</button>
                <button onClick={nav} className="register-btn">Not a user?</button>
            </div>
        </div>
    );
};

export default Login;
