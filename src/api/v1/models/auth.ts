import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3
    },
    email: {
        type: String,
        required: true,
        min: 5,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20
    },
    refreshToken: String,
    oAuthToken: String
}, { timestamps: true });

export default mongoose.model('Auth', authSchema);