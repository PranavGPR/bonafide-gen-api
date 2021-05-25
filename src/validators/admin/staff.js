import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

Joi.objectID = JoiObjectId(Joi);

export const updateStaffValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		}),
		name: Joi.string().optional(),
		profileImg: Joi.string().optional(),
		designation: Joi.string().optional(),
		department: Joi.string().optional(),
		campus: Joi.string().optional(),
		phoneNumber: Joi.number().min(4444444444).max(9999999999).optional().messages({
			'number.min': '"Mobile number" must be valid',
			'number.max': '"Mobile number" must be valid'
		}),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.optional()
	})
		.or('name', 'profileImg', 'designation', 'department', 'campus', 'phoneNumber', 'email')
		.required()
		.messages({
			'object.missing': 'No fields specified'
		});

	return schema.validate(data);
};

export const deleteStaffValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const getStaffByIdValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};
