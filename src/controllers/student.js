import jwt from 'jsonwebtoken';
import 'dotenv/config';
import config from 'config';
import { StatusCodes } from 'http-status-codes';

import { Student, Certificate } from 'models';
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

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: student });
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
	const {
		body: { phoneNumber, email }
	} = req;

	let fields = {
		phoneNumber,
		email
	};

	fields = JSON.parse(JSON.stringify(fields, (k, v) => v ?? undefined));
	let len = Object.keys(fields).length;

	if (len === 0) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No fields specified' });

	const student = await Student.findByIdAndUpdate(id, { ...fields }, { new: true });

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	logger.debug('Student updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Student updated successfully', data: student });
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

	if (!registerNumber)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'registerNumber field required' });
	if (!dateOfBirth)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'dateOfBirth field required' });

	const student = await Student.findOne({ registerNumber }).select('name dateOfBirth');

	if (!student)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Student does not exist' });

	const { _id: id, name } = student;

	const inputDate = new Date(dateOfBirth);
	const dbDate = new Date(student.dateOfBirth);
	inputDate.setHours(0, 0, 0, 0);
	dbDate.setHours(0, 0, 0, 0);

	if (!(inputDate.getTime() === dbDate.getTime()))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'DOB is wrong' });

	const token = jwt.sign({ role: 'student', id, name }, config.get('jwtPrivateKey'));

	return res.status(StatusCodes.OK).json({ message: 'Logged in Successfully', token, name });
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

	return res.status(StatusCodes.OK).json({ data: certificate });
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
	const certificate = new Certificate({
		studentID: id,
		sectionID: student.section
	});

	await certificate.save();

	logger.debug('need to send email');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Bonafide applied successfully', data: certificate });
};
