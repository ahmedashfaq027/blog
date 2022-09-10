import { JwtPayload } from "jsonwebtoken";

export enum KEYS {
    PRIVATE_KEY = 'PRIVATE_KEY',
    PUBLIC_KEY = 'PUBLIC_KEY',
    PRIVATER_KEY = 'PRIVATER_KEY',
    PUBLICR_KEY = 'PUBLICR_KEY',
}

export interface JWTResponse {
    valid: boolean;
    data: string | JwtPayload;
}

export enum TokenType {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
}