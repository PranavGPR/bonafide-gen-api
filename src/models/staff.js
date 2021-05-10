import { Schema, model, Types } from 'mongoose';
import Joi from '@hapi/joi';
import JoiObjectId from 'joi-objectid';

const myJoiObjectId = JoiObjectId(Joi);

const StaffSchema = new Schema(
	{
		name: { type: String, required: true },
		profileImg: { type: String, required: true },
		password: { type: String, required: true, minlength: 8, maxlength: 256 },
		designation: { type: String, required: true },
		department: { type: String, required: true },
		campus: { type: String, required: true, default: 'AUBIT' },
		phoneNumber: { type: Number, min: 4444444444, max: 9999999999, required: true },
		email: { type: String, required: true, unique: true },
		section: { type: Types.ObjectId, required: true }
	},
	{
		timestamps: true
	}
);

export default model('staff', StaffSchema);

export const validateStaff = data => {
	const schema = Joi.object({
		name: Joi.string().required(),
		profileImg: Joi.string().required(),
		password: Joi.string().min(8).max(256).required(),
		designation: Joi.string().required(),
		department: Joi.string().required(),
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
