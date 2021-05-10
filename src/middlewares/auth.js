import jwt from 'jsonwebtoken';
import 'dotenv/config';
import config from 'config';
import { StatusCodes } from 'http-status-codes';

export default (req, res, next) => {
	const token = req.header('x-auth-token');
	if (!token) res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Access denied.' });

	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid token' });
	}
};
