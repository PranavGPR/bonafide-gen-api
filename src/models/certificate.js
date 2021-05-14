import { Schema, model, Types } from 'mongoose';

const CertificateSchema = new Schema(
	{
		studentID: {
			type: Types.ObjectId,
			ref: 'student',
			unique: true
		},
		sectionID: {
			type: Types.ObjectId,
			ref: 'section'
		},
		verifiedBy: { type: Types.ObjectId, ref: 'staff' },
		status: { type: String, default: 'applied' }
	},
	{
		timestamps: true
	}
);

//90 days valid
CertificateSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default model('certificate', CertificateSchema);
