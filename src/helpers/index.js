import jwt from 'jsonwebtoken';
import 'dotenv/config';
import config from 'config';
import { StatusCodes } from 'http-status-codes';

export const sendSuccess = (res, body) => {
	return res.status(StatusCodes.OK).json(body);
};

export const sendFailure = (res, body, code = StatusCodes.BAD_REQUEST) => {
	return res.status(code).json(body);
};

export const validateBody = validator => {
	return (req, res, next) => {
		const { error } = validator(req.body);
		if (error) return sendFailure(res, { error: error.details[0].message });

		next();
	};
};

export const generateToken = payload => {
	return jwt.sign(payload, config.get('jwtPrivateKey'));
};
