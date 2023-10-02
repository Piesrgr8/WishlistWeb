import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {faX, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Footer from "../components/Footer";

export default function Home({getToken}) {
    const [wishlists, setWishlists] = useState([]);
    const tokenString = JSON.parse(sessionStorage.getItem("token"));
    const nav = useNavigate();
    const [modalToggle, setModalToggle] = useState(false);
    const [deleteModalToggle, setDeleteModalToggle] = useState(false);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [url, setUrl] = useState("");

    const nameChange = (e) => {
        setName(e.target.value);
    };
    const descChange = (e) => {
        setDesc(e.target.value);
    };
    const urlChange = (e) => {
        setUrl(e.target.value);
    };

    useEffect(() => {
        axios
            .get("http://localhost:3333/wishlists", {headers: {Authorization: `Bearer ${getToken.token}`}})
            .then((e) => setWishlists(e.data));
    }, [getToken]);

    const submitForm = (event) => {
        event.preventDefault();
        axios
            .post(
                "http://localhost:3333/wishlists",
                {name: name, description: desc, url: url},
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${getToken.token}`,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                setModalToggle(false);
                nav(`/wishlist/${res.data.id}`);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const wishlistModal = () => {
        return (
            <div className="wishlist-modal">
                <div className="container">
                    <FontAwesomeIcon id="xbtn" icon={faX} onClick={() => setModalToggle(false)} />
                    <form onSubmit={submitForm}>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" onChange={nameChange} required />
                        </div>
                        <div>
                            <label>Banner Link:</label>
                            <input type="text" name="url" onChange={urlChange} />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" onChange={descChange} />
                        </div>
                        <div>
                            <button type="submit">Create Wishlist</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const deleteModal = () => {
        return (
            <div className="delete-modal">
                <div className="container">
                    <div className="xbutton">
                        <FontAwesomeIcon id="xbtn" icon={faX} onClick={() => setDeleteModalToggle(false)} />
                    </div>
                    <h1>Are you sure you want to delete?</h1>
                    <div className="options">
                        <button onClick={() => setDeleteModalToggle(false)}>Cancel</button>
                        <button onClick={() => null}>Delete</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="home" style={modalToggle || deleteModalToggle ? {filter: "blur(5px)"} : {}}>
                <div className="home-title">
                    <h1>Welcome Home!</h1>
                    <button onClick={() => setModalToggle(true)}>Create Wishlist</button>
                </div>
                <div className="wishlist-lists">
                    {
                        // eslint-disable-next-line
                        wishlists.map((wishlist) => {
                            if (tokenString.user.id === wishlist.user_id) {
                                return (
                                    <div className="wishlist-cont" key={wishlist.id}>
                                        <div className="wishlist-trash">
                                            <FontAwesomeIcon
                                                id="tbtn"
                                                icon={faTrash}
                                                onClick={() => setDeleteModalToggle(true)}
                                            />
                                        </div>
                                        <Link to={`/wishlist/${wishlist.id}`} className="dark">
                                            <li className="wishlist-item">
                                                <img src={wishlist.url} alt="Wishlist Banner" />
                                                <span id="namedesc">
                                                    <h2>{wishlist.name}</h2>
                                                    <p>{wishlist.description}</p>
                                                </span>
                                            </li>
                                        </Link>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
                <Footer />
            </div>
            {deleteModalToggle ? deleteModal() : <div></div>}
            {modalToggle ? wishlistModal() : <div></div>}
        </>
    );
}
