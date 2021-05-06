import { errorHandler } from 'middlewares';
import { AdminRouter, PingRouter } from 'routers';

export default function registerRouters(app) {
	app.use('/ping', PingRouter);
	app.use('/admin', AdminRouter);

	app.use(errorHandler);
}
