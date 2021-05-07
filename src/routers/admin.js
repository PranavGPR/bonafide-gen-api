import { Router } from 'express';

import { deleteStaff, deleteStudent, newStaff, newStudent } from 'controllers/admin';
import { errorHandler } from 'middlewares';

const router = Router();

router.post('/student/new', errorHandler, newStudent);
router.delete('/student/delete', errorHandler, deleteStudent);
router.post('/staff/new', errorHandler, newStaff);
router.delete('/staff/delete', errorHandler, deleteStaff);

export default router;
