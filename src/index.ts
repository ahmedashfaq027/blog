import express, { Application, Request, Response } from 'express';
import { config } from 'dotenv'
import { connectToDatabase } from './core/db';
import { initializeServer } from './core';
import { HTTP, LOG, ResponseV1, Status, success } from './types';

config();

declare var process: {
    env: {
        DBURL: string,
        PORT: number | undefined
        ACCESS_TOKEN_EXPIRES: string | undefined,
        REFRESH_TOKEN_EXPIRES: string | undefined
    }
}

const port: number = process.env.PORT ?? 8000
const app: Application = express();
connectToDatabase(process.env.DBURL);
initializeServer(app, port);