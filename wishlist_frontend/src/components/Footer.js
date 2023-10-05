import React from "react";
import {Link, Navigate} from "react-router-dom";

export default function Footer() {
    const tokenString = JSON.parse(sessionStorage.getItem("token"));

    const currentlyLoggedIn = () => {
        if (tokenString) {
            return (
                <p>
                    Currently logged in as {tokenString.user.email}.{" "}
                    <Link to={"/"} onClick={signOut}>
                        Not you?
                    </Link>
                </p>
            );
        } else {
            return <Navigate to="/login"/>
        }
    };

    const signOut = () => {
        sessionStorage.removeItem("token");
        window.location.reload(false);
    };

    return <footer>{currentlyLoggedIn()}</footer>;
}
