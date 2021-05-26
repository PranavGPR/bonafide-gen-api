import { Router } from 'express';

import { validateAdmin } from 'models';
import {
	newAdmin,
	deleteAdmin,
	getAdmins,
	getAdminById,
	countMembers,
	adminLogin
} from 'controllers/admin';
import { adminLoginValidator, getAdminByIdValidator, deleteAdminValidator } from 'validators/admin';
import { auth, isAdmin } from 'middlewares';
import { validateBody } from 'helpers';

const router = Router();

router.post('/login', validateBody(adminLoginValidator), adminLogin);
router.post('/new', auth, isAdmin, validateBody(validateAdmin), newAdmin);
router.delete('/delete', auth, isAdmin, validateBody(deleteAdminValidator), deleteAdmin);
router.get('/all', auth, isAdmin, getAdmins);
router.get('/count', auth, isAdmin, countMembers);
router.get('/:id', auth, isAdmin, validateBody(getAdminByIdValidator, true), getAdminById);

export default router;
