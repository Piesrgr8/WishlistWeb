import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

export default function Wishlist({getToken}) {
    const [items, setItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:3333/wishlists/${id}`, {headers: {Authorization: `Bearer ${getToken.token}`}})
            .then((e) => {
                setItems(e.data.items);
                setWishlist(e.data);
            });
    }, [getToken]);

    return (
        <div>
            <h1>{wishlist.name}</h1>
            {items.map((item) => {
                return (
                    <li key={item.id}>
                        <h2>
                            {/* <Link to={`/wishlists/${wishlist.id}`} className="dark">
                                    {wishlist.name}
                                </Link> */}
                            {item.name}
                        </h2>
                        <p>{item.description}</p>
                    </li>
                );
            })}
        </div>
    );
}
