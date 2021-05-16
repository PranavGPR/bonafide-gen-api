import { Router } from 'express';
import { basePing } from 'controllers/ping';

const router = Router();

/**
 * Router for /ping routes
 *
 * Available routes: /
 */

router.get('/', basePing);

export default router;
