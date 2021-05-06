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

	try {
		const { error } = validateStudent(body);
		if (error) return res.status(400).send(error.details[0].message);

		let student = await new Student({ ...body });
		student = await student.save();

		res.status(200).send(student);
	} catch (err) {
		logger.error(err);
		if (err.code === 11000) {
			const errorKeys = Object.keys(err.keyPattern);
			return res
				.status(400)
				.json({ message: `${body[errorKeys[0]]} is already registered`, error: err });
		}
		return res.status(500).send(`Couldn't add student due to ${err}`);
	}
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

	try {
		if (!Mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Not a valid id');

		const student = await Student.findByIdAndDelete(id);
		if (!student) return res.status(404).send('Student does not exist');
		logger.debug('Student deleted successfully');
		return res.status(200).send('Student deleted successfully');
	} catch (err) {
		logger.error(err);
		return res.status(400).send('Could not delete the student');
	}
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

	try {
		const { error } = validateStaff(body);
		if (error) return res.status(400).send(error.details[0].message);

		let staff = await new Staff({ ...body });
		staff = await staff.save();

		res.status(200).send(staff);
	} catch (err) {
		logger.error(err);
		if (err.code === 11000) {
			const errorKeys = Object.keys(err.keyPattern);
			return res
				.status(400)
				.json({ message: `${body[errorKeys[0]]} is already registered`, error: err });
		}
		return res.status(500).send(`Couldn't add staff due to ${err}`);
	}
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

	try {
		if (!Mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Not a valid id');

		const staff = await Staff.findByIdAndDelete(id);
		if (!staff) return res.status(404).send('Staff does not exist');
		logger.debug('Staff deleted successfully');
		return res.status(200).send('Staff deleted successfully');
	} catch (err) {
		logger.error(err);
		return res.status(400).send('Could not delete the staff');
	}
};
