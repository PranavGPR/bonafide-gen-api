import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

Joi.objectID = JoiObjectId(Joi);

export const adminLoginValidator = data => {
	const schema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required()
	});

	return schema.validate(data);
};

export const deleteAdminValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const getAdminByIdValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};
