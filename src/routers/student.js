import { Router } from 'express';

import {
	getStudentDetail,
	studentLogin,
	updateStudent,
	getBonafideStatus,
	applyBonafide,
	reviewBonafide
} from 'controllers/student';
import { auth, isStudent } from 'middlewares';

const router = Router();

router.post('/login', studentLogin);
router.put('/update', auth, isStudent, updateStudent);
router.get('/profile', auth, isStudent, getStudentDetail);
router.get('/profile', auth, isStudent, getStudentDetail);
router.get('/profile', auth, isStudent, getStudentDetail);
router.get('/bonafide/status', auth, isStudent, getBonafideStatus);
router.get('/bonafide/apply', auth, isStudent, applyBonafide);
router.put('/bonafide/review', auth, isStudent, reviewBonafide);

export default router;
