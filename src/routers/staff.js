import { Router } from 'express';

import { getStaffById, getStudentById, getStudentsBySection, updateStaff } from 'controllers/staff';

const router = Router();

router.get('/student/:id', getStudentById);
router.get('/section/student/all/:id', getStudentsBySection);
router.put('/update', updateStaff);
router.get('/:id', getStaffById);

export default router;
