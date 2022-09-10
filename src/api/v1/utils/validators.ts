import Joi from "joi"

export const registerValidation = (data: {}): Joi.ValidationResult => {
    const schema = Joi.object({
        name: Joi.string().min(3),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(6).max(16).required()
    });

    return schema.validate(data);
}

export const loginValidation = (data: {}) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(6).max(16).required()
    });

    return schema.validate(data);
}