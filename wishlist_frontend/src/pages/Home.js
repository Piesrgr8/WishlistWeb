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
        <div>
            <h1>HOME</h1>
            {// eslint-disable-next-line
            wishlists.map((wishlist) => {
                if (tokenString.user.id === wishlist.user_id) {
                return (
                    <li key={wishlist.id}>
                        <h2>
                            <Link to={`/wishlist/${wishlist.id}`} className="dark">
                                {wishlist.name}
                            </Link>
                        </h2>
                        
                        <p>{wishlist.description}</p>
                        <div className="author">
                            <span className="label">created by</span>
                            <span className="author-email">{wishlist.user.email}</span>
                        </div>
                    </li>
                );
            }
            })}
        </div>
    );
}
