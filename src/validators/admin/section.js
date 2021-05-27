import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

Joi.objectID = JoiObjectId(Joi);

export const updateSectionNameValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		}),
		name: Joi.string().required()
	});

	return schema.validate(data);
};

export const updateSectionStaffValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		}),
		staffId: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const updateSectionStudentValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		}),
		studentId: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const deleteSectionValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};

export const getSectionByIdValidator = data => {
	const schema = Joi.object({
		id: Joi.objectID().required().messages({
			'string.pattern.name': '{{#label}} must be valid'
		})
	});

	return schema.validate(data);
};
