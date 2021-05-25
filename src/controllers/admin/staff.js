import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

import { Staff, Section } from 'models';
import logger from 'tools/logging';
import { sendSuccess, sendFailure } from 'helpers';

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

	body.password = await bcrypt.hash(body.password, 10);

	const staff = new Staff({ ...body });

	const section = await Section.findByIdAndUpdate(
		body.section,
		{ $push: { staffs: staff.id } },
		{ new: true }
	);
	if (body.section && !section) return sendFailure(res, { error: 'Section does not exist' });

	await staff.save();

	return sendSuccess(res, { message: 'Staff created successfully', data: staff });
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
	return sendSuccess(res, { data: staffs });
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

	const staff = await Staff.findById(id, { password: 0, createdAt: 0, updatedAt: 0 }).populate(
		'section',
		'name'
	);

	if (!staff) return sendFailure(res, { error: 'Staff does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: staff });
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
	const staff = await Staff.findByIdAndUpdate(body.id, { ...body }, { new: true });

	if (!staff) return sendFailure(res, { error: 'Staff does not exist' }, StatusCodes.NOT_FOUND);

	logger.debug('Staff updated successfully');

	return sendSuccess(res, { message: 'Staff updated successfully', data: staff });
};

/**
 *
 * Delete Staff
 *
 * @route: /staff/delete
 * @method: DELETE
 * @requires: body{id}
 * @returns: 'Successfully deleted' | 'Could not delete the staff'
 *
 */

export const deleteStaff = async (req, res) => {
	const {
		body: { id }
	} = req;

	const staffWithSection = await Staff.findById(id).populate('section');

	if (
		staffWithSection &&
		staffWithSection.section &&
		staffWithSection.section.staffs.length === 1 &&
		staffWithSection.section.students.length > 0
	)
		return sendFailure(res, { error: 'Staff is bind with section' });

	const staff = await Staff.findByIdAndDelete(id);

	if (!staff) return sendFailure(res, { error: 'Staff does not exist' }, StatusCodes.NOT_FOUND);

	await Section.findByIdAndUpdate(staff.section, { $pull: { staffs: id } }, { new: true });

	return sendSuccess(res, { message: 'Staff deleted successfully', data: staff });
};
