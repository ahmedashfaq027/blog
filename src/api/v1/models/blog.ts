import mongoose from "mongoose";
import { BlogStatus } from "../types/blog";

const blogSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    coverImage: {
        data: Buffer,
        contentType: String
    },
    status: {
        type: String,
        required: true,
        enum: BlogStatus
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema)