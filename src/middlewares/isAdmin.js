import { StatusCodes } from 'http-status-codes';

export default (req, res, next) => {
	if (!(req.user.role === 'admin'))
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Access Denied' });

	next();
};
