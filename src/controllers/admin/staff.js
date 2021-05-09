import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Staff, validateStaff } from 'models';
import logger from 'tools/logging';

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
	logger.debug('Acknowledged: ', body.id);

	if (!body.id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id field required' });

	if (!Mongoose.Types.ObjectId.isValid(body.id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a valid id' });

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
