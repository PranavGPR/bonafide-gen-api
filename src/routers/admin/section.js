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
import {
	updateSectionNameValidator,
	getSectionByIdValidator,
	updateSectionStaffValidator,
	updateSectionStudentValidator,
	deleteSectionValidator
} from 'validators/admin';
import { auth, isAdmin } from 'middlewares';
import { validateBody } from 'helpers';
import { validateSection } from 'models/section';

const router = Router();

router.post('/new', auth, isAdmin, validateBody(validateSection), newSection);
router.get('/all', auth, isAdmin, getSections);
router.put(
	'/update/name',
	auth,
	isAdmin,
	validateBody(updateSectionNameValidator),
	updateSectionName
);
router.put(
	'/update/staff',
	auth,
	isAdmin,
	validateBody(updateSectionStaffValidator),
	updateSectionStaff
);
router.put(
	'/update/student',
	auth,
	isAdmin,
	validateBody(updateSectionStudentValidator),
	updateSectionStudent
);
router.delete(
	'/update/staff',
	auth,
	isAdmin,
	validateBody(updateSectionStaffValidator),
	removeSectionStaff
);
router.delete(
	'/update/student',
	auth,
	isAdmin,
	validateBody(updateSectionStudentValidator),
	removeSectionStudent
);
router.delete('/delete', auth, isAdmin, validateBody(deleteSectionValidator), deleteSection);
router.get('/:id', auth, isAdmin, validateBody(getSectionByIdValidator, true), getSectionById);

export default router;
