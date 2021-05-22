import { Router } from 'express';

import {
	getStaffProfile,
	getStudentById,
	getStudentsBySection,
	staffLogin,
	updateStaff,
	getAppliedBonafide,
	getBonafideHistory,
	updateBonafideStatus
} from 'controllers/staff';
import {
	stafffLoginValidator,
	getStudentByIdValidator,
	updateStaffValidator,
	updateBonafideStatusValidator
} from 'validators/staff';
import { auth, isStaff } from 'middlewares';
import { validateBody } from 'helpers';

const router = Router();

router.post('/login', validateBody(stafffLoginValidator), staffLogin);
router.put('/update', auth, isStaff, validateBody(updateStaffValidator), updateStaff);
router.get('/profile', auth, isStaff, getStaffProfile);
router.get(
	'/student/:id',
	auth,
	isStaff,
	validateBody(getStudentByIdValidator, true),
	getStudentById
);
router.get('/section/student', auth, isStaff, getStudentsBySection);
router.get('/bonafide/applied', auth, isStaff, getAppliedBonafide);
router.get('/bonafide/history', auth, isStaff, getBonafideHistory);
router.put(
	'/bonafide/status',
	auth,
	isStaff,
	validateBody(updateBonafideStatusValidator),
	updateBonafideStatus
);

export default router;
