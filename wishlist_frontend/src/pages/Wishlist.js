import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";

import amazonlogo from "../assets/media/amazon_icon.png"
import targetlogo from "../assets/media/target_icon.png"
import walmartlogo from "../assets/media/walmart_logo.png"
import unknownlogo from "../assets/media/unknown_item.png"

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

    // const getThumb = async (url) => {
    //     var header = {
    //         "User-Agent":
    //             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    //         adapter: ["xhr", "http", "https"],
    //     };
    //     console.log(url);
    //     await axios.get(url, header).then((e) => {
    //         console.log(e);
    //     });
    // };

    const urlIdent = (url) => {
        if (url === "amazon") {
            return amazonlogo
        } else if (url === "target") {
            return targetlogo
        } else if (url === "walmart") {
            return walmartlogo
        } else {
            return unknownlogo
        }
    }

    return (
        <div className="wishlist">
            <div className="wishlist-banner">
                <img src={wishlist.url} alt=""/>
                <h1>{wishlist.name}</h1>
            </div>
            <div className="item-container">
                {items.map((item) => {
                    return (
                        <Link to={item.url} key={item.id}>
                            <li className="item-item">
                                <img src={urlIdent(item.url)} alt="What You are Getting" />
                                <span id="namedesc">
                                    <h2>{item.name}</h2>
                                    <p>{item.desc}</p>
                                </span>
                            </li>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
