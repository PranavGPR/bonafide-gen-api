import { StatusCodes } from 'http-status-codes';

/**
 * Controllers for all /ping routes
 *
 * Available controllers: basePing
 */

export function basePing(_req, res) {
	/**
	 * Ping the server
	 * @param {}
	 * @returns Status `200`
	 */
	res.sendStatus(StatusCodes.OK);
}

export default { basePing };
