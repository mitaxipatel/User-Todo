import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Register = () => {
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
            url: 'http://localhost:4000/adduser',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios
            .request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
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
            </div>
        </div>
    );
};

export default Register;
