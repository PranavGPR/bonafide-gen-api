import 'dotenv/config';
import config from 'config';
import { StatusCodes } from 'http-status-codes';
import transporter from 'MailConnection';

import { Student, Certificate, Section } from 'models';
import { sendSuccess, sendFailure, generateToken } from 'helpers';
import logger from 'tools/logging';

/**
 *
 * Get a student by id
 *
 * @route:
 * @method: GET
 * @requires: body{}
 * @returns: Object{Student}
 *
 */
export const getStudentDetail = async (req, res) => {
	const { id } = req.user;

	const student = await Student.findById(id, { createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name -_id'
	);

	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: student });
};

/**
 *
 * Update Student
 *
 * @route: /update
 * @method: PUT
 * @requires: body{ phoneNumber, email}
 * @returns: 'Successfully updated' | 'Could not update the student'
 *
 */

export const updateStudent = async (req, res) => {
	const { id } = req.user;
	const { body } = req;

	const student = await Student.findByIdAndUpdate(id, { ...body }, { new: true });

	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	logger.debug('Student updated successfully');

	return sendSuccess(res, { message: 'Student updated successfully', data: student });
};

/**
 *
 * Student Login
 *
 * @route: /login
 * @method: POST
 * @requires: body{ registerNumber, dateOfBirth}
 * @returns: 'Logged in Successfully' | 'Could not login'
 *
 */

export const studentLogin = async (req, res) => {
	const {
		body: { registerNumber, dateOfBirth }
	} = req;

	const student = await Student.findOne({ registerNumber }).select('name dateOfBirth');

	if (!student) return sendFailure(res, { error: 'Student does not exist' });

	const { _id: id, name } = student;

	const inputDate = new Date(dateOfBirth);
	const dbDate = new Date(student.dateOfBirth);
	inputDate.setHours(0, 0, 0, 0);
	dbDate.setHours(0, 0, 0, 0);

	if (!(inputDate.getTime() === dbDate.getTime()))
		return sendFailure(res, { error: 'DOB is wrong' });

	const token = generateToken({ role: 'student', id, name });

	return sendSuccess(res, { message: 'Logged in Successfully', token, name });
};

/**
 *
 * Get a bonafide  status
 *
 * @route:
 * @method: GET
 * @requires: body{}
 * @returns: Object{Student}
 *
 */
export const getBonafideStatus = async (req, res) => {
	const { id } = req.user;

	const certificate = await Certificate.findOne({ studentID: id }).populate('studentID');

	return sendSuccess(res, { data: certificate });
};

/**
 *
 * Apply bonafide
 *
 * @route:
 * @method: GET
 * @requires: body{}
 * @returns: Object{Student}
 *
 */
export const applyBonafide = async (req, res) => {
	const { id } = req.user;

	const student = await Student.findById(id);

	if (!student.section)
		return sendFailure(res, {
			error: 'You must be part of some section! Contact your Class Coordinator.'
		});

	const certificate = new Certificate({
		studentID: id,
		sectionID: student.section
	});
	await certificate.save();

	const { staffs } = await Section.findById(student.section)
		.select('staffs -_id')
		.populate('staffs', '-_id name email');

	let to = '';

	for (let i = 0; i < staffs.length; i++) {
		to += staffs[i].email;
		if (i + 1 !== staffs.length) to += ',';
	}

	let mailOptions = {
		from: `"AUBIT" ${config.get('MAIL_USER_NAME')}`,
		to: to,
		subject: 'New Bonafide Applied',
		html: `
			<h3>Your student ${student.name} has applied for a new bonafide certificate.</h3>
			<p><a href=${config.get('WEBSITE_URL')}>Click here</a> to view and approve the request.</p>`
	};

	try {
		if (process.env.NODE_ENV !== 'test') {
			await transporter.sendMail(mailOptions);
		}
	} catch (err) {
		logger.error(err);
	}

	return sendSuccess(res, { message: 'Bonafide applied successfully', data: certificate });
};

/**
 *
 * Re-request review
 *
 * @route:
 * @method: PUT
 * @requires: body{bonafideID}
 * @returns: Object{Student}
 *
 */
export const reviewBonafide = async (req, res) => {
	const { id } = req.user;
	const { bonafideID } = req.body;

	const student = await Student.findById(id);

	if (!student.section)
		return sendFailure(res, {
			error: 'You must be part of some section! Contact your Class Coordinator.'
		});

	const certificate = await Certificate.findByIdAndUpdate(
		bonafideID,
		{ status: 'applied' },
		{ new: true }
	);

	if (!certificate) return sendFailure(res, { error: 'Certificate not found' });

	const { staffs } = await Section.findById(student.section)
		.select('staffs -_id')
		.populate('staffs', '-_id name email');

	let to = '';

	for (let i = 0; i < staffs.length; i++) {
		to += staffs[i].email;
		if (i + 1 !== staffs.length) to += ',';
	}

	let mailOptions = {
		from: `"AUBIT" ${config.get('MAIL_USER_NAME')}`,
		to: to,
		subject: 'Bonafide Re-request',
		html: `
			<h3>Your student ${student.name} has re-requested your review for a bonafide certificate.</h3>
			<p><a href=${config.get('WEBSITE_URL')}>Click here</a> to view and approve the request.</p>`
	};

	try {
		if (process.env.NODE_ENV !== 'test') {
			await transporter.sendMail(mailOptions);
		}
	} catch (err) {
		logger.error(err);
	}

	return sendSuccess(res, { message: 'Bonafide re-requested successfully', data: certificate });
};
