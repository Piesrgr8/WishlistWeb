import React, {useState} from "react";
import PropTypes from "prop-types";

async function loginUser(credentials) {
    return fetch("http://localhost:3333/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

export default function Login({setToken}) {
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password,
        });
        setToken(token);
    };

    return (
        <div className="login">
            <h1>LOGIN</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" />
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
