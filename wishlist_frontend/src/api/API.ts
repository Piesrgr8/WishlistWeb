import {User, CurrentUserInfo, Wishlist, Item} from "../models/Models";

export type APIError = {
    isError: boolean;
    code: number;
    codeText: string;
    message?: string;
};

const CURRENT_USER_INFO_KEY = "currentUserInfo";

export const getCurrentUserInfoFromLocalStorage = (): CurrentUserInfo | null => {
    const info = localStorage.getItem(CURRENT_USER_INFO_KEY);
    if (info == null) {
        return null;
    }
    const json = JSON.parse(info) as CurrentUserInfo;
    return json;
};

export const setCurrentUserInfoToLocalStorage = (info: CurrentUserInfo) => {
    localStorage.setItem(CURRENT_USER_INFO_KEY, JSON.stringify(info));
};

export const clearCurrentUserInfoFromLocalStorage = () => {
    localStorage.removeItem(CURRENT_USER_INFO_KEY);
};

const getToken = (): string | null => {
    return getCurrentUserInfoFromLocalStorage()?.token.token ?? null;
};

const validateEmail = (email: string) => {
    //eslint-disable-next-line
    if (
        //eslint-disable-next-line
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            email
        )
    ) {
        return true;
    }
    return false;
};

//eslint-disable-next-line
const convertTimeToCamelCase = (json: any) => {
    if (Array.isArray(json)) {
        json.map((childJson) => convertTimeToCamelCase(childJson));
    }
    for (const key in json) {
        if (Array.isArray(json[key])) {
            convertTimeToCamelCase(json[key]);
        } else if (key === "created_at") {
            json.createdAt = json[key];
        } else if (key === "updated_at") {
            json.updatedAt = json[key];
        }
    }
};

const register = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.statusText,
        } as APIError;
    }
    return (await response.json()) as User;
};

const login = async (email: string, password: string): Promise<CurrentUserInfo> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 400 ? "Invalid Username and Password" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    return {
        token: {token: result.token.token, expiration: result.token.expires_at},
        user: result.user,
    } as CurrentUserInfo;
};

const getWishlists = async (): Promise<Wishlist[]> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/wishlists`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message:
                response.status === 401 ? "Authentication token has expired please log in again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Wishlist[];
};

const createWishlist = async (name: string, description: string): Promise<Wishlist> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/wishlists`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({name, description}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message:
                response.status === 400
                    ? "Something went wrong with the request"
                    : response.status === 401
                    ? "Authorization error. Please login again"
                    : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result as Wishlist;
};

const editWishlist = async (wishlistId: number, name: string, description: string): Promise<Wishlist> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/wishlists/${wishlistId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({name, description}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization problem. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result;
};

const getWishlist = async (wishlistId: number): Promise<Wishlist> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/wishlists/${wishlistId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Wishlist;
};

const createItem = async (wishlistId: number, name: string): Promise<Item> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({wishlistId, name}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result as Item;
};

const editItem = async (itemId: number, name: string): Promise<Item> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/items/${itemId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({itemId, name}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Item;
};

const getItem = async (itemId: number): Promise<Item> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/items/${itemId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please Login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Item;
};

const API = {
    validateEmail,
    register,
    login,
    getWishlists,
    createWishlist,
    editWishlist,
    getWishlist,
    createItem,
    editItem,
    getItem,
};

export default API;
