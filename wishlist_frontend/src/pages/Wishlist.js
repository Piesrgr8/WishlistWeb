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
    }, [getToken, id]);

    const getThumb = async (url) => {
        var header = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "adapter": ["xhr", "http", "https"]
        }
        console.log(url)
        await axios.get(url, header).then((e) => {
            console.log(e)
        })
    }

    return (
        <div className="wishlist">
            <h1>{wishlist.name}</h1>
            {items.map((item) => {
                return (
                    <li key={item.id}>
                        <h2>
                            {item.name}
                        </h2>
                        <p>{item.url}</p>
                        <img src={getThumb("https://www.bsu.edu/")}/>
                        <p>{item.desc}</p>
                    </li>
                );
            })}
        </div>
    );
}
