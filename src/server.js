import express from 'express';
import chalk from 'chalk';
import 'express-async-errors';
import cors from 'cors';

import 'dotenv/config';
import config from 'config';

import { registerLogging, registerPreprocessor, registerRouters } from 'tools';
import { dbConnection } from './dbConnection';
import logger from 'tools/logging';

const PORT = config.get('port');

const app = express();
app.use(cors());
app.use(express.json());
registerLogging(app);
registerPreprocessor(app);
registerRouters(app);
dbConnection();

const server = app.listen(PORT);

server.once('listening', async () => {
	const { port } = server.address();
	logger.info(`Server started at port ${chalk.magenta(port)}`);
});

module.exports = server;
