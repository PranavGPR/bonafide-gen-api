import { Schema, model, Types } from 'mongoose';
import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

const Joi_oid = JoiObjectId(Joi);

const SectionSchema = new Schema(
	{
		name: { type: String, required: true },
		students: [{ type: Types.ObjectId, ref: 'student' }],
		staff: { type: Types.ObjectId, ref: 'staff' }
	},
	{
		timestamps: true
	}
);

export default model('section', SectionSchema);

export const validateSection = data => {
	const schema = Joi.object({
		name: Joi.string().required(),
		students: Joi.array(),
		staff: Joi_oid().required()
	});

	return schema.validate(data);
};
