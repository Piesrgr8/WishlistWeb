import React from "react";

export default function Footer() {
    const tokenString = JSON.parse(sessionStorage.getItem("token"));

    const currentlyLoggedIn = () => {
        if (tokenString) {
            return <p>Currently logged in as {tokenString.user.email}.</p>;
        } else {
            return <p>Not Logged In</p>;
        }
    };
    return <footer>{currentlyLoggedIn()}</footer>;
}
