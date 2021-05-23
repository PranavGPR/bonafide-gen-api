import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

import { Section, Student, Staff, Admin } from 'models';
import { sendSuccess, sendFailure, generateToken } from 'helpers';

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

	body.password = await bcrypt.hash(body.password, 10);

	let admin = new Admin({ ...body });
	admin = await admin.save();

	return sendSuccess(res, { message: 'Admin created successfully', data: admin });
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
	const admins = await Admin.find({}, { password: 0, createdAt: 0, updatedAt: 0 });
	return sendSuccess(res, { data: admins });
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

	const admin = await Admin.findById(id, { password: 0, createdAt: 0, updatedAt: 0 });

	if (!admin) return sendFailure(res, { error: 'Admin does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { data: admin });
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

	const admin = await Admin.findByIdAndDelete(id);

	if (!admin) return sendFailure(res, { error: 'Admin does not exist' }, StatusCodes.NOT_FOUND);

	return sendSuccess(res, { message: 'Admin deleted successfully', data: admin });
};

/**
 *
 * Count of Admins, Staffs, Students and Sections
 *
 * @route: /count
 * @method: GET
 * @requires: body{}
 * @returns: Object{Count}
 *
 */

export const countMembers = async (req, res) => {
	const admins = await Admin.countDocuments({});
	const staffs = await Staff.countDocuments({});
	const students = await Student.countDocuments({});
	const sections = await Section.countDocuments({});

	return sendSuccess(res, {
		adminCount: admins,
		staffCount: staffs,
		studentCount: students,
		sectionCount: sections
	});
};

/**
 *
 * Admin Login
 *
 * @route: /login
 * @method: POST
 * @requires: body{ email, password}
 * @returns: 'Logged in Successfully' | 'Could not login'
 *
 */

export const adminLogin = async (req, res) => {
	const {
		body: { email, password }
	} = req;

	const admin = await Admin.findOne({ email }).select('name password');

	if (!admin)
		return sendFailure(res, { error: 'Email or Password incorrect' }, StatusCodes.NOT_FOUND);

	const match = await bcrypt.compare(password, admin.password);

	if (!match) {
		return sendFailure(res, { error: 'Email or Password Incorrect' });
	}

	const { name, _id: id } = admin;

	const token = generateToken({ role: 'admin', id, name });

	return sendSuccess(res, { message: 'Logged in Successfully', token, name });
};
