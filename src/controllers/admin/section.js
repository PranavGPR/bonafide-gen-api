import Mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { validateSection, Section, Staff, Student } from 'models';
import logger from 'tools/logging';

/**
 *
 * New Section
 *
 * @route: /section/new
 * @method: POST
 * @requires: body{name}
 * @returns: 'Section created successfully' | 'Could not add the section'
 *
 */

export const newSection = async (req, res) => {
	const { body } = req;

	const { error } = validateSection(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	let section = new Section({ name: body.name });
	await section.save();

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

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	const section = await Section.findById(id)
		.populate('staffs', 'name designation department campus email')
		.populate('students', 'name degree department campus registerNumber ', null, {
			sort: { registerNumber: 1 }
		});

	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	return res.status(StatusCodes.OK).json({ data: section });
};

/**
 *
 * Update Section Name
 *
 * @route: /section/update/name
 * @method: PUT
 * @requires: body{ id, name}
 * @returns: 'Successfully updated' | 'Could not update the section'
 *
 */

export const updateSectionName = async (req, res) => {
	const {
		body: { id, name }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" is required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"name" is required' });

	const section = await Section.findByIdAndUpdate(id, { name }, { new: true });

	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	logger.debug('Section updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section updated successfully', data: section });
};

/**
 *
 * Update Section's Staff
 *
 * @route: /section/update/staff
 * @method: PUT
 * @requires: body{ id, staffId}
 * @returns: 'Successfully updated' | 'Could not update the section'
 *
 */

export const updateSectionStaff = async (req, res) => {
	const {
		body: { id, staffId }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" is required' });
	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	if (!staffId) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"staffId" is required' });
	if (!Mongoose.Types.ObjectId.isValid(staffId))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"staffId" must be valid' });

	const section = await Section.findById(id);
	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	const staff = await Staff.findById(staffId);
	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	if (staff.section)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Staff is not available' });

	staff.section = id;

	await staff.save();

	const sectionUpdated = await Section.findByIdAndUpdate(
		id,
		{ $push: { staffs: staffId } },
		{ new: true }
	);

	logger.debug('Section updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section updated successfully', data: sectionUpdated });
};

/**
 *
 * Update Section's Student
 *
 * @route: /section/update/student
 * @method: PUT
 * @requires: body{ id, studentId}
 * @returns: 'Successfully updated' | 'Could not update the section'
 *
 */

export const updateSectionStudent = async (req, res) => {
	const {
		body: { id, studentId }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" is required' });
	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	if (!studentId)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"studentId" is required' });
	if (!Mongoose.Types.ObjectId.isValid(studentId))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"studentId" must be valid' });

	const section = await Section.findById(id);
	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	if (section.staffs.length === 0)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Section should contains atLeast one staff' });

	const student = await Student.findById(studentId);
	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	if (student.section)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Student is already in another section' });

	student.section = id;

	await student.save();

	const sectionUpdated = await Section.findByIdAndUpdate(
		id,
		{ $push: { students: studentId } },
		{ new: true }
	);

	logger.debug('Section updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section updated successfully', data: sectionUpdated });
};

/**
 *
 * Update Section's Staff
 *
 * @route: /section/update/staff
 * @method: DELETE
 * @requires: body{ id, staffId}
 * @returns: 'Successfully updated' | 'Could not update the section'
 *
 */

export const removeSectionStaff = async (req, res) => {
	const {
		body: { id, staffId }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" is required' });
	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	if (!staffId) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"staffId" is required' });
	if (!Mongoose.Types.ObjectId.isValid(staffId))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"staffId" must be valid' });

	const section = await Section.findById(id);
	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	if (section.staffs.length <= 1 && section.students.length > 0)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Section should contains atLeast one staff' });

	const staff = await Staff.findByIdAndUpdate(staffId, {
		section: null
	});
	if (!staff) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Staff does not exist' });

	const sectionUpdated = await Section.findByIdAndUpdate(
		id,
		{ $pull: { staffs: staffId } },
		{ new: true }
	);

	logger.debug('Section updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section updated successfully', data: sectionUpdated });
};

/**
 *
 * Update Section's Student
 *
 * @route: /section/update/student
 * @method: DELETE
 * @requires: body{ id, studentId}
 * @returns: 'Successfully updated' | 'Could not update the section'
 *
 */

export const removeSectionStudent = async (req, res) => {
	const {
		body: { id, studentId }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" is required' });
	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	if (!studentId)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"studentId" is required' });
	if (!Mongoose.Types.ObjectId.isValid(studentId))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"studentId" must be valid' });

	const section = await Section.findById(id);
	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	const student = await Student.findByIdAndUpdate(studentId, {
		section: null
	});
	if (!student) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Student does not exist' });

	const sectionUpdated = await Section.findByIdAndUpdate(
		id,
		{ $pull: { students: studentId } },
		{ new: true }
	);

	logger.debug('Section updated successfully');

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section updated successfully', data: sectionUpdated });
};

/**
 *
 * Delete Section
 *
 * @route: /section/delete
 * @method: DELETE
 * @requires: body{id}
 * @returns: 'Successfully deleted' | 'Could not delete the section'
 *
 */
export const deleteSection = async (req, res) => {
	const {
		body: { id }
	} = req;

	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" is required' });

	if (!Mongoose.Types.ObjectId.isValid(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: '"id" must be valid' });

	const section = await Section.findByIdAndDelete(id);

	if (!section) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Section does not exist' });

	return res
		.status(StatusCodes.OK)
		.json({ message: 'Section deleted successfully', data: section });
};
