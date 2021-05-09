import { Router } from 'express';

import { getStudentById, updateStudent } from 'controllers/student';

const router = Router();

router.get('/:id', getStudentById);
router.put('/update', updateStudent);

export default router;
