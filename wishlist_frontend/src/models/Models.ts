type TimeFields = {
    createdAt: string;
    updatedAt: string;
};

export type User = {
    id: number;
    email: string;
} & TimeFields;

export type Wishlist = {
    id: number;
    name: string;
    description: string;
    user: User;
    items?: Item[];
} & TimeFields;

export type Item = {
    id: number;
    name: string;
    wishlist?: Wishlist;
    user: User;
} & TimeFields;

export type Token = {
    token: string;
    expiration: string;
};

export type CurrentUserInfo = {
    user: User;
    token: Token;
};
