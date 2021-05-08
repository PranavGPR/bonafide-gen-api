import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import {
	Student,
	validateStudent,
	Staff,
	validateStaff,
	validateSection,
	Section,
	validateAdmin,
	Admin
} from 'models';
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
	if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

	let student = await new Student({ ...body });
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
	const students = await Student.find();
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

	const student = await Student.findById(id);

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

	const student = await Student.find({ registerNumber });

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	return res.status(StatusCodes.OK).json({ data: student });
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

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	const student = await Student.findByIdAndDelete(id);

	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	logger.debug('Student deleted successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Student deleted successfully', data: student });
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
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	let staff = await new Staff({ ...body });
	staff = await staff.save();

	return res.status(StatusCodes.OK).json({ message: 'Staff created successfully', data: staff });
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
	return res.status(StatusCodes.OK).json({ data: staffs });
};

/**
 *
 * Get a staff by id
 *
 * @route: /getStudent
 * @method: GET
 * @requires: body{id}
 * @returns: Object{Student}
 *
 */
export const getStaffById = async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const staff = await Staff.findById(id);

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	return res.status(StatusCodes.OK).json({ data: staff });
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

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	const staff = await Staff.findByIdAndDelete(id);

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	return res.status(StatusCodes.OK).json({ message: 'Staff deleted successfully', data: staff });
};

/**
 *
 * New Section
 *
 * @route: /section/new
 * @method: POST
 * @requires: body{name, staffId}
 * @returns: 'Section created successfully' | 'Could not add the section'
 *
 */

export const newSection = async (req, res) => {
	const { body } = req;
	logger.info('Acknowledged: ', body);

	const { error } = validateSection(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	let section = await new Section({ ...body, studentsId: [] });
	section = await section.save();

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section created successfully', data: section });
};

/**
 *
 * Get list of section
 *
 * @route: /section/all
 * @method: GET
 * @requires: body{}
 * @returns: Object{Sections}
 *
 */

export const getSections = async (req, res) => {
	const sections = await Section.find();
	return res.status(StatusCodes.OK).json({ data: sections });
};

/**
 *
 * Get a section by id
 *
 * @route: /section/:id
 * @method: GET
 * @requires: body{id}
 * @returns: Object{Section}
 *
 */
export const getSectionById = async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const section = await Section.findById(id);

	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	return res.status(StatusCodes.OK).json({ data: section });
};

/**
 *
 * Delete Section
 *
 * @route: /section/delete
 * @method: DELETE
 * @requires: body{ _id}
 * @returns: 'Successfully deleted' | 'Could not delete the section'
 *
 */
export const deleteSection = async (req, res) => {
	const {
		body: { id }
	} = req;
	logger.debug('Acknowledged: ', id);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	const section = await Section.findByIdAndDelete(id);

	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section deleted successfully', data: section });
};

/**
 *
 * New Admin
 *
 * @route: /new
 * @method: POST
 * @requires: body{name, password, phoneNumber, email, profileImg}
 * @returns: 'Admin created successfully' | 'Could not add admin'
 *
 */

export const newAdmin = async (req, res) => {
	const { body } = req;
	logger.info('Acknowledged: ', body);

	const { error } = validateAdmin(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	let admin = await new Admin({ ...body, studentsId: [] });
	admin = await admin.save();

	return res.status(StatusCodes.OK).json({ message: 'Admin created successfully', data: admin });
};

/**
 *
 * Get list of admin
 *
 * @route: all
 * @method: GET
 * @requires: body{}
 * @returns: Object{Admins}
 *
 */

export const getAdmins = async (req, res) => {
	const admins = await Admin.find();
	return res.status(StatusCodes.OK).json({ data: admins });
};

/**
 *
 * Get an admin by id
 *
 * @route: /:id
 * @method: GET
 * @requires: body{id}
 * @returns: Object{Admin}
 *
 */
export const getAdminById = async (req, res) => {
	const { id } = req.params;
	logger.info(id);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id must be valid' });

	const admin = await Admin.findById(id);

	if (!admin) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin does not exist' });

	return res.status(StatusCodes.OK).json({ data: admin });
};

/**
 *
 * Delete Admin
 *
 * @route: /delete
 * @method: DELETE
 * @requires: body{ id}
 * @returns: 'Successfully deleted' | 'Could not delete admin'
 *
 */
export const deleteAdmin = async (req, res) => {
	const {
		body: { id }
	} = req;
	logger.debug('Acknowledged: ', id);

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	const admin = await Admin.findByIdAndDelete(id);

	if (!admin) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin does not exist' });

	return res.status(StatusCodes.OK).json({ message: 'Admin deleted successfully', data: admin });
};
