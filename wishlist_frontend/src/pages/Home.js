import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function Home({getToken}) {
    const [wishlists, setWishlists] = useState([]);
    const tokenString = JSON.parse(sessionStorage.getItem("token"));

    useEffect(() => {
        axios
            .get("http://localhost:3333/wishlists", {headers: {Authorization: `Bearer ${getToken.token}`}})
            .then((e) => setWishlists(e.data));
    }, [getToken]);

    return (
        <div className="home">
            <h1>HOME</h1>
            <div className="wishlist-lists">
                {// eslint-disable-next-line
                wishlists.map((wishlist) => {
                    if (tokenString.user.id === wishlist.user_id) {
                    return (
                        <Link to={`/wishlist/${wishlist.id}`} className="dark">
                            <li className="wishlist-item" key={wishlist.id}>
                                <img src={wishlist.url} alt="Wishlist Banner"/>
                                <span id="namedesc">
                                    <h2>{wishlist.name}</h2>
                                    <p>{wishlist.description}</p>
                                </span>
                            </li>
                        </Link>
                    );
                }
            })}
            </div>
        </div>
    );
}
