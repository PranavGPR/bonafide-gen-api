import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

import { Staff, validateStaff, Section } from 'models';
import logger from 'tools/logging';

/**
 *
 * New Staff
 *
 * @route: /staff/new
 * @method: POST
 * @requires: body{ name, profileImg, password,designation, department, campus, phoneNumber, email, section}
 * @returns: 'Successfully added' | 'Could not add the staff'
 *
 */

export const newStaff = async (req, res) => {
	const { body } = req;

	const { error } = validateStaff(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	body.password = await bcrypt.hash(body.password, 10);

	let staff = new Staff({ ...body });

	const section = await Section.findByIdAndUpdate(
		body.section,
		{ $push: { staffs: staff.id } },
		{ new: true }
	);
	if (!section)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Section does not exist' });

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
	const staffs = await Staff.find({}, { password: 0, createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name'
	);
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

	const staff = await Staff.findById(id, { password: 0, createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name'
	);

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	return res.status(StatusCodes.OK).json({ data: staff });
};

/**
 *
 * Update Staff
 *
 * @route: /staff/update
 * @method: PUT
 * @requires: body{ id, updating fields}
 * @returns: 'Successfully updated' | 'Could not update the staff'
 *
 */

export const updateStaff = async (req, res) => {
	const { body } = req;

	if (!body.id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(body.id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	delete body.password;
	delete body.section;

	const staff = await Staff.findByIdAndUpdate(body.id, { ...body }, { new: true });

	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	logger.debug('Staff updated successfully');

	return res.status(StatusCodes.OK).json({ message: 'Staff updated successfully', data: staff });
};

/**
 *
 * Delete Staff
 *
 * @route: /staff/delete
 * @method: DELETE
 * @requires: body{ id}
 * @returns: 'Successfully deleted' | 'Could not delete the staff'
 *
 */

export const deleteStaff = async (req, res) => {
	const {
		body: { id }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

	const staffWithSection = await Staff.findById(id).populate('section');

	if (
		staffWithSection &&
		staffWithSection.section &&
		staffWithSection.section.staffs.length === 1 &&
		staffWithSection.section.students.length > 0
	)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Staff is bind with section' });

	const staff = await Staff.findByIdAndDelete(id);

	if (!staff) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Staff does not exist' });

	await Section.findByIdAndUpdate(staff.section, { $pull: { staffs: id } }, { new: true });

	return res.status(StatusCodes.OK).json({ message: 'Staff deleted successfully', data: staff });
};
