import { Schema, model, Types } from 'mongoose';
import Joi from '@hapi/joi';

const SectionSchema = new Schema(
	{
		name: { type: String, required: true },
		students: [{ type: Types.ObjectId, ref: 'student' }],
		staffs: [{ type: Types.ObjectId, ref: 'staff' }]
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
		staffs: Joi.array()
	});

	return schema.validate(data);
};
