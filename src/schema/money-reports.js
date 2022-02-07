const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.string().min(6).max(255).required(),
    title: Joi.string().min(6).max(255).required().email(),
    value: Joi.string().min(6).max(255).required(),
    where: Joi.string().min(6).max(255).required(),
    paymentMethod: Joi.string()
      .min(6)
      .max(255)
      .required()
      .valid("credit", "debit", "pix", "money", "VR", "VA", "others"),
    category: Joi.string().min(6).max(255),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
