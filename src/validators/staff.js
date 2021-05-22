import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

Joi.objectID = JoiObjectId(Joi);

export const updateBonafideStatusValidator = data => {
	const schema = Joi.object({
		status: Joi.string().valid('approved', 'rejected').required().messages({
			'any.only': '{{#label}} must be valid'
		}),
		bonafideID: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const stafffLoginValidator = data => {
	const schema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required()
	});

	return schema.validate(data);
};

export const updateStaffValidator = data => {
	const schema = Joi.object({
		phoneNumber: Joi.number().optional(),
		email: Joi.string().optional()
	})
		.or('phoneNumber', 'email')
		.required()
		.messages({
			'object.missing': 'No fields specified'
		});

	return schema.validate(data);
};

export const getStudentByIdValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};
