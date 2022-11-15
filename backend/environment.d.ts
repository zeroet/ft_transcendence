declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_HOST?: string;
    POSTGRES_PORT?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_USER?: string;
    POSTGRES_DB?: string;
    DATABASE_URL?: string;
    SERVER_PORT?: string;

    CLIENT_ID?: string;
    CLIENT_SECRET?: string;
    CALLBACK_URL?: string;
    TOKEN_URL?: string;
    AUTHORIZATION_URL?: string;

    JWT_SECRET?: string;
  }
}
