import React, {useState} from "react";
import PropTypes from "prop-types";

async function loginUser(credentials) {
    return fetch("http://localhost:3333/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Login Failed");
        }
        return data;
    });
}

export default function Login({setToken}) {
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser({
                email,
                password,
            });
            setToken(token);
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="login">
            <h1>LOGIN</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input id="email" type="email" onChange={(e) => setUsername(e.target.value)} required />
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
                <input id="submit" type="submit" value="Login" />
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
