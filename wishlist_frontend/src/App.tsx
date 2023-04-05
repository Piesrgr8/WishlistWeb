import React, {useState} from "react";
import {BrowserRouter as Routes, Route, BrowserRouter, Router} from "react-router-dom";
import {CurrentUserInfo} from "./models/Models";
import {UserProvider} from "./contexts/UserProvider";
import "./assets/css/App.css";
import HomePage from "./pages/HomePage";
import {getCurrentUserInfoFromLocalStorage} from "./api/API";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "the-new-css-reset/css/reset.css";

function App() {
    const [currentUserInformation, setCurrentUserInformation] = useState<CurrentUserInfo | null>(
        getCurrentUserInfoFromLocalStorage()
    );

    return (
        <UserProvider.Provider value={[currentUserInformation, setCurrentUserInformation]}>
            <>
                <Router>
                    <div className={"site-content"}>
                        <Header />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/register" element={<Registration />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/404" element={<NotFound />} />
                        </Routes>
                    </div>
                    <Footer />
                </Router>
            </>
        </UserProvider.Provider>
    );
}

export default App;
