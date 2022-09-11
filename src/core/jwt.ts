import path from 'path';
import fs, { ObjectEncodingOptions } from 'fs';
import jwt from 'jsonwebtoken';
import { KEYS, JWTResponse } from './types'
import { LOG } from '../types';

enum KEYS_PATH {
    PRIVATE_KEY = '../../keys/private.pem',
    PUBLIC_KEY = '../../keys/public.pem',
    PRIVATER_KEY = '../../keys/privater.pem',
    PUBLICR_KEY = '../../keys/publicr.pem'
}

export class JWTHandler {

    keys: { [x: string]: string }

    constructor() {
        this.keys = {
            [KEYS.PRIVATE_KEY]: '',
            [KEYS.PUBLIC_KEY]: '',
            [KEYS.PRIVATER_KEY]: '',
            [KEYS.PUBLICR_KEY]: ''
        }
    }

    fetchKey = function (keyPath: string): string {
        return fs.readFileSync(path.join(__dirname, keyPath), { encoding: 'utf-8' })
    }

    fetchKeys = () => {
        console.info(`${LOG.INIT} Fetching keys`);

        this.keys[KEYS.PRIVATE_KEY] = this.fetchKey(KEYS_PATH.PRIVATE_KEY);
        this.keys[KEYS.PUBLIC_KEY] = this.fetchKey(KEYS_PATH.PUBLIC_KEY);
        this.keys[KEYS.PRIVATER_KEY] = this.fetchKey(KEYS_PATH.PRIVATER_KEY);
        this.keys[KEYS.PUBLICR_KEY] = this.fetchKey(KEYS_PATH.PUBLICR_KEY);
    }

    decodeJWT = (token: string, secret: jwt.Secret): JWTResponse => {
        try {
            return {
                valid: true,
                data: jwt.verify(token, secret)
            }
        } catch (error) {
            return {
                valid: false,
                data: error as string
            }
        }
    }

    generateJWT = (payload: string | object, secret: jwt.Secret, expiresIn: string): string => {
        return jwt.sign({ payload }, secret, { algorithm: 'RS256', expiresIn });
    }

    generateAccessToken = async (authId: string) => {
        console.info(`${LOG.INIT} Generating Access Token`);
        if (!this.keys[KEYS.PRIVATE_KEY]) {
            this.keys[KEYS.PRIVATE_KEY] = this.fetchKey(KEYS_PATH.PRIVATE_KEY);
        }

        const expiry: string = process.env.ACCESS_TOKEN_EXPIRES || '1d';
        return this.generateJWT(authId, this.keys[KEYS.PRIVATE_KEY], expiry);
    }

    generateRefreshToken = async (authId: string) => {
        console.info(`${LOG.INIT} Generating Refresh Token`);
        if (!this.keys[KEYS.PRIVATER_KEY]) {
            this.keys[KEYS.PRIVATER_KEY] = this.fetchKey(KEYS_PATH.PRIVATER_KEY);
        }

        const expiry: string = process.env.REFRESH_TOKEN_EXPIRES || '1d';
        return this.generateJWT(authId, this.keys[KEYS.PRIVATER_KEY], expiry);
    }

    verifyAccessToken = (token: string): JWTResponse => {
        console.info(`${LOG.INIT} Verifying Access Token`);
        if (!this.keys[KEYS.PUBLIC_KEY]) {
            this.keys[KEYS.PUBLIC_KEY] = this.fetchKey(KEYS_PATH.PUBLIC_KEY);
        }

        return this.decodeJWT(token, this.keys[KEYS.PUBLIC_KEY]);
    }

    verifyRefreshToken = (token: string): JWTResponse => {
        console.info(`${LOG.INIT} Verifying Refresh Token`);
        if (!this.keys[KEYS.PUBLICR_KEY]) {
            this.keys[KEYS.PUBLICR_KEY] = this.fetchKey(KEYS_PATH.PUBLICR_KEY);
        }

        return this.decodeJWT(token, this.keys[KEYS.PUBLICR_KEY]);
    }
}