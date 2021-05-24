import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

Joi.objectID = JoiObjectId(Joi);

export const updateStudentValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		}),
		registerNumber: Joi.number().min(810000000000).max(810025999999).optional().messages({
			'number.min': '"Register number" must be valid',
			'number.max': '"Register number" must be valid'
		}),
		name: Joi.string().optional(),
		profileImg: Joi.string().optional(),
		dateOfBirth: Joi.date().optional(),
		degree: Joi.string().optional(),
		department: Joi.string().optional(),
		gender: Joi.string().optional(),
		batch: Joi.string().optional(),
		campus: Joi.string().optional(),
		phoneNumber: Joi.number().min(4444444444).max(9999999999).optional().messages({
			'number.min': '"Mobile number" must be valid',
			'number.max': '"Mobile number" must be valid'
		}),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.optional()
	})
		.or(
			'registerNumber',
			'name',
			'profileImg',
			'dateOfBirth',
			'degree',
			'department',
			'gender',
			'batch',
			'campus',
			'phoneNumber',
			'email'
		)
		.required()
		.messages({
			'object.missing': 'No fields specified'
		});

	return schema.validate(data);
};

export const deleteStudentValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
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

export const getStudentByRegisterNoValidator = data => {
	const schema = Joi.object({
		registerNumber: Joi.number().min(810000000000).max(810025999999).required().messages({
			'number.min': '"Register number" must be valid',
			'number.max': '"Register number" must be valid'
		})
	});

	return schema.validate(data);
};
