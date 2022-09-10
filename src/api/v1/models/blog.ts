import mongoose from "mongoose";

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
    tags: {
        type: Array<String>,
        required: true
    },
    coverImage: {
        data: Buffer,
        contentType: String
    },
    views: {
        type: Number,
        default: 0
    },
    writtenOn: {
        type: Date,
        required: true,
        default: Date.now(),

    },
    modifiedOn: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema)