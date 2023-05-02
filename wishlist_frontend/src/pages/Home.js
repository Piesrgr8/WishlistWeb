import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Home({getToken}) {
    const [wishlists, setWishlists] = useState([]);
    const tokenString = JSON.parse(sessionStorage.getItem("token"));
    const [modalToggle, setModalToggle] = useState(false);

    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [url, setUrl] = useState('')

    const nameChange = (e) => {setName(e.target.value)}
    const descChange = (e) => {setDesc(e.target.value)}
    const urlChange = (e) => {setUrl(e.target.value)}

    useEffect(() => {
        axios
            .get("http://localhost:3333/wishlists", {headers: {Authorization: `Bearer ${getToken.token}`}})
            .then((e) => setWishlists(e.data));
    }, [getToken]);

    const submitForm = (event) => {
        event.preventDefault()
        axios.post("http://localhost:3333/wishlists", { name: name, description: desc, url: url}, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken.token}`
            },
        }).then((res) => {
            res.preventDefault()
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
                    <form onSubmit={submitForm}>
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
                            <button type='submit'>Create Wishlist</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <>
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
        </div>
        {modalToggle ? WishlistModal() : <div></div>}
        </>
    );
}
