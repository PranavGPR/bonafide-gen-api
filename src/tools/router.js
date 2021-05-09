import { errorHandler } from 'middlewares';
import { AdminRouter, PingRouter, StaffRouter, StudentRouter } from 'routers';

export default function registerRouters(app) {
	app.use('/admin', AdminRouter);
	app.use('/student', StudentRouter);
	app.use('/staff', StaffRouter);
	app.use('/ping', PingRouter);

	app.use(errorHandler);
}
