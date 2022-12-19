declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_HOST?: string;
    POSTGRES_PORT?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_USER?: string;
    POSTGRES_DB?: string;
    DATABASE_URL?: string;

    APP_NAME?: string;
    SERVER_PORT?: string;
    BASE_DOMAIN?: string;
    SERVER_URL?: string;
    CLINET_URL?: string;

    FT_CLIENT_ID?: string;
    FT_CLIENT_SECRET?: string;
    FT_CALLBACK_URL?: string;
    FT_TOKEN_URL?: string;
    FT_AUTHORIZATION_URL?: string;

    JWT_ACCESS_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_ACCESS_EXPIRATION_TIME?: string;
    JWT_REFRESH_EXPIRATION_TIME?: string;

    DEFAULT_IMAGE_URL?: string;
    DUMMY_URL?: string;
  }
}
