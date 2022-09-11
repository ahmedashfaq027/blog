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
    status: {
        type: String,
        required: true,
        enum: BlogStatus
    },
    coverImage: String,
    tags: [String],
    views: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema)