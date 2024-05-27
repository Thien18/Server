const joi = require("joi");

const email = joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
    .required();
// const email = joi.string().pattern(new RegExp('gmail.com')).required()
const userId = joi.string().required();
const password = joi.string().min(6).required();
const fullname = joi.string().required();
const address = joi.string().required();
const phone_number = joi.number().min(10).required();

const prodId = joi.string().required();
const title = joi.string().required();
const price = joi.number().required();
const available = joi.number().required();
const imageUrl = joi.string().required();
const description = joi.string().required();
const dateOfManufacture = joi.number().required();
const madeIn = joi.string().required();
const certificate = joi.string().required();
const category = joi.string().required();
const fileName = joi.string().required();
const refreshToken = joi.string().required();
const quantity = joi.number().required();

module.exports = {
    userId,
    email,
    password,
    fullname,
    address,
    phone_number,
    prodId,
    title,
    price,
    available,
    imageUrl,
    description,
    dateOfManufacture,
    madeIn,
    certificate,
    category,
    fileName,
    refreshToken,
    quantity,
};