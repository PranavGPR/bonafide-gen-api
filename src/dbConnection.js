import mongoose from 'mongoose';
import chalk from 'chalk';
import 'dotenv/config';
import config from 'config';

import logger from 'tools/logging';

const DB_SERVER = config.get('DB_SERVER');

export const dbConnection = async () => {
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	};
	try {
		logger.debug(`Database server is at ${chalk.cyan(DB_SERVER)}`);
		mongoose.connect(DB_SERVER, options);
		await logger.info(`Database connection ${chalk.greenBright('successful')}`);
	} catch (err) {
		logger.error(`Database connection ${chalk.redBright('failed.')}`);
		logger.error(`Error: could not connect to the database at ${DB_SERVER}\n`, err);
	}
};
