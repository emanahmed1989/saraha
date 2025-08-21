import Joi from "joi";


export const changePasswordSchema = Joi.object({
        oldPassword:Joi.string().regex(/^([a-zA-Z0-9]){8,30}$/).required(),
        newPassword:Joi.string().regex(/^([a-zA-Z0-9]){8,30}$/).required(),
     

    });