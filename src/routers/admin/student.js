import { Router } from 'express';

import { validateStudent } from 'models';
import {
	deleteStudent,
	getStudents,
	newStudent,
	getStudentById,
	getStudentByRegisterNumber,
	updateStudent
} from 'controllers/admin';
import {
	getStudentByIdValidator,
	getStudentByRegisterNoValidator,
	updateStudentValidator,
	deleteStudentValidator
} from 'validators/admin';
import { auth, isAdmin } from 'middlewares';
import { validateBody } from 'helpers';

const router = Router();

router.post('/new', auth, isAdmin, validateBody(validateStudent), newStudent);
router.get('/all', auth, isAdmin, getStudents);
router.put('/update', auth, isAdmin, validateBody(updateStudentValidator), updateStudent);
router.delete('/delete', auth, isAdmin, validateBody(deleteStudentValidator), deleteStudent);
router.get('/:id', auth, isAdmin, validateBody(getStudentByIdValidator, true), getStudentById);
router.get(
	'/registerNumber/:registerNumber',
	auth,
	isAdmin,
	validateBody(getStudentByRegisterNoValidator, true),
	getStudentByRegisterNumber
);

export default router;
