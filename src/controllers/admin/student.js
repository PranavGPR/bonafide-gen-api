import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Student, validateStudent, Section } from 'models';
import { sendSuccess, sendFailure } from 'helpers';
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
	if (error) return sendFailure(res, { error: error.details[0].message });

	let student = new Student({ ...body });

	const section = await Section.findByIdAndUpdate(
		body.section,
		{ $push: { students: student.id } },
		{ new: true }
	);
	if (body.section && !section) return sendFailure(res, { error: 'Section does not exist' });

	student = await student.save();

	return sendSuccess(res, { message: 'Successfully Created!', data: student });
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
	return sendSuccess(res, { data: students });
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

	if (!id) return sendFailure(res, { error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id)) return sendFailure(res, { error: 'id must be valid' });

	const student = await Student.findById(id, { createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name'
	);

	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: student });
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

	if (!registerNumber) return sendFailure(res, { error: 'registerNumber field required' });

	if (!Number(registerNumber)) return sendFailure(res, { error: 'registerNumber must be valid' });

	const student = await Student.findOne(
		{ registerNumber },
		{ createdAt: 0, updatedAt: 0 }
	).populate('section', 'name');

	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: student });
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

	if (!body.id) return sendFailure(res, { error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(body.id))
		return sendFailure(res, { error: 'Not a valid id' });

	delete body.section;

	if (Object.keys(body).length === 1) return sendFailure(res, { error: 'No fields specified' });

	const student = await Student.findByIdAndUpdate(body.id, { ...body }, { new: true });
	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	logger.debug('Student updated successfully');

	return sendSuccess(res, { message: 'Student updated successfully', data: student });
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

	if (!id) return sendFailure(res, { error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id)) return sendFailure(res, { error: 'Not a valid id' });

	const student = await Student.findByIdAndDelete(id);

	if (!student) return sendFailure(res, { error: 'Student does not exist' }, StatusCodes.NOT_FOUND);

	logger.debug('Student deleted successfully');

	await Section.findByIdAndUpdate(student.section, { $pull: { students: id } }, { new: true });

	return sendSuccess(res, { message: 'Student deleted successfully', data: student });
};
