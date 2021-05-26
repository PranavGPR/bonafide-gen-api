import { Router } from 'express';

import AdminRouter from './admin';
import SectionRouter from './section';
import StudentRouter from './student';
import StaffRouter from './staff';

const router = Router();

router.use('/section', SectionRouter);
router.use('/student', StudentRouter);
router.use('/staff', StaffRouter);
router.use('/', AdminRouter);

export default router;
