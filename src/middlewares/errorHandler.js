import logger from 'tools/logging';
import { StatusCodes } from 'http-status-codes';

export default (err, req, res, next) => {
	const { body } = req;

	logger.error(err.message, err);

	if (err.code === 11000) {
		const errorKeys = Object.keys(err.keyPattern);
		return res
			.status(400)
			.json({ error: `${body[errorKeys[0]]} is already registered`, detail: err });
	}

	res.status(err.code ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
		message: err.message ?? 'Something went wrong from our side. Please try again after some time.'
	});
	next(err);
};
