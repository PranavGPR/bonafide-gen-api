import config from 'config';

import winston from 'winston';
import requestLogger from './requestLogger';

const { format, transports } = winston;
const { combine, colorize, printf, json, prettyPrint, timestamp } = format;

export function registerLogging(app) {
	if (config.get('logRequests')) app.use(requestLogger);
}

const prettyConsoleTransport = new transports.Console({
	format: combine(
		colorize(),
		json(),
		printf(info => {
			return `[${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString(
				'en-US'
			)}] ${info.level} | ${info.message}`;
		})
	)
});

const fileLogTransport = (filename, level) => {
	return new transports.File({
		filename,
		level,
		format: combine(json(), timestamp(), prettyPrint())
	});
};

export default winston.createLogger({
	level: config.get('loggingLevel'),
	transports: [prettyConsoleTransport, fileLogTransport('log/log.log', 'verbose')],
	exceptionHandlers: [prettyConsoleTransport, fileLogTransport('log/exceptions.log', 'error')],
	rejectionHandlers: [prettyConsoleTransport, fileLogTransport('log/rejections.log', 'warn')]
});
