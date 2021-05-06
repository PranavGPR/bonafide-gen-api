import { errorHandler } from 'middlewares';
import { AdminRouter } from 'routers';

export default function registerRouters(app) {
	app.use('/admin', AdminRouter);

	app.use(errorHandler);
}
