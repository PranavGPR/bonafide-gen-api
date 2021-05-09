import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Student } from 'models';
import logger from 'tools/logging';

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
 * Update Student
 *
 * @route: /update
 * @method: PUT
 * @requires: body{ id, phoneNumber, email}
 * @returns: 'Successfully updated' | 'Could not update the student'
 *
 */

export const updateStudent = async (req, res) => {
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
