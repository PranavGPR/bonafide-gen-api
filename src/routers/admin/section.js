import { Router } from 'express';

import {
	newSection,
	deleteSection,
	getSections,
	getSectionById,
	updateSectionName,
	updateSectionStaff,
	updateSectionStudent,
	removeSectionStaff,
	removeSectionStudent
} from 'controllers/admin';
import { auth, isAdmin } from 'middlewares';

const router = Router();

router.post('/new', auth, isAdmin, newSection);
router.get('/all', auth, isAdmin, getSections);
router.put('/update/name', auth, isAdmin, updateSectionName);
router.put('/update/staff', auth, isAdmin, updateSectionStaff);
router.put('/update/student', auth, isAdmin, updateSectionStudent);
router.delete('/update/staff', auth, isAdmin, removeSectionStaff);
router.delete('/update/student', auth, isAdmin, removeSectionStudent);
router.delete('/delete', auth, isAdmin, deleteSection);
router.get('/:id', auth, isAdmin, getSectionById);

export default router;
