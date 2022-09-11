import mongoose from 'mongoose';
import { LOG } from '../types';

export const connectToDatabase = (connectionString: string) => {
    console.info(`${LOG.INIT} Connecting to Database`);

    mongoose.connect(connectionString, (error) => {
        if (error) {
            console.error(`${LOG.ERROR} Unable to connect to DB.\nReason: ${error}`);
            process.exit(1);
        }

        console.info(`${LOG.SUCCESS} Connected to Database`);
    })
}