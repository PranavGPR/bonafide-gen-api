import jwt from 'jsonwebtoken';

export const generateBearerToken = (role, id = '6098d94aff57742ef8dbd048', name = 'test') => {
	return 'bearer ' + jwt.sign({ role, id, name }, process.env.jwtPrivateKey);
};
