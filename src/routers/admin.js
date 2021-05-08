import { Router } from 'express';

import {
	deleteStaff,
	deleteStudent,
	getStudents,
	newStaff,
	newStudent,
	getStaffs,
	getStudentById,
	getStudentByRegisterNumber
} from 'controllers/admin';

const router = Router();

router.post('/student/new', newStudent);
router.delete('/student/delete', deleteStudent);
router.get('/student/all', getStudents);
router.get('/student/:id', getStudentById);
router.get('/student/:registerNumber', getStudentByRegisterNumber);

router.post('/staff/new', newStaff);
router.delete('/staff/delete', deleteStaff);
router.get('/staff/all', getStaffs);

export default router;
