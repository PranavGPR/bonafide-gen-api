import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import config from 'config';
import bcrypt from 'bcrypt';

import logger from 'tools/logging';
import { Student, Staff } from 'models/';

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
	logger.debug('Acknowleged:', id);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const student = await Student.findById(id, { createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name -_id'
	);

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: student });
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

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	return res.status(StatusCodes.OK).json({ data: staff });
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
	if (!staff) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Staff does not exist' });

	const students = await Student.find({ section: staff.section }, { createdAt: 0, updatedAt: 0 });

	if (!students) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: students });
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
	const { id } = req.params;
	const {
		body: { phoneNumber, email }
	} = req;
	logger.debug('Acknowledged: ', id, ' ', phoneNumber, ' ', email);

	let fields = {
		phoneNumber,
		email
	};

	fields = JSON.parse(JSON.stringify(fields, (k, v) => (v ? v : undefined)));
	let len = Object.keys(fields).length;

	if (len === 0) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No fields specified' });

	const staff = await Staff.findByIdAndUpdate(id, { ...fields }, { new: true });

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	logger.debug('Staff updated successfully');

	return res.status(StatusCodes.OK).json({ message: 'Staff updated successfully', data: staff });
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

	if (!email) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email field required' });
	if (!password)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'password field required' });

	const staff = await Staff.findOne({ email }).select('name password');

	if (!staff)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email or password incorrect' });

	const match = await bcrypt.compare(password, staff.password);

	if (!match) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email or password incorrect' });
	}

	const { _id: id, name } = staff;

	const token = jwt.sign({ role: 'staff', id, name }, config.get('jwtPrivateKey'));

	return res.status(StatusCodes.OK).json({ message: 'Logged in Successfully', token, name });
};
