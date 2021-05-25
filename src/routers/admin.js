import { Router } from 'express';

import { validateAdmin, validateStaff, validateStudent } from 'models';
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
	removeSectionStaff,
	removeSectionStudent,
	adminLogin
} from 'controllers/admin';
import {
	adminLoginValidator,
	getAdminByIdValidator,
	deleteAdminValidator,
	getStudentByIdValidator,
	getStudentByRegisterNoValidator,
	updateStudentValidator,
	deleteStudentValidator,
	getStaffByIdValidator,
	updateStaffValidator,
	deleteStaffValidator
} from 'validators/admin';
import { auth, isAdmin } from 'middlewares';
import { validateBody } from 'helpers';

const router = Router();

router.post('/login', validateBody(adminLoginValidator), adminLogin);
router.post('/new', auth, isAdmin, validateBody(validateAdmin), newAdmin);
router.delete('/delete', auth, isAdmin, validateBody(deleteAdminValidator), deleteAdmin);
router.get('/all', auth, isAdmin, getAdmins);
router.get('/count', auth, isAdmin, countMembers);
router.get('/:id', auth, isAdmin, validateBody(getAdminByIdValidator, true), getAdminById);

router.post('/student/new', auth, isAdmin, validateBody(validateStudent), newStudent);
router.get('/student/all', auth, isAdmin, getStudents);
router.put('/student/update', auth, isAdmin, validateBody(updateStudentValidator), updateStudent);
router.delete(
	'/student/delete',
	auth,
	isAdmin,
	validateBody(deleteStudentValidator),
	deleteStudent
);
router.get(
	'/student/:id',
	auth,
	isAdmin,
	validateBody(getStudentByIdValidator, true),
	getStudentById
);
router.get(
	'/student/registerNumber/:registerNumber',
	auth,
	isAdmin,
	validateBody(getStudentByRegisterNoValidator, true),
	getStudentByRegisterNumber
);

router.post('/staff/new', auth, isAdmin, validateBody(validateStaff), newStaff);
router.get('/staff/all', auth, isAdmin, getStaffs);
router.put('/staff/update', auth, isAdmin, validateBody(updateStaffValidator), updateStaff);
router.delete('/staff/delete', auth, isAdmin, validateBody(deleteStaffValidator), deleteStaff);
router.get('/staff/:id', auth, isAdmin, validateBody(getStaffByIdValidator, true), getStaffById);

router.post('/section/new', auth, isAdmin, newSection);
router.get('/section/all', auth, isAdmin, getSections);
router.put('/section/update/name', auth, isAdmin, updateSectionName);
router.put('/section/update/staff', auth, isAdmin, updateSectionStaff);
router.put('/section/update/student', auth, isAdmin, updateSectionStudent);
router.delete('/section/update/staff', auth, isAdmin, removeSectionStaff);
router.delete('/section/update/student', auth, isAdmin, removeSectionStudent);
router.delete('/section/delete', auth, isAdmin, deleteSection);
router.get('/section/:id', auth, isAdmin, getSectionById);

export default router;
