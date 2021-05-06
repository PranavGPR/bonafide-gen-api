import { Router } from 'express';

import { deleteStaff, deleteStudent, newStaff, newStudent } from 'controllers/admin';

const router = Router();

router.post('/student/new', newStudent);
router.delete('/student/delete', deleteStudent);
router.post('/staff/new', newStaff);
router.delete('/staff/delete', deleteStaff);

export default router;
