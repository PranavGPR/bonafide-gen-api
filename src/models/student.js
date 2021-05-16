import { Schema, model, Types } from 'mongoose';
import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

const myJoiObjectId = JoiObjectId(Joi);

const StudentSchema = new Schema(
	{
		registerNumber: {
			type: Number,
			min: 810000000000,
			max: 810025999999,
			required: true,
			unique: true
		},
		name: { type: String, required: true },
		profileImg: { type: String, required: true },
		dateOfBirth: { type: Date, required: true },
		degree: { type: String, required: true },
		department: { type: String, required: true },
		gender: { type: String, required: true },
		batch: { type: String, required: true },
		campus: { type: String, required: true, default: 'AUBIT' },
		phoneNumber: { type: Number, min: 4444444444, max: 9999999999, required: true },
		email: { type: String, required: true, unique: true },
		section: { type: Types.ObjectId, ref: 'section', required: true }
	},
	{
		timestamps: true
	}
);

export default model('student', StudentSchema);

export const validateStudent = data => {
	const schema = Joi.object({
		registerNumber: Joi.number().min(810000000000).max(810025999999).required().messages({
			'number.min': '"Register number" must be valid',
			'number.max': '"Register number" must be valid'
		}),
		name: Joi.string().required(),
		profileImg: Joi.string().required(),
		dateOfBirth: Joi.date().required(),
		degree: Joi.string().required(),
		department: Joi.string().required(),
		gender: Joi.string().required(),
		batch: Joi.string().required(),
		campus: Joi.string().required(),
		phoneNumber: Joi.number().min(4444444444).max(9999999999).required().messages({
			'number.min': '"Mobile number" must be valid',
			'number.max': '"Mobile number" must be valid'
		}),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		section: myJoiObjectId().required()
	});

	return schema.validate(data);
};
