import { Schema, model } from 'mongoose';
import Joi from '@hapi/joi';

const AdminSchema = new Schema(
	{
		name: { type: String, required: true },
		password: { type: String, required: true, minlength: 8, maxlength: 256 },
		phoneNumber: { type: Number, min: 4444444444, max: 9999999999, required: true },
		email: { type: String, required: true, unique: true },
		profileImg: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

export default model('admin', AdminSchema);

export const validateAdmin = data => {
	const schema = Joi.object({
		name: Joi.string().required(),
		password: Joi.string().min(8).max(256).required(),
		phoneNumber: Joi.number().min(4444444444).max(9999999999).required().messages({
			'number.min': '"Mobile number" must be valid',
			'number.max': '"Mobile number" must be valid'
		}),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		profileImg: Joi.string().required()
	});

	return schema.validate(data);
};
