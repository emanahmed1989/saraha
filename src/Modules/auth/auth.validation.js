import Joi from "joi";


export const registerSchema = Joi.object({
        fullName:Joi.string().min(6).max(50).required(),
        email:Joi.string().email({tlds:["com","org","eg"]}),
        // .when('phoneNumber',{
        //     is:Joi.exist(),
        //     then:Joi.optional(),
        //     otherwise:Joi.required()
        // })
        password:Joi.string().regex(/^([a-zA-Z0-9]){8,30}$/).required(),
        phoneNumber:Joi.string().length(11),
        dob:Joi.date()

    }).or("email","phoneNumber");//enter phone number or email