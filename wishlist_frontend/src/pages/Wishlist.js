import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams, useNavigate} from "react-router-dom";

import {faTrash, faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import amazonlogo from "../assets/media/amazon_icon.png";
import targetlogo from "../assets/media/target_icon.png";
import walmartlogo from "../assets/media/walmart_logo.png";
import unknownlogo from "../assets/media/unknown_item.png";

export default function Wishlist({getToken}) {
    const [items, setItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const {id} = useParams();

    const [modalToggle, setModalToggle] = useState(false);

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
            return amazonlogo;
        } else if (url === "target") {
            return targetlogo;
        } else if (url === "walmart") {
            return walmartlogo;
        } else {
            return unknownlogo;
        }
    };

    const bannerUrl = () => {
        return wishlist.url
    }

    const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}

    const submitForm = (event) => {
        event.preventDefault()
        axios.delete(`http://localhost:3333/wishlists/${wishlist.id}`, {
            headers: {
                "Authorization": `Bearer ${getToken.token}`
            },
        }).then((res) => {
            console.log(res);
            goBack()
        }).catch((err) => {
            console.log(err);
        })
    }

    const deleteModal = () => {
        return(
            <div className="delete-modal">
                <FontAwesomeIcon id="xbtn" icon={faX} onClick={() => setModalToggle(false)} />
                <div className="container">
                    <h1>Are you sure you want to delete?</h1>
                    <div>
                        <button onClick={() => setModalToggle(false)}>Cancel</button>
                        <button onClick={submitForm}>Delete</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
        <div className="wishlist">
            <div className="wishlist-banner" style={{backgroundImage: `url('${bannerUrl()}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                <h1>{wishlist.name}</h1>
                <FontAwesomeIcon id="tbtn" icon={faTrash} onClick={() => setModalToggle(true)} />
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
        {modalToggle ? deleteModal() : <div></div>}
        </> 
    );
}
