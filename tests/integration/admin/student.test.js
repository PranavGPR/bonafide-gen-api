import request from 'supertest';

import { Student, Section } from 'models';
import student from '../constants/student';
import { generateBearerToken } from '../function';

let server;

describe('/admin/student/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(async () => {
		await Section.deleteMany({});
		await Student.deleteMany({});

		await server.close();
	});

	describe('GET /all', () => {
		let token;

		const exec = () => {
			return request(server).get('/admin/student/all').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 if student found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			token = generateBearerToken('admin');
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
		});
	});

	describe('GET /:id', () => {
		let token, id;

		const exec = () => {
			return request(server).get(`/admin/student/${id}`).set('Authorization', token);
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

		it('should return 404 if student not found', async () => {
			id = '6098d94aff57742ef8dbd048';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if student found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			id = newStudent._id;
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /registerNumber/:registerNumber', () => {
		let token, registerNumber;

		const exec = () => {
			return request(server)
				.get(`/admin/student/registerNumber/${registerNumber}`)
				.set('Authorization', token);
		};

		beforeEach(() => {
			registerNumber = 'test';
			token = generateBearerToken('admin');
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if registerNumber is not valid', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'registerNumber must be valid');
		});

		it('should return 404 if student not found', async () => {
			registerNumber = '8100191';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if student found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			registerNumber = student[0].registerNumber;
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('POST /new', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server).post('/admin/student/new').set('Authorization', token).send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				...student[0]
			};
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

		it('should return 200 if student created without section', async () => {
			delete payload.section;
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStudent = await Student.find({});
			expect(updatedStudent).toHaveLength(1);
		});

		it('should return 200 if student created with section', async () => {
			const newSection = new Section({
				name: 'test'
			});
			await newSection.save();

			payload.section = newSection._id;
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.findById(newSection._id);
			expect(updatedSection.students).toHaveLength(1);
		});
	});

	describe('PUT /update', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server).put('/admin/student/update').set('Authorization', token).send(payload);
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
			expect(res.body).toHaveProperty('error', 'id field required');
		});

		it('should return 400 if id is not valid', async () => {
			payload.id = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Not a valid id');
		});

		it('should return 400 if payload only contains id', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'No fields specified');
		});

		it('should return 404 if student not found', async () => {
			payload.email = 'san@gmail.com';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if student found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			const email = 'test@gmail.com';

			payload = {
				id: newStudent._id,
				email
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStudent = await Student.findOne({ _id: newStudent._id });
			expect(updatedStudent._doc.email).toBe(email);
		});
	});

	describe('DELETE /delete', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server)
				.delete('/admin/student/delete')
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
			expect(res.body).toHaveProperty('error', 'id field required');
		});

		it('should return 400 if id is not valid', async () => {
			payload.id = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Not a valid id');
		});

		it('should return 404 if student not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if student found and deleted', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			payload = {
				id: newStudent._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStudent = await Student.findOne({ _id: newStudent._id });
			expect(updatedStudent).toBeNull();
		});
	});
});
