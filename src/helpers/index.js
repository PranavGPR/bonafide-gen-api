import { StatusCodes } from 'http-status-codes';

export const sendSuccess = (res, body) => {
	return res.status(StatusCodes.OK).json(body);
};

export const sendFailure = (res, body, code = StatusCodes.BAD_REQUEST) => {
	return res.status(code).json(body);
};
