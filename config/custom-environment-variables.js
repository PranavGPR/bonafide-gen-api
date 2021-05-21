/**
 * These values will be loaded from '.env' file
 * refer docs: https://github.com/lorenwest/node-config/wiki/Environment-Variables
 * these values will be loaded from other configs if env is not set
 *
 * logRequests can be exposed from env to make it easier to troubleshoot in production
 */

module.exports = {
	host: 'HOST',
	port: 'PORT',
	logRequests: 'VERBOSE_REQ_LOGGING',
	DB_SERVER:
		process.env.NODE_ENV === 'production'
			? 'DB_SERVER_PROD'
			: process.env.NODE_ENV === 'test'
			? 'DB_SERVER_TEST'
			: 'DB_SERVER_DEV',
	jwtPrivateKey: 'jwtPrivateKey',
	MAIL_USER_NAME: 'MAIL_USER_NAME',
	MAIL_PASSWORD: 'MAIL_PASSWORD',
	WEBSITE_URL: 'WEBSITE_URL'
};
