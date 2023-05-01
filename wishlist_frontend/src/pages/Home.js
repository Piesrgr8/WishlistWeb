import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Home({getToken}) {
    const [wishlists, setWishlists] = useState([]);
    const tokenString = JSON.parse(sessionStorage.getItem("token"));
    const [modalToggle, setModalToggle] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:3333/wishlists", {headers: {Authorization: `Bearer ${getToken.token}`}})
            .then((e) => setWishlists(e.data));
    }, [getToken]);

    const submitForm = () => {
        const form = document.querySelector("form");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                axios.post("http://localhost:3333/wishlists", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${getToken.token}`
                    },
                }).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                })
            })
        }
    }

    const WishlistModal = () => {
        return (
            <div className="wishlist-modal">
                <FontAwesomeIcon id="xbtn" icon={faX} onClick={() => setModalToggle(false)} />
                <div className="container">
                    <form>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name"/>
                        </div>
                        <div>
                           <label>Banner Link:</label>
                            <input type="text" name="url"/> 
                        </div>
                        <div>
                            <label>Description:</label>
                            <input type="text" name="desc"/>  
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
        <div className="home">
            <h1>HOME</h1>
            <button onClick={() => setModalToggle(true)}>Press me!</button>
            <div className="wishlist-lists">
                {
                    // eslint-disable-next-line
                    wishlists.map((wishlist) => {
                        if (tokenString.user.id === wishlist.user_id) {
                            return (
                                <Link to={`/wishlist/${wishlist.id}`} key={wishlist.id} className="dark">
                                    <li className="wishlist-item">
                                        <img src={wishlist.url} alt="Wishlist Banner" />
                                        <span id="namedesc">
                                            <h2>{wishlist.name}</h2>
                                            <p>{wishlist.description}</p>
                                        </span>
                                    </li>
                                </Link>
                            );
                        }
                    })
                }
            </div>
            {modalToggle ? WishlistModal() : <div></div>}
        </div>
    );
}
