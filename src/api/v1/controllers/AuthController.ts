import { Request, Response } from "express"
import Auth from "../models/auth";
import bcrypt from 'bcrypt'
import { error, HTTP, HTTP_DESC, ResponseV1, Status, success } from "../../../types";
import { JWTHandler } from "../../../core/jwt";
import { JWTResponse } from "../../../core/types";
import { JwtPayload } from "jsonwebtoken";

const jwtHandler = new JWTHandler();

export const registerWithEmail = async (req: Request, res: Response) => {
    // Check if the user exists
    const authUser = await getUserByEmail(req.body.email);
    if (authUser) {
        return res.status(HTTP.CONFLICT).json({
            status: Status.Error,
            statusCode: HTTP.CONFLICT,
            statusMessage: HTTP_DESC.CONFLICT,
            data: { message: 'Failed' } as error
        } as ResponseV1)
    };

    // Register user
    const newAuthUser = new Auth({
        email: req.body.email,
        password: await hashPassword(req.body.password),
        name: req.body?.name ?? ''
    });

    await newAuthUser.save((err, result) => {
        if (err) {
            console.error(err);
            return res.status(HTTP.FORBIDDEN).json({
                status: Status.Error,
                statusCode: HTTP.FORBIDDEN,
                statusMessage: HTTP_DESC.FORBIDDEN,
                data: { message: 'Could not save user in the DB', error: err } as error
            } as ResponseV1);
        }

        return res.status(HTTP.OK).json({
            status: Status.Success,
            statusCode: HTTP.OK,
            statusMessage: HTTP_DESC.OK,
            data: { message: 'User registered successfully', data: result } as success
        } as ResponseV1);
    })
}

export const loginWithEmail = async (req: Request, res: Response) => {
    // Check if user exists
    const authUser = await getUserByEmail(req.body.email);
    if (!authUser) {
        return res.status(HTTP.BAD_REQUEST).json({
            status: Status.Error,
            statusCode: HTTP.BAD_REQUEST,
            statusMessage: HTTP_DESC.BAD_REQUEST,
            data: { message: 'User does not exists', error: new Error('Failed') } as error
        } as ResponseV1);
    }

    // Validate password
    if (!(await comparePasswords(req.body.password, authUser.password))) {
        return res.status(HTTP.BAD_REQUEST).json({
            status: Status.Error,
            statusCode: HTTP.BAD_REQUEST,
            statusMessage: HTTP_DESC.BAD_REQUEST,
            data: { message: 'Incorrect password', error: new Error('Failed') } as error
        } as ResponseV1);
    }

    authUser.refreshToken = await createNewRefreshToken(authUser);
    const accessToken = await jwtHandler.generateAccessToken(String(authUser._id))

    await authUser.save((err, result) => {
        if (err) {
            console.error(err);
            return res.status(HTTP.FORBIDDEN).json({
                status: Status.Error,
                statusCode: HTTP.FORBIDDEN,
                statusMessage: HTTP_DESC.FORBIDDEN,
                data: { message: 'Failed to login the user', error: err } as error
            } as ResponseV1);
        }

        return res.status(HTTP.OK)
            .header('access_token', accessToken)
            .header('refresh_token', result.refreshToken)
            .json({
                status: Status.Success,
                statusCode: HTTP.OK,
                statusMessage: HTTP_DESC.OK,
                data: { message: 'User logged in successfully', data: result } as success
            } as ResponseV1);
    });
}

const getUserByEmail = async (email: string) => {
    return await Auth.findOne({ email });
}

const hashPassword = async (password: string): Promise<String> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

const createNewRefreshToken = async (authUser: any) => {
    if (authUser.refreshToken) {
        const refreshTokenVerification: JWTResponse = jwtHandler.verifyRefreshToken(authUser.refreshToken);

        if (refreshTokenVerification.valid) {
            const refreshTokenData = refreshTokenVerification.data as JwtPayload
            const timeToExpire = refreshTokenData.exp! - Date.now() / 1000;

            if (timeToExpire > 0) {
                if (timeToExpire / 86400 > 2) {
                    return authUser.refreshToken;
                }
            }
        }
    }

    return await jwtHandler.generateRefreshToken(String(authUser._id));
}