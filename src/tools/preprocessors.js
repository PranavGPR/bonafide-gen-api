import config from 'config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export default function registerPreprocessor(app) {
	if (config.util.getEnv('NODE_ENV') === 'production') {
		app.use(helmet());
		app.use(
			rateLimit({
				windowMs: 10 * 60 * 1000,
				max: 20,
				message: 'Request limit exhausted for this IP, try again later.',
				skipSuccessfulRequests: true
			})
		);
	}
}
