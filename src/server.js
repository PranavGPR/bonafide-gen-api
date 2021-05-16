require('dotenv').config();
import express from 'express';
import chalk from 'chalk';
import 'express-async-errors';
import cors from 'cors';

// Must import dotenv config before config
import 'dotenv/config';
import config from 'config';

import { registerLogging, registerPreprocessor, registerRouters } from 'tools';
import { dbConnection } from './dbConnection';
import logger from 'tools/logging';

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : config.get('port');
const HOST = config.get('host');

const app = express();
app.use(cors());
app.use(express.json());
registerLogging(app);
registerPreprocessor(app);
registerRouters(app);

const server = app.listen(PORT, HOST);

server.once('listening', async () => {
	const { address, port } = server.address();
	logger.info(`Server started at port ${chalk.magenta(port)}`);
	logger.info(`Listening for requests at ${chalk.cyan(address + ':' + port)}`);
	await dbConnection();
});
