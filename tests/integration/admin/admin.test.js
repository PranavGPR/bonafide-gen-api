import request from 'supertest';

import { Admin } from 'models';
import admin from '../constants/admin';
import { generateBearerToken } from '../function';

let server;

describe('/admin/', () => {
	const adminData = {
		...admin[0]
	};
	delete adminData.originalPassword;

	beforeEach(() => {
		server = require('../../../src/server');
	});

	afterEach(async () => {
		await Admin.deleteMany({});

		await server.close();
	});

	describe('POST /login', () => {
		let payload;

		const exec = () => {
			return request(server).post('/admin/login').send(payload);
		};

		beforeEach(() => {
			payload = {
				email: admin[0].email,
				password: admin[0].originalPassword
			};
		});

		it('should return 400 if some field are missing', async () => {
			delete payload.email;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should return 400 if admin not found', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 400 if password is wrong', async () => {
			const newAdmin = new Admin(adminData);
			await newAdmin.save();

			payload.password = '123457';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password Incorrect');
		});

		it('should return 200 if data are correct', async () => {
			const newAdmin = new Admin(adminData);
			await newAdmin.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});
	});

	describe('POST /new', () => {
		let payload, token;

		const exec = () => {
			return request(server).post('/admin/new').set('Authorization', token).send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				...adminData
			};
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if some field are missing', async () => {
			delete payload.email;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should return 200 if admin is created', async () => {
			const res = await exec();

			expect(res.status).toBe(200);

			const admins = await Admin.find({});
			expect(admins).toHaveLength(1);
		});
	});

	describe('GET /all', () => {
		let token;

		const exec = () => {
			return request(server).get('/admin/all').set('Authorization', token);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 with all admin data', async () => {
			const newAdmin = new Admin(adminData);
			await newAdmin.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
		});
	});

	describe('GET /:id', () => {
		let token, id;

		const exec = () => {
			return request(server).get(`/admin/${id}`).set('Authorization', token);
		};

		beforeEach(() => {
			id = 'test';
			token = generateBearerToken('admin');
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id is not valid', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'id must be valid');
		});

		it('should return 404 if admin not found', async () => {
			id = '6098d94aff57742ef8dbd048';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if admin found', async () => {
			const newAdmin = new Admin({
				...admin[0]
			});
			await newAdmin.save();

			id = newAdmin._id;
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /count', () => {
		let token;

		const exec = () => {
			return request(server).get('/admin/count').set('Authorization', token);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 with all count', async () => {
			const newAdmin = new Admin(adminData);
			await newAdmin.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.adminCount).toBe(1);
		});
	});

	describe('DELETE /delete', () => {
		let payload, token;

		const exec = () => {
			return request(server).delete('/admin/delete').set('Authorization', token).send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '609d2a9a073de31b55e4f31a'
			};
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id is missing', async () => {
			delete payload.id;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'id field required');
		});

		it('should return 400 if id is invalid', async () => {
			payload.id = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Not a valid id');
		});

		it('should return 404 if admin not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if admin is deleted', async () => {
			const newAdmin = new Admin(adminData);
			await newAdmin.save();

			payload.id = newAdmin._id;
			const res = await exec();

			expect(res.status).toBe(200);

			const admins = await Admin.find({});
			expect(admins).toHaveLength(0);
		});
	});
});
