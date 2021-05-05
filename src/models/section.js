import { Schema, model } from 'mongoose';
import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

const Joi_oid = JoiObjectId(Joi);

const SectionSchema = new Schema(
	{
		name: { type: String, required: true },
		studentId: { type: String, required: true, unique: true },
		staffId: { type: String, required: true, unique: true }
	},
	{
		timestamps: true
	}
);

export default model('section', SectionSchema);

export const validateSection = data => {
	const schema = Joi.object({
		name: Joi.string().required(),
		studentId: Joi_oid().required(),
		staffId: Joi_oid().required()
	});

	return schema.validate(data);
};
