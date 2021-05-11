import joi from "joi";

const loginSchema = joi.object({
  name: joi.string().alphanum().required(),
  room: joi.string().alphanum().required(),
});

export { loginSchema };
