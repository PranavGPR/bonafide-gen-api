import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import config from 'config';
import bcrypt from 'bcrypt';

import { Section, Student, Staff, validateAdmin, Admin } from 'models';
import logger from 'tools/logging';

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

	body.password = await bcrypt.hash(body.password, 10);

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

	return res.status(StatusCodes.OK).json({
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

	if (!email) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email field required' });
	if (!password)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'password field required' });

	const admin = await Admin.findOne({ email }).select('name password');

	const match = await bcrypt.compare(password, admin.password);

	if (!match) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: 'password incorrect' });
	}

	if (!admin)
		return res.status(StatusCodes.NOT_FOUND).json({ error: 'email or password incorrect' });

	const { name, _id: id } = admin;

	const token = jwt.sign({ role: 'admin', id, name }, config.get('jwtPrivateKey'));

	return res.status(StatusCodes.OK).json({ message: 'Logged in Successfully', token, name });
};