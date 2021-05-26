import { Router } from 'express';

import { validateStaff } from 'models';
import { deleteStaff, newStaff, getStaffs, getStaffById, updateStaff } from 'controllers/admin';
import {
	getStaffByIdValidator,
	updateStaffValidator,
	deleteStaffValidator
} from 'validators/admin';
import { auth, isAdmin } from 'middlewares';
import { validateBody } from 'helpers';

const router = Router();

router.post('/new', auth, isAdmin, validateBody(validateStaff), newStaff);
router.get('/all', auth, isAdmin, getStaffs);
router.put('/update', auth, isAdmin, validateBody(updateStaffValidator), updateStaff);
router.delete('/delete', auth, isAdmin, validateBody(deleteStaffValidator), deleteStaff);
router.get('/:id', auth, isAdmin, validateBody(getStaffByIdValidator, true), getStaffById);

export default router;
