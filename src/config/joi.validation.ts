import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    mongodb: Joi.required(),
    port: Joi.number().default(3000),
    limit: Joi.number().default(6),
})