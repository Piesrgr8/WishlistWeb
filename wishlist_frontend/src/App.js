import axios from "axios";
import React, {useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Home from "./pages/Home";
import Login from "./pages/Login";
import useToken from "./components/useToken";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
    const {token, setToken} = useToken();

    const [modalToggle, setModalToggle] = useState(false);

    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [url, setUrl] = useState('')

    const nameChange = (e) => {setName(e.target.value)}
    const descChange = (e) => {setDesc(e.target.value)}
    const urlChange = (e) => {setUrl(e.target.value)}

    const state = {
        name: name,
        description: desc,
        url: url
    }

    if (!token) {
        return <Login setToken={setToken} />;
    }

    const submitForm = () => {
        const formData = new FormData(state);
        axios.post("http://localhost:3333/wishlists", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const WishlistModal = () => {
        return (
            <div className="wishlist-modal">
                <FontAwesomeIcon id="xbtn" icon={faX} onClick={() => setModalToggle(false)} />
                <div className="container">
                    <form>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" onChange={nameChange}/>
                        </div>
                        <div>
                           <label>Banner Link:</label>
                            <input type="text" name="url" onChange={urlChange}/> 
                        </div>
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" onChange={descChange}/>  
                        </div>
                        <div>
                            <button onClick={submitForm()}>Create Wishlist</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home getToken={token} />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/wishlist/:id" element={<Wishlist getToken={token} />} />
                </Routes>
                <Footer />
            </div>
            <div className="AppModals">

            </div>
        </Router>
    );
}

export default App;
