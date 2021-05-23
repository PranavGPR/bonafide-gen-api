import request from 'supertest';

import { Student, Certificate, Section } from 'models';
import { generateBearerToken } from './function';
import student from './constants/student';

let server;

describe('/student/', () => {
	beforeEach(() => {
		server = require('../../src/server');
	});
	afterEach(async () => {
		await Certificate.deleteMany({});
		await Section.deleteMany({});
		await Student.deleteMany({});

		await server.close();
	});

	describe('POST /login', () => {
		let payload;

		const exec = () => {
			return request(server).post('/student/login').send(payload);
		};

		beforeEach(() => {
			payload = {
				registerNumber: student[0].registerNumber,
				dateOfBirth: student[0].dateOfBirth
			};
		});

		it('should return 400 if some field are missing', async () => {
			delete payload.dateOfBirth;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should return 404 if student not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'Student does not exist');
		});

		it('should return 400 if dob is wrong', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();
			payload.dateOfBirth = '1991-06-12';

			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'DOB is wrong');
		});

		it('should return 200 if data are correct', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});
	});

	describe('GET /profile', () => {
		let token;

		const exec = () => {
			return request(server).get('/student/profile').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if student not found', async () => {
			token = generateBearerToken('student');
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if student found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			token = generateBearerToken('student', newStudent._id, newStudent.name);
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /profile', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server).put('/student/update').set('Authorization', token).send(payload);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if payload is empty', async () => {
			token = generateBearerToken('student');
			payload = {};
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 404 if student not found', async () => {
			token = generateBearerToken('student');
			payload = { email: 'san@gmail.com' };
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if student found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			const email = 'test@gmail.com';

			token = generateBearerToken('student', newStudent._id, newStudent.name);
			payload = {
				email
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStudent = await Student.findOne({ _id: newStudent._id });
			expect(updatedStudent._doc.email).toBe(email);
		});
	});

	describe('GET /student/bonafide', () => {
		let token, newStudent;

		const exec = () => {
			return request(server).get('/student/bonafide/status').set('Authorization', token);
		};

		beforeEach(async () => {
			newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			token = generateBearerToken('student', newStudent._id, newStudent.name);
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 with null data if no certificate found', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toBe(null);
		});

		it('should return 200 with data if certificate found', async () => {
			const certificate = new Certificate({
				studentID: newStudent._id,
				sectionID: '6098d94aff57742ef8dbd048'
			});
			certificate.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveProperty('status');
		});
	});

	describe('GET /bonafide/apply', () => {
		let token;

		const exec = () => {
			return request(server).get('/student/bonafide/apply').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 with if section is null', async () => {
			const newStudent = new Student({
				...student[0],
				section: null
			});
			await newStudent.save();

			token = generateBearerToken('student', newStudent._id, newStudent.name);
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 200 with if certificate created', async () => {
			const section = new Section({
				name: 'dummy'
			});
			await section.save();
			const newStudent = new Student({
				...student[0],
				section: section._id
			});
			await newStudent.save();

			token = generateBearerToken('student', newStudent._id, newStudent.name);
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /bonafide/review', () => {
		let token, payload, newStudent, section;

		const exec = () => {
			return request(server)
				.put('/student/bonafide/review')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(async () => {
			payload = {};
			section = new Section({
				name: 'dummy'
			});
			await section.save();
			newStudent = new Student({
				...student[0],
				section: section._id
			});
			await newStudent.save();
			token = generateBearerToken('student', newStudent._id, newStudent.name);
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if bonafideID is not passed', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"bonafideID" is required');
		});

		it('should return 400 if bonafideID is not an valid object', async () => {
			payload.bonafideID = 'asvdgsd';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"bonafideID" must be valid');
		});

		it('should return 400 with if section is null', async () => {
			newStudent = newStudent = new Student({
				...student[1],
				section: null
			});
			await newStudent.save();

			token = generateBearerToken('student', newStudent._id, newStudent.name);
			payload.bonafideID = newStudent._id;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'error',
				'You must be part of some section! Contact your Class Coordinator.'
			);
		});

		it('should return 404 with if certificate not found', async () => {
			payload.bonafideID = section._id;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 with if certificate re-requested', async () => {
			const certificate = new Certificate({
				studentID: newStudent._id,
				sectionID: section._id,
				status: 'rejected'
			});
			await certificate.save();

			payload.bonafideID = certificate._id;
			const res = await exec();

			expect(res.status).toBe(200);

			const updated = await Certificate.findOne({ _id: certificate._id });
			expect(updated.status).toBe('applied');
		});
	});
});
