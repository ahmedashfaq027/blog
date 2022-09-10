import { Response } from "express";
import { error, HTTP, HTTP_DESC, ResponseV1, Status } from "../../../types";

export const internalServerError = (res: Response, err: Error) => {
    console.error(err);
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        status: Status.Error,
        statusCode: HTTP.INTERNAL_SERVER_ERROR,
        statusMessage: HTTP_DESC.INTERNAL_SERVER_ERROR,
        data: { message: 'Internal server error', error: err } as error
    } as ResponseV1)
}