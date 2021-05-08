import Mongoose from 'mongoose';

import { Student, validateStudent, Staff, validateStaff } from 'models';
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
	logger.debug('Acknowledged: ', body);

	const { error } = validateStudent(body);
	if (error) return res.status(400).send(error.details[0].message);

	let student = await new Student({ ...body });
	student = await student.save();

	return res.status(200).send(student);
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
	const students = await Student.find();
	return res.status(200).send(students);
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
	logger.info(id);

	if (!id) return res.status(400).send('id field required');

	if (!Mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('id must be valid');

	const student = await Student.findById(id);

	if (!student) return res.status(404).send('Student does not exist');

	return res.status(200).send(student);
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

	if (!registerNumber) return res.status(400).send('registerNumber field required');

	if (!Number(registerNumber)) return res.status(400).send('registerNumber must be valid');

	const student = await Student.find({ registerNumber });

	if (!student) return res.status(404).send('Student does not exist');

	return res.status(200).send(student);
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
	logger.debug('Acknowledged: ', id);

	if (!id) return res.status(400).send('id field required');

	if (!Mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Not a valid id');

	const student = await Student.findByIdAndDelete(id);
	if (!student) return res.status(404).send('Student does not exist');
	logger.debug('Student deleted successfully');
	return res.status(200).send('Student deleted successfully');
};

/**
 *
 * New Staff
 *
 * @route: /staff/new
 * @method: POST
 * @requires: body{ name, profileImg, password,designation, department, campus, phoneNumber, email, sectionId}
 * @returns: 'Successfully added' | 'Could not add the staff'
 *
 */

export const newStaff = async (req, res) => {
	const { body } = req;
	logger.debug('Acknowledged: ', body);

	const { error } = validateStaff(body);
	if (error) return res.status(400).send(error.details[0].message);

	let staff = await new Staff({ ...body });
	staff = await staff.save();

	return res.status(200).send(staff);
};

/**
 *
 * Delete Staff
 *
 * @route: /staff/delete
 * @method: DELETE
 * @requires: body{ _id}
 * @returns: 'Successfully deleted' | 'Could not delete the staff'
 *
 */

export const deleteStaff = async (req, res) => {
	const {
		body: { id }
	} = req;
	logger.debug('Acknowledged: ', id);

	if (!id) return res.status(400).send('id field required');

	if (!Mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Not a valid id');

	const staff = await Staff.findByIdAndDelete(id);
	if (!staff) return res.status(404).send('Staff does not exist');
	logger.debug('Staff deleted successfully');
	return res.status(200).send('Staff deleted successfully');
};

/**
 *
 * Get list of staffs
 *
 * @route: /getStaffs
 * @method: GET
 * @requires: body{}
 * @returns: Object{Staffs}
 *
 */

export const getStaffs = async (req, res) => {
	const staffs = await Staff.find();
	return res.status(200).send(staffs);
};
