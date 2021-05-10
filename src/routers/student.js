import { Router } from 'express';

import { getStudentById, studentLogin, updateStudent } from 'controllers/student';
import { auth, isStudent } from 'middlewares';

const router = Router();

router.post('/login', studentLogin);
router.put('/update', auth, isStudent, updateStudent);
router.get('/profile', auth, isStudent, getStudentById);

export default router;
