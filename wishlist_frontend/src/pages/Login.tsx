import React, { FormEvent, useCallback, useContext, useMemo, useState } from "react";
import { UserProvider } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import API, { APIError, setCurrentUserInfoToLocalStorage } from "../api/API";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentUserInfo, setCurrentUserInfo] = useContext(UserProvider);
    const navigate = useNavigate();

    const submitForm = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            try {
                const result = await API.login(email, password);
                setCurrentUserInfoToLocalStorage(result);
                setCurrentUserInfo?.(result);
                navigate("/wishlists");
            } catch (e) {
                setNetworkError(e as APIError);
            }
        },
        [email, navigate, password, setCurrentUserInfo]
    );

    const loginDisabled = useMemo(() => {
        if (email.length > 0 && API.validateEmail(email) && password.length > 0) {
            return false;
        }
        return true;
    }, [email, password]);
    
    return (
        <main className="login">
            <h1>Login</h1>
            <form onSubmit={submitForm}>
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} required={true} onChange={(e) => {setEmail(e.target.value);}}/>
                </div>
                <div className="input-container">
                    <label htmlFor="email">Password</label>
                    <input type="password" value={password} required={true} onChange={(e) => {setPassword(e.target.value);}}/>
                </div>
                <button disabled={loginDisabled} className="btnlogin">
                    Login
                </button>
            </form>
        </main>
    );
}
