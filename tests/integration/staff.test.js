import request from 'supertest';
import { Staff, Student, Certificate, Section } from 'models';
import { generateBearerToken } from './function';
import staff from './constants/staff';
import student from './constants/student';

let server;

describe('/staff/', () => {
	const staffData = {
		...staff[0]
	};
	delete staffData.originalPassword;

	beforeEach(() => {
		server = require('../../src/server');
	});

	afterEach(async () => {
		await Staff.deleteMany({});
		await Student.deleteMany({});
		await Certificate.deleteMany({});
		await Section.deleteMany({});

		await server.close();
	});

	describe('POST /login', () => {
		let payload;

		const exec = () => {
			return request(server).post('/staff/login').send(payload);
		};

		beforeEach(() => {
			payload = {
				email: staff[0].email,
				password: staff[0].originalPassword
			};
		});

		it('should return 400 if some field are missing', async () => {
			delete payload.email;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should return 404 if staff not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'email or password incorrect');
		});

		it('should return 400 if password is wrong', async () => {
			const newStaff = new Staff(staffData);
			await newStaff.save();

			payload.password = '123457';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'email or password incorrect');
		});

		it('should return 200 if data are correct', async () => {
			const newStaff = new Staff(staffData);
			await newStaff.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});
	});

	describe('GET /profile', () => {
		let token;

		const exec = () => {
			return request(server).get('/staff/profile').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if staff not found', async () => {
			token = generateBearerToken('staff');
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if staff found', async () => {
			const newStaff = new Staff(staffData);
			await newStaff.save();

			token = generateBearerToken('staff', newStaff._id, newStaff.name);
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /profile', () => {
		let token, payload;

		const exec = () => {
			return request(server).put('/staff/update').set('Authorization', token).send(payload);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if payload is empty', async () => {
			token = generateBearerToken('staff');
			payload = {};
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 404 if staff not found', async () => {
			token = generateBearerToken('staff');
			payload = { email: 'san@gmail.com' };
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if staff found', async () => {
			const newStaff = new Staff(staffData);
			await newStaff.save();

			const email = 'test@gmail.com';

			token = generateBearerToken('staff', newStaff._id, newStaff.name);
			payload = {
				email
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedStaff = await Staff.findOne({ _id: newStaff._id });
			expect(updatedStaff._doc.email).toBe(email);
		});
	});

	describe('GET /student/:id', () => {
		let token, id;

		const exec = () => {
			return request(server).get(`/staff/student/${id}`).set('Authorization', token);
		};

		beforeEach(() => {
			id = 'test';
			token = generateBearerToken('staff');
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

		it('should return 404 if student not found', async () => {
			id = '6098d94aff57742ef8dbd048';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if staff found', async () => {
			const newStudent = new Student({
				...student[0]
			});
			await newStudent.save();

			id = newStudent._id;
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /section/student', () => {
		let token;

		const exec = () => {
			return request(server).get('/staff/section/student').set('Authorization', token);
		};

		beforeEach(() => {
			token = generateBearerToken('staff');
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if staff is not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'Staff does not exist');
		});

		it('should return 200 if staff found', async () => {
			const section = new Section({
				name: 'test'
			});
			await section.save();
			const newStudent = new Student({
				...student[0],
				section: section._id
			});
			await newStudent.save();
			const newStaff = new Staff({ ...staffData, section: section._id });
			await newStaff.save();

			token = generateBearerToken('staff', newStaff._id, newStaff.name);
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
		});
	});

	describe('GET /bonafide/applied', () => {
		let token, newStaff;
		const section = '6098d94aff57742ef8dbd048';

		const exec = () => {
			return request(server).get('/staff/bonafide/applied').set('Authorization', token);
		};

		beforeEach(async () => {
			newStaff = new Staff({ ...staffData, section });
			await newStaff.save();
			token = generateBearerToken('staff', newStaff._id, newStaff.name);
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 with [] data if certificate not found', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data[0]).toBeUndefined();
		});

		it('should return 200 with data if certificate found', async () => {
			const certificate = new Certificate({
				studentID: '6098d94aff56642ef8dbd048',
				sectionID: section
			});
			await certificate.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data[0]).toHaveProperty('status', 'applied');
		});
	});

	describe('GET /bonafide/history', () => {
		let token, newStaff;
		const section = '6098d94aff57742ef8dbd048';

		const exec = () => {
			return request(server).get('/staff/bonafide/history').set('Authorization', token);
		};

		beforeEach(async () => {
			newStaff = new Staff({ ...staffData, section });
			await newStaff.save();
			token = generateBearerToken('staff', newStaff._id, newStaff.name);
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 with [] data if certificate not found', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data[0]).toBeUndefined();
		});

		it('should return 200 with data if certificate found', async () => {
			const certificate = new Certificate({
				studentID: '6098d94aff56642ef8dbd048',
				sectionID: section,
				status: 'rejected'
			});
			await certificate.save();

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data[0]).toHaveProperty('status', 'rejected');
		});
	});

	describe('PUT /bonafide/status', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.put('/staff/bonafide/status')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(async () => {
			token = generateBearerToken('staff');
			payload = {
				bonafideID: '6098d94aff57742ef8dbd048',
				status: 'approved'
			};
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if bonafideID is not passed', async () => {
			delete payload.bonafideID;
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 400 if bonafideID is not valid', async () => {
			payload.bonafideID = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 400 if status is not invalid', async () => {
			payload.status = 'applied';
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 200 with data if certificate updated', async () => {
			const certificate = new Certificate({
				studentID: '6098d94aff56642ef8dbd048',
				sectionID: '6098d94aff57742ef8dbd048'
			});
			await certificate.save();

			payload.bonafideID = certificate._id;
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedCertificate = await Certificate.findById(payload.bonafideID);
			expect(updatedCertificate.status).toBe(payload.status);
		});
	});
});
