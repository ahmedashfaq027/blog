import { NextFunction, Request, Response } from "express";
import { JWTHandler } from "../../../core/jwt";
import { JWTResponse, TokenType } from "../../../core/types";
import { error, HTTP, HTTP_DESC, ResponseV1, Status } from "../../../types";
import { loginValidation, registerValidation } from "../utils/validators";

const jwtHandler = new JWTHandler()

export const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    return validateToken(req, res, next, TokenType.ACCESS_TOKEN);
}

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    return validateToken(req, res, next, TokenType.REFRESH_TOKEN);
}

const validateToken = (req: Request, res: Response, next: NextFunction, tokenType: TokenType) => {
    const token: string[] = req.header('Authorization')?.toString().split(" ") ?? [];
    const verification: JWTResponse = (tokenType === TokenType.ACCESS_TOKEN) ? jwtHandler.verifyAccessToken(token[1] ?? '') : jwtHandler.verifyRefreshToken(token[1] ?? '');
    if (verification.valid) {
        return next();
    }

    const response: ResponseV1 = {
        status: Status.Error,
        statusCode: HTTP.UNAUTHORIZED,
        statusMessage: HTTP_DESC.UNAUTHORIZED,
        data: { message: 'Failed' } as error
    }

    return res.status(HTTP.UNAUTHORIZED).json(response);
}

export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
    return checkOrValidateAccessToken(req, res, next, false);
}

export const checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    return checkOrValidateRefreshToken(req, res, next, false);
}

export const checkAndValidateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    return checkOrValidateAccessToken(req, res, next, true);
}

export const checkAndValidateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    return checkOrValidateRefreshToken(req, res, next, true);
}

const checkOrValidateAccessToken = (req: Request, res: Response, next: NextFunction, validate: boolean) => {
    if (!req.header('Authorization')) {
        sendError('Unauthorized', new Error('Specify valid Headers'), res, HTTP.UNAUTHORIZED, HTTP_DESC.UNAUTHORIZED);
    }

    const response: ResponseV1 = {
        status: Status.Error,
        statusCode: HTTP.UNAUTHORIZED,
        statusMessage: HTTP_DESC.UNAUTHORIZED,
        data: { message: 'Failed' } as error
    }

    const authHeader: string[] | undefined = req.header('Authorization')?.toString().split(" ");
    if (authHeader && authHeader[0] === 'Bearer') {
        if (!authHeader[1]) {
            sendError('Invalid Token', new Error('Specify valid Headers'), res, HTTP.BAD_REQUEST, HTTP_DESC.BAD_REQUEST);
        }

        if (validate) {
            const verification: JWTResponse = jwtHandler.verifyAccessToken(authHeader[1]);
            if (verification.valid) {
                return next();
            }
        } else {
            return next();
        }
    }

    return res.status(HTTP.UNAUTHORIZED).json(response)
}

const checkOrValidateRefreshToken = (req: Request, res: Response, next: NextFunction, validate: boolean) => {
    if (!req.header('Authorization')) {
        sendError('Unauthorized', new Error('Specify valid Headers'), res, HTTP.UNAUTHORIZED, HTTP_DESC.UNAUTHORIZED);
    }

    const response: ResponseV1 = {
        status: Status.Error,
        statusCode: HTTP.UNAUTHORIZED,
        statusMessage: HTTP_DESC.UNAUTHORIZED,
        data: { message: 'Invalid auth type' } as error
    }

    const authHeader: string[] | undefined = req.header('Authorization')?.toString().split(" ");
    if (authHeader && authHeader[0] === 'Basic') {
        if (!authHeader[1]) {
            sendError('Invalid Token', new Error('Specify valid Headers'), res, HTTP.BAD_REQUEST, HTTP_DESC.BAD_REQUEST);
        }

        if (validate) {
            const verification: JWTResponse = jwtHandler.verifyRefreshToken(authHeader[1]);
            if (verification.valid) {
                return next();
            }
        } else {
            return next();
        }
    }

    return res.status(HTTP.UNAUTHORIZED).json(response)
}

export const validateRegisterFields = (req: Request, res: Response, next: NextFunction) => {
    validateRegisterOrLoginFields(req, res, next, true);
}

export const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
    validateRegisterOrLoginFields(req, res, next, false);
}

const validateRegisterOrLoginFields = (req: Request, res: Response, next: NextFunction, register: boolean) => {
    const { error } = register ? registerValidation(req.body) : loginValidation(req.body);
    if (error) {
        return sendError(error.details[0].message, error, res, HTTP.BAD_REQUEST, HTTP_DESC.BAD_REQUEST);
    }

    if (!passwordValid(req.body.password)) {
        return sendError('Password must contain atleast one numeric, one special character and is 6-16 letters long', new Error(), res, HTTP.BAD_REQUEST, HTTP_DESC.BAD_REQUEST)
    }

    next();
}

const sendError = (message: string, error: Error, res: Response, statusCode: HTTP, statusMessage: HTTP_DESC) => {
    const response: ResponseV1 = {
        status: Status.Error,
        statusCode,
        statusMessage,
        data: { message, error } as error
    }

    return res.status(statusCode).json(response);
}

const passwordValid = (password: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    return regex.test(password);
}