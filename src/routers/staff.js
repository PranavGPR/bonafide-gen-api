import { Router } from 'express';

import {
	getStaffProfile,
	getStudentById,
	getStudentsBySection,
	staffLogin,
	updateStaff
} from 'controllers/staff';
import { auth, isStaff } from 'middlewares';

const router = Router();

router.post('/login', staffLogin);
router.put('/update', auth, isStaff, updateStaff);
router.get('/profile', auth, isStaff, getStaffProfile);
router.get('/student/:id', auth, isStaff, getStudentById);
router.get('/section/student', auth, isStaff, getStudentsBySection);

export default router;
