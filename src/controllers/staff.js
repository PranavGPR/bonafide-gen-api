import { StatusCodes } from 'http-status-codes';
import 'dotenv/config';
import config from 'config';
import bcrypt from 'bcrypt';

import transporter from 'MailConnection';
import { sendSuccess, sendFailure, generateToken } from 'helpers';
import logger from 'tools/logging';
import { Student, Staff, Certificate } from 'models';

/**
 *
 * Get a student by id
 *
 * @route: /:id
 * @method: GET
 * @requires: body{}
 * @returns: Object{Student}
 *
 */
export const getStudentById = async (req, res) => {
	const { id } = req.params;

	const student = await Student.findById(id, { createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name -_id'
	);

	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: student });
};

/**
 *
 * Get a staff profile
 *
 * @route:
 * @method: GET
 * @requires: body{}
 * @returns: Object{staff}
 *
 */
export const getStaffProfile = async (req, res) => {
	const { id } = req.user;

	const staff = await Staff.findById(id, { createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name -_id'
	);

	if (!staff) return sendFailure(res, { error: 'Staff does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: staff });
};

/**
 *
 * Get students by section
 *
 * @route: /section/student
 * @method: GET
 * @requires: body{}
 * @returns: Object{staff}
 *
 */

export const getStudentsBySection = async (req, res) => {
	const { id } = req.user;

	const staff = await Staff.findById(id);
	if (!staff) return sendFailure(res, { error: 'Staff does not exist' }, StatusCodes.NOT_FOUND);

	const students = await Student.find({ section: staff.section }, { createdAt: 0, updatedAt: 0 })
		.populate('section', 'name -_id')
		.sort('registerNumber');

	return sendSuccess(res, { data: students });
};

/**
 *
 * Update Staff
 *
 * @route: /update
 * @method: PUT
 * @requires: body{ phoneNumber, email}
 * @returns: 'Successfully updated' | 'Could not update the staff'
 *
 */

export const updateStaff = async (req, res) => {
	const { id } = req.user;
	const { body } = req;

	const staff = await Staff.findByIdAndUpdate(id, { ...body }, { new: true });

	if (!staff) return sendFailure(res, { error: 'Staff does not exist' }, StatusCodes.NOT_FOUND);

	logger.debug('Staff updated successfully');

	return sendSuccess(res, { message: 'Staff updated successfully', data: staff });
};

/**
 *
 * Staff Login
 *
 * @route: /login
 * @method: POST
 * @requires: body{ email, password}
 * @returns: 'Logged in Successfully' | 'Could not login'
 *
 */

export const staffLogin = async (req, res) => {
	const {
		body: { email, password }
	} = req;

	const staff = await Staff.findOne({ email }).select('name password');

	if (!staff)
		return sendFailure(res, { error: 'email or password incorrect' }, StatusCodes.NOT_FOUND);

	const match = await bcrypt.compare(password, staff.password);

	if (!match) {
		return sendFailure(res, { error: 'email or password incorrect' });
	}

	const { _id: id, name } = staff;

	const token = generateToken({ role: 'staff', id, name });

	return sendSuccess(res, { message: 'Logged in Successfully', token, name });
};

/**
 *
 * Get a applied bonafide
 *
 * @route:
 * @method: GET
 * @requires: body{}
 * @returns: Object{Student}
 *
 */
export const getAppliedBonafide = async (req, res) => {
	const { id } = req.user;

	const staff = await Staff.findById(id);

	const certificate = await Certificate.find({
		sectionID: staff.section,
		status: 'applied'
	}).populate('studentID');

	return sendSuccess(res, { data: certificate });
};

/**
 *
 * Get a bonafide history
 *
 * @route:
 * @method: GET
 * @requires: body{}
 * @returns: Object{Student}
 *
 */
export const getBonafideHistory = async (req, res) => {
	const { id } = req.user;

	const staff = await Staff.findById(id);

	const certificate = await Certificate.find({
		sectionID: staff.section,
		status: { $ne: 'applied' }
	}).populate('studentID');

	return sendSuccess(res, { data: certificate });
};

/**
 *
 * update a bonafide status
 *
 * @route:
 * @method: PUT
 * @requires: body{bonafideID, status}
 * @returns: Object{Student}
 *
 */
export const updateBonafideStatus = async (req, res) => {
	const { id } = req.user;
	const { bonafideID, status } = req.body;

	const certificate = await Certificate.findByIdAndUpdate(
		bonafideID,
		{
			verifiedBy: id,
			status
		},
		{ new: true }
	);

	const student = await Student.findById(certificate.studentID);

	let mailOptions = {
		from: `"AUBIT" ${config.get('MAIL_USER_NAME')}`,
		to: student?.email,
		subject: `Bonafide ${status === 'approved' ? 'Approved' : 'Rejected'}`,
		html: `
			<h3>Your bonafide application has been approved!</h3>
			<p><a href=${config.get(
				'WEBSITE_URL'
			)}>Click here</a> to view and download your bonafide certificate.</p>`
	};

	try {
		if (process.env.NODE_ENV !== 'test') {
			await transporter.sendMail(mailOptions);
		}
	} catch (err) {
		logger.error(err);
	}

	return sendSuccess(res, { data: certificate });
};
