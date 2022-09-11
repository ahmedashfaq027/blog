import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { error, HTTP, HTTP_DESC, LOG, ResponseV1, Status, success } from '../types';

// Routes
import authRoute from '../api/v1/routes/auth';
import blogRoute from '../api/v1/routes/blog';

const setRoutes = (app: Application) => {
    console.log(`${LOG.INIT} Setting up routes for api/v1`);

    // Routes Middleware
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/blog', blogRoute);

    handleInvalidRoutes(app);
}

const handleInvalidRoutes = (app: Application) => {
    app.use((req: Request, res: Response, _) => {
        const response: ResponseV1 = {
            status: Status.Error,
            statusCode: HTTP.NOT_FOUND,
            statusMessage: HTTP_DESC.NOT_FOUND,
            data: {} as error
        }

        if (req.accepts('html')) {
            response.data = { message: '<h3>404. Not found</h3>' } as error;
        }
        else {
            response.data = { message: 'Route not found' } as error;
        }

        return res.json(response);
    });
}

const configureServer = (app: Application) => {
    console.info(`${LOG.INIT} Configuring Server`);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // Request logging
    app.use((req: Request, _, next: NextFunction) => {
        console.log(`\nReq: ${req.method} ${req.url} ${new Date().toString()} ${req.connection?.remoteAddress}`);
        next();
    });

    setRoutes(app);
}

export const initializeServer = (app: Application, port: number) => {
    configureServer(app);

    console.info(`${LOG.INIT} Starting up server`);
    app.listen(port, () => console.info(`${LOG.SUCCESS} Listening on port ${port}`));
}