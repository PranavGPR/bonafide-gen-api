import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

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

	const student = await Student.findById(id)
		.select('registerNumber name section')
		.populate('section', 'name -_id', 'section');

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: student });
};

/**
 *
 * Get a staff by id
 *
 * @route: /:id
 * @method: GET
 * @requires: body{}
 * @returns: Object{staff}
 *
 */
export const getStaffById = async (req, res) => {
	const { id } = req.params;
	logger.debug('Acknowleged:', id);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const staff = await Staff.findById(id)
		.select('name section')
		.populate('section', 'name -_id', 'section');

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	return res.status(StatusCodes.OK).json({ data: staff });
};

/**
 *
 * Get students by section
 *
 * @route: /section/student/all/:id
 * @method: GET
 * @requires: body{}
 * @returns: Object{staff}
 *
 */

export const getStudentsBySection = async (req, res) => {
	const { id } = req.params;
	logger.debug('Acknowleged:', id);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const students = await Student.find({ section: id }).populate('section', 'name -_id', 'section');

	if (!students) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: students });
};

/**
 *
 * Update Staff
 *
 * @route: /update
 * @method: PUT
 * @requires: body{ id, phoneNumber, email}
 * @returns: 'Successfully updated' | 'Could not update the staff'
 *
 */

export const updateStaff = async (req, res) => {
	const {
		body: { id, phoneNumber, email }
	} = req;
	logger.debug('Acknowledged: ', id, ' ', phoneNumber, ' ', email);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

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
