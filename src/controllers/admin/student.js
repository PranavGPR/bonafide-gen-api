import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Student, validateStudent, Section } from 'models';
import logger from 'tools/logging';

/**
 *
 * New Student
 *
 * @route: /student/new
 * @method: POST
 * @requires: body{registerNumber, name, profileImg, dateOfBirth, degree, department, batch, campus, phoneNumber, email,sectionId}
 * @returns: 'Successfully added' | 'Could not add the student'
 *
 */

export const newStudent = async (req, res) => {
	const { body } = req;

	const { error } = validateStudent(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	let student = new Student({ ...body });

	const section = await Section.findByIdAndUpdate(
		body.section,
		{ $push: { students: student.id } },
		{ new: true }
	);
	if (body.section && !section)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Section does not exist' });

	student = await student.save();

	return res.status(StatusCodes.OK).json({ message: 'Successfully Created!', data: student });
};

/**
 *
 * Get list of students
 *
 * @route: /getStudents
 * @method: GET
 * @requires: body{}
 * @returns: Object{Students}
 *
 */

export const getStudents = async (req, res) => {
	const students = await Student.find({}, { createdAt: 0, updatedAt: 0 })
		.populate('section', 'name')
		.sort('registerNumber');
	return res.status(StatusCodes.OK).json({ data: students });
};

/**
 *
 * Get a student by id
 *
 * @route: /getStudent
 * @method: GET
 * @requires: body{id}
 * @returns: Object{Student}
 *
 */
export const getStudentById = async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const student = await Student.findById(id, { createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name'
	);

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: student });
};

/**
 *
 * Get a student by register number
 *
 * @route: /getStudent
 * @method: GET
 * @requires: body{registerNumber}
 * @returns: Object{Student}
 *
 */
export const getStudentByRegisterNumber = async (req, res) => {
	const { registerNumber } = req.params;

	if (!registerNumber)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'registerNumber field required' });

	if (!Number(registerNumber))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'registerNumber must be valid' });

	const student = await Student.findOne(
		{ registerNumber },
		{ createdAt: 0, updatedAt: 0 }
	).populate('section', 'name');

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: student });
};

/**
 *
 * Update Student
 *
 * @route: /student/update
 * @method: PUT
 * @requires: body{ id, updating fields}
 * @returns: 'Successfully updated' | 'Could not update the student'
 *
 */

export const updateStudent = async (req, res) => {
	const { body } = req;

	if (!body.id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(body.id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	delete body.section;

	if (Object.keys(body).length === 1)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No fields specified' });

	const student = await Student.findByIdAndUpdate(body.id, { ...body }, { new: true });
	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	logger.debug('Student updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Student updated successfully', data: student });
};

/**
 *
 * Delete Student
 *
 * @route: /student/delete
 * @method: DELETE
 * @requires: body{ _id}
 * @returns: 'Successfully deleted' | 'Could not delete the student'
 *
 */

export const deleteStudent = async (req, res) => {
	const {
		body: { id }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	const student = await Student.findByIdAndDelete(id);

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	logger.debug('Student deleted successfully');

	await Section.findByIdAndUpdate(student.section, { $pull: { students: id } }, { new: true });

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Student deleted successfully', data: student });
};
