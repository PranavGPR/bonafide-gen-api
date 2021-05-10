import { Router } from 'express';

import {
	getStaffById,
	getStudentById,
	getStudentsBySection,
	staffLogin,
	updateStaff
} from 'controllers/staff';
import { auth, isStaff } from 'middlewares';

const router = Router();

router.post('/login', staffLogin);
router.put('/update', auth, isStaff, updateStaff);
router.get('/profile', auth, isStaff, getStaffById);
router.get('/student/:id', auth, isStaff, getStudentById);
router.get('/section/student/all/:id', auth, isStaff, getStudentsBySection);

export default router;
