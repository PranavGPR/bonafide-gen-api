import { Router } from 'express';

import {
	deleteStaff,
	deleteStudent,
	getStudents,
	newStaff,
	newStudent,
	getStaffs,
	getStudentById,
	getStudentByRegisterNumber,
	getStaffById,
	newSection,
	deleteSection,
	getSections,
	getSectionById,
	newAdmin,
	deleteAdmin,
	getAdmins,
	getAdminById,
	countMembers,
	updateStudent,
	updateStaff,
	updateSectionName,
	updateSectionStaff,
	updateSectionStudent
} from 'controllers/admin';

const router = Router();

router.post('/new', newAdmin);
router.delete('/delete', deleteAdmin);
router.get('/all', getAdmins);
router.get('/count', countMembers);
router.get('/:id', getAdminById);

router.post('/student/new', newStudent);
router.get('/student/all', getStudents);
router.put('/student/update', updateStudent);
router.delete('/student/delete', deleteStudent);
router.get('/student/:id', getStudentById);
router.get('/student/:registerNumber', getStudentByRegisterNumber);

router.post('/staff/new', newStaff);
router.get('/staff/all', getStaffs);
router.put('/staff/update', updateStaff);
router.delete('/staff/delete', deleteStaff);
router.get('/staff/:id', getStaffById);

router.post('/section/new', newSection);
router.get('/section/all', getSections);
router.put('/section/update/name', updateSectionName);
router.put('/section/update/staff', updateSectionStaff);
router.put('/section/update/student', updateSectionStudent);
router.delete('/section/delete', deleteSection);
router.get('/section/:id', getSectionById);

export default router;
