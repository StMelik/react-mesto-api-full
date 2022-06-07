const { celebrate, Joi } = require('celebrate');
const { reqExpLink } = require('./constants');

const validationUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(reqExpLink),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validationProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(reqExpLink),
  }),
});

const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(reqExpLink),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validationUser,
  validationUserId,
  validationProfile,
  validationAvatar,
  validationCard,
  validationCardId,
};
