import config from 'config';

import winston from 'winston';
import requestLogger from './requestLogger';

const { format, transports } = winston;
const { combine, colorize, printf, json, prettyPrint, timestamp } = format;

export function registerLogging(app) {
	if (config.get('logRequests')) app.use(requestLogger);
}

function formatObject(param) {
	if (typeof param === 'string') {
		return param;
	}

	if (param instanceof Error) {
		return param.stack ? param.stack : JSON.stringify(param, null, 2);
	}

	return JSON.stringify(param, null, 2);
}

const prettyConsoleTransport = new transports.Console({
	format: combine(
		colorize(),
		json(),
		printf(info => {
			return `[${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString(
				'en-US'
			)}] ${info.level} | ${formatObject(info.message)}`;
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
	transports: [prettyConsoleTransport],
	exceptionHandlers: [prettyConsoleTransport, fileLogTransport('log/exceptions.log', 'error')],
	rejectionHandlers: [prettyConsoleTransport, fileLogTransport('log/rejections.log', 'warn')]
});
