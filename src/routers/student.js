import { Router } from 'express';

import {
	getStudentDetail,
	studentLogin,
	updateStudent,
	getBonafideStatus,
	applyBonafide,
	reviewBonafide
} from 'controllers/student';
import {
	reviewBonafideValidator,
	updateStudentValidator,
	studentLoginValidator
} from 'validators/student';
import { auth, isStudent } from 'middlewares';
import { validateBody } from 'helpers';

const router = Router();

router.post('/login', validateBody(studentLoginValidator), studentLogin);
router.put('/update', auth, isStudent, validateBody(updateStudentValidator), updateStudent);
router.get('/profile', auth, isStudent, getStudentDetail);
router.get('/bonafide/status', auth, isStudent, getBonafideStatus);
router.get('/bonafide/apply', auth, isStudent, applyBonafide);
router.put(
	'/bonafide/review',
	auth,
	isStudent,
	validateBody(reviewBonafideValidator),
	reviewBonafide
);

export default router;
