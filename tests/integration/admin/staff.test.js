import request from 'supertest';

import { Staff, Section } from 'models';
import staff from '../constants/staff';
import { generateBearerToken } from '../function';

let server;

describe('/admin/staff/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(async () => {
		await Section.deleteMany({});
		await Staff.deleteMany({});

		await server.close();
	});

	describe('GET /all', () => {
		let token;

		const exec = () => {
			return request(server).get('/admin/staff/all').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 if staff found', async () => {
			const newStaff = new Staff({
				...staff[0]
			});
			await newStaff.save();

			token = generateBearerToken('admin');
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
		});
	});

	describe('GET /:id', () => {
		let token, id;

		const exec = () => {
			return request(server).get(`/admin/staff/${id}`).set('Authorization', token);
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
			expect(res.body).toHaveProperty('error', '"id" must be valid');
		});

		it('should return 404 if staff not found', async () => {
			id = '6098d94aff57742ef8dbd048';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if staff found', async () => {
			const newStaff = new Staff({
				...staff[0]
			});
			await newStaff.save();

			id = newStaff._id;
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('POST /new', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server).post('/admin/staff/new').set('Authorization', token).send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				...staff[0]
			};
			delete payload.originalPassword;
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if some fields are missing', async () => {
			delete payload.name;
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 200 if staff created without section', async () => {
			delete payload.section;
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStaff = await Staff.find({});
			expect(updatedStaff).toHaveLength(1);
		});

		it('should return 200 if staff created with section', async () => {
			const newSection = new Section({
				name: 'test'
			});
			await newSection.save();

			payload.section = newSection._id;
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.findById(newSection._id);
			expect(updatedSection.staffs).toHaveLength(1);
		});
	});

	describe('PUT /update', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server).put('/admin/staff/update').set('Authorization', token).send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '6098d94aff57742ef8dbd048'
			};
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id not passed', async () => {
			delete payload.id;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"id" is required');
		});

		it('should return 400 if id is not valid', async () => {
			payload.id = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"id" must be valid');
		});

		it('should return 400 if payload only contains id', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'No fields specified');
		});

		it('should return 404 if staff not found', async () => {
			payload.email = 'san@gmail.com';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if staff found', async () => {
			const newStaff = new Staff({
				...staff[0]
			});
			await newStaff.save();

			const email = 'test@gmail.com';

			payload = {
				id: newStaff._id,
				email
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStaff = await Staff.findOne({ _id: newStaff._id });
			expect(updatedStaff._doc.email).toBe(email);
		});
	});

	describe('DELETE /delete', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server)
				.delete('/admin/staff/delete')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '6098d94aff57742ef8dbd048'
			};
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id not passed', async () => {
			delete payload.id;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"id" is required');
		});

		it('should return 400 if id is not valid', async () => {
			payload.id = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"id" must be valid');
		});

		it('should return 404 if staff not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 400 if staff bind with section', async () => {
			const newStaff = new Staff({
				...staff[0]
			});
			const section = new Section({
				name: 'test',
				students: ['6098d94aff57742ef8dbd048'],
				staffs: [newStaff._id]
			});
			await section.save();
			newStaff.section = section._id;
			await newStaff.save();

			payload = {
				id: newStaff._id
			};
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Staff is bind with section');
		});

		it('should return 200 if staff found and deleted', async () => {
			const newStaff = new Staff({
				...staff[0]
			});
			await newStaff.save();

			payload = {
				id: newStaff._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStaff = await Staff.findOne({ _id: newStaff._id });
			expect(updatedStaff).toBeNull();
		});
	});
});
