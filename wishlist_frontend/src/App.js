import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import useToken from "./components/useToken";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";
import Header from "./components/Header"

function App() {
    const {token, setToken} = useToken();

    if (!token) {
        return <Login setToken={setToken} />;
    }

    return (
        <Router>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/" element={<Home getToken={token} />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/wishlist/:id" element={<Wishlist getToken={token} />} />
                </Routes>
            </div>
            <Footer/>
        </Router>
    );
}

export default App;
