require('dotenv').config();
import express from 'express';
import chalk from 'chalk';
import 'express-async-errors';
import cors from 'cors';

// Must import dotenv config before config
import 'dotenv/config';

import { registerLogging, registerPreprocessor, registerRouters } from 'tools';
import { dbConnection } from './dbConnection';
import logger from 'tools/logging';

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
registerLogging(app);
registerPreprocessor(app);
registerRouters(app);

const server = app.listen(PORT);

server.once('listening', async () => {
	logger.info(`Server started at port ${chalk.magenta(PORT)}`);
	await dbConnection();
});

module.exports = server;
