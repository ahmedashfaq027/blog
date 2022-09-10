import mongoose from "mongoose";
import { TokenType } from "../../../core/types";

const tokenSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: TokenType,
        required: true,
        enum: TokenType
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: 60 * 60
    }
});

export default mongoose.model('Token', tokenSchema);