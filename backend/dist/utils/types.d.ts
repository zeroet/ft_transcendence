export declare type UserDetails = {
    intra_id: string;
    email: string;
    image_url: string;
    username: string;
};
export declare type Tokens = {
    access_token: string;
    refresh_token: string;
};
export declare enum Cookies {
    ACCESS_TOKEN = "accessToken",
    REFRESH_TOKEN = "refreshToken"
}
