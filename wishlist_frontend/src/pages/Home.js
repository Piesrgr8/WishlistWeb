import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function Home({getToken}) {
    const [wishlists, setWishlists] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:3333/wishlists", {headers: {Authorization: `Bearer ${getToken.token}`}})
            .then((e) => setWishlists(e.data));
    }, [getToken]);
    return (
        <div>
            <h1>HOME</h1>
            {wishlists.map((wishlist) => {
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
            })}
        </div>
    );
}
