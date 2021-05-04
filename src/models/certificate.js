import { Schema, model } from 'mongoose';
import Joi from '@hapi/joi';

const CertificateSchema = new Schema(
	{
		registerNumber: {
			type: Number,
			min: 810000000000,
			max: 810025999999,
			required: true,
			unique: true
		},
		isValid: { type: Boolean, required: true, default: false },
		isVerified: { type: Boolean, required: true, default: false },
		url: { type: String, required: true, unique: true },
		verifiedBy: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

export default model('certificate', CertificateSchema);

export const validateCertificate = data => {
	const schema = Joi.object({
		registerNumber: Joi.number().min(810000000000).max(810025999999).required().messages({
			'number.min': '"Register number" must be valid',
			'number.max': '"Register number" must be valid'
		}),
		isValid: Joi.boolean().required(),
		isVerified: Joi.boolean().required(),
		url: Joi.string().required(),
		verifiedBy: Joi.string().required()
	});

	return schema.validate(data);
};
