import { Schema, model } from 'mongoose';
import Joi from '@hapi/joi';

const AdminSchema = new Schema(
	{
		name: { type: String, required: true },
		password: { type: String, required: true, minlength: 8, maxlength: 50 },
		phone: { type: Number, min: 4444444444, max: 9999999999, required: true },
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
		password: Joi.string().min(8).max(50).required(),
		phone: Joi.number().min(4444444444).max(9999999999).required(),
		email: Joi.string().required(),
		profileImg: Joi.string().required()
	});

	return schema.validate(data);
};
