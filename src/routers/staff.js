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
import { auth, isStaff } from 'middlewares';

const router = Router();

router.post('/login', staffLogin);
router.put('/update', auth, isStaff, updateStaff);
router.get('/profile', auth, isStaff, getStaffProfile);
router.get('/student/:id', auth, isStaff, getStudentById);
router.get('/section/student', auth, isStaff, getStudentsBySection);
router.get('/bonafied/applied', auth, isStaff, getAppliedBonafide);
router.get('/bonafied/history', auth, isStaff, getBonafideHistory);
router.put('/bonafied/status', auth, isStaff, updateBonafideStatus);

export default router;
