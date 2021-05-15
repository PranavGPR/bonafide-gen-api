import nodemailer from 'nodemailer';
import 'dotenv/config';
import config from 'config';

export default nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.get('MAIL_USER_NAME'),
		pass: config.get('MAIL_PASSWORD')
	}
});
