import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

Joi.objectID = JoiObjectId(Joi);

export const reviewBonafideValidator = data => {
	const schema = Joi.object({
		bonafideID: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const studentLoginValidator = data => {
	const schema = Joi.object({
		registerNumber: Joi.number().required(),
		dateOfBirth: Joi.date().required()
	});

	return schema.validate(data);
};

export const updateStudentValidator = data => {
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
