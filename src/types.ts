export enum LOG {
    INIT = '[INIT]',
    INFO = '[INFO]',
    WARN = '[WARN]',
    SUCCESS = '[SUCCESS]',
    ERROR = '[ERROR]'
}

export enum HTTP_DESC {
    OK = 'OK',
    PERMANENT_REDIRECT = 'PERMANENT_REDIRECT',
    TEMPORARY_REDIRECT = 'TEMPORARY_REDIRECT',
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    GONE = 'GONE',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export enum HTTP {
    OK = 200,
    PERMANENT_REDIRECT = 301,
    TEMPORARY_REDIRECT = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    GONE = 410,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

export enum Status {
    Success = 'Success',
    Error = 'Error'
}

export interface ResponseV1 {
    status: Status;
    statusCode: HTTP;
    statusMessage: HTTP_DESC;
    data: success | error;
}

export interface success {
    message: string;
    data: object;
}

export interface error {
    message: string;
    error?: Error;
    fieldName?: string;
}