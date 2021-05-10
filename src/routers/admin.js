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
	updateSectionStudent,
	adminLogin
} from 'controllers/admin';
import { auth, isAdmin } from 'middlewares';

const router = Router();

router.post('/login', adminLogin);
router.post('/new', auth, isAdmin, newAdmin);
router.delete('/delete', auth, isAdmin, deleteAdmin);
router.get('/all', auth, isAdmin, getAdmins);
router.get('/count', auth, isAdmin, countMembers);
router.get('/:id', auth, isAdmin, getAdminById);

router.post('/student/new', auth, isAdmin, newStudent);
router.get('/student/all', auth, isAdmin, getStudents);
router.put('/student/update', auth, isAdmin, updateStudent);
router.delete('/student/delete', auth, isAdmin, deleteStudent);
router.get('/student/:id', auth, isAdmin, getStudentById);
router.get('/student/:registerNumber', auth, isAdmin, getStudentByRegisterNumber);

router.post('/staff/new', auth, isAdmin, newStaff);
router.get('/staff/all', auth, isAdmin, getStaffs);
router.put('/staff/update', auth, isAdmin, updateStaff);
router.delete('/staff/delete', auth, isAdmin, deleteStaff);
router.get('/staff/:id', auth, isAdmin, getStaffById);

router.post('/section/new', auth, isAdmin, newSection);
router.get('/section/all', auth, isAdmin, getSections);
router.put('/section/update/name', auth, isAdmin, updateSectionName);
router.put('/section/update/staff', auth, isAdmin, updateSectionStaff);
router.put('/section/update/student', auth, isAdmin, updateSectionStudent);
router.delete('/section/delete', auth, isAdmin, deleteSection);
router.get('/section/:id', auth, isAdmin, getSectionById);

export default router;
