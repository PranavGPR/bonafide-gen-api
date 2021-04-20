import logger from 'tools/logging';
import { StatusCodes } from 'http-status-codes';

export default (err, _req, res, next) => {
	logger.error(err.message, err);

	res
		.status(err.code ?? StatusCodes.INTERNAL_SERVER_ERROR)
		.json({
			message:
				err.message ?? 'Something went wrong from our side. Please try again after some time.'
		});
	next(err);
};
