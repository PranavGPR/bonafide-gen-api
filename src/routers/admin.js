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
	getAdminById
} from 'controllers/admin';

const router = Router();

router.post('/new', newAdmin);
router.delete('/delete', deleteAdmin);
router.get('/all', getAdmins);
router.get('/:id', getAdminById);

router.post('/student/new', newStudent);
router.delete('/student/delete', deleteStudent);
router.get('/student/all', getStudents);
router.get('/student/:id', getStudentById);
router.get('/student/:registerNumber', getStudentByRegisterNumber);

router.post('/staff/new', newStaff);
router.delete('/staff/delete', deleteStaff);
router.get('/staff/all', getStaffs);
router.get('/staff/:id', getStaffById);

router.post('/section/new', newSection);
router.delete('/section/delete', deleteSection);
router.get('/section/all', getSections);
router.get('/section/:id', getSectionById);

export default router;
