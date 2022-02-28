const Joi = require('joi')

exports.signInSchema = Joi.object({
  username: Joi.string()
    .min(4)
    .max(15),
  email: Joi.string()
    .min(7)
    .email({ minDomainSegments: 2 }),
  password: Joi.string()
    .min(7)
    .max(15)
    .required()
}).xor('username', 'email')

exports.signUpSchema = Joi.object({
  username: Joi.string()
    .min(4)
    .max(15)
    .required(),
  password: Joi.string()
    .min(7)
    .max(15)
    .required(),
  email: Joi.string()
    .min(7)
    .email({ minDomainSegments: 2 })
    .required(),
  fullname: Joi.string()
    .min(4)
    .empty()
    .required(),
  nationality: Joi.string()
    .min(2)
    .empty()
    .required()
})

exports.editProfileSchema = Joi.object({
  password: Joi.string()
    .min(7)
    .max(15)
    .required(),
  email: Joi.string()
    .min(7)
    .email({ minDomainSegments: 2 })
    .required(),
  fullname: Joi.string()
    .min(4)
    .empty()
    .required(),
  nationality: Joi.string()
    .min(2)
    .empty()
    .required()
})
