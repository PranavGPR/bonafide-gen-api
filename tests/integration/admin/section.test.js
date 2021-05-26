import request from 'supertest';

import { Staff, Section, Student } from 'models';
import { generateBearerToken } from '../function';
import staff from '../constants/staff';
import student from '../constants/student';

let server;

describe('/admin/section/', () => {
	const sectionData = {
		name: test
	};
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(async () => {
		await Section.deleteMany({});
		await Staff.deleteMany({});
		await Student.deleteMany({});

		await server.close();
	});

	describe('GET /all', () => {
		let token;

		const exec = () => {
			return request(server).get('/admin/section/all').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 if section found', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			token = generateBearerToken('admin');
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
		});
	});

	describe('GET /:id', () => {
		let token, id;

		const exec = () => {
			return request(server).get(`/admin/section/${id}`).set('Authorization', token);
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

		it('should return 404 if section not found', async () => {
			id = '6098d94aff57742ef8dbd048';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if section found', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('POST /new', () => {
		let token;
		let payload;

		const exec = () => {
			return request(server).post('/admin/section/new').set('Authorization', token).send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				name: 'test'
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

		it('should return 200 if section created', async () => {
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.find({});
			expect(updatedSection).toHaveLength(1);
		});
	});

	describe('PUT /update/name', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.put('/admin/section/update/name')
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

		it('should return 400 if name not passed', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"name" is required');
		});

		it('should return 404 if section not found', async () => {
			payload.name = 'test2';
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if section name updated', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			const name = 'test2';

			payload = {
				id: newSection._id,
				name
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.findOne({ _id: newSection._id });
			expect(updatedSection.name).toBe(name);
		});
	});

	describe('DELETE /delete', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.delete('/admin/section/delete')
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

		it('should return 404 if section not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if section found and deleted', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			payload = {
				id: newSection._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.findOne({ _id: newSection._id });
			expect(updatedSection).toBeNull();
		});
	});

	describe('PUT /update/staff', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.put('/admin/section/update/staff')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '6098d94aff57742ef8dbd048',
				staffId: '6098d94aff57742ef8dbd056'
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

		it('should return 400 if staffId not passed', async () => {
			delete payload.staffId;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"staffId" is required');
		});

		it('should return 400 if staffId is not valid', async () => {
			payload.staffId = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"staffId" must be valid');
		});

		it('should return 404 if section not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 404 if staff not found', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			payload.id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 400 if staff not available', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			const newStaff = new Staff({
				...staff[0],
				section: newSection._id
			});
			await newStaff.save();

			payload = {
				id: newSection._id,
				staffId: newStaff._id
			};
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 200 if section updated', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			const newStaff = new Staff({
				...staff[0]
			});
			await newStaff.save();

			payload = {
				id: newSection._id,
				staffId: newStaff._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.findOne({ _id: newSection._id });
			expect(updatedSection.staffs).toHaveLength(1);
		});
	});

	describe('PUT /update/student', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.put('/admin/section/update/student')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '6098d94aff57742ef8dbd048',
				studentId: '6098d94aff57742ef8dbd056'
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

		it('should return 400 if studentId not passed', async () => {
			delete payload.studentId;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"studentId" is required');
		});

		it('should return 400 if studentId is not valid', async () => {
			payload.studentId = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"studentId" must be valid');
		});

		it('should return 404 if section not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 400 if section had no staffs', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			payload.id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Section should contains atLeast one staff');
		});

		it('should return 404 if student not found', async () => {
			const newSection = new Section({
				...sectionData,
				staffs: ['6098d94aff57742ef8dbd048']
			});
			await newSection.save();

			payload.id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 400 if student not available', async () => {
			const newSection = new Section({
				...sectionData,
				staffs: ['6098d94aff57742ef8dbd048']
			});
			await newSection.save();

			const newStudent = new Student({
				...student[0],
				section: newSection._id
			});
			await newStudent.save();

			payload = {
				id: newSection._id,
				studentId: newStudent._id
			};
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 200 if section updated', async () => {
			const newSection = new Section({
				...sectionData,
				staffs: ['6098d94aff57742ef8dbd048']
			});
			await newSection.save();

			const newStudent = new Student({
				...student[0],
				section: null
			});
			await newStudent.save();

			payload = {
				id: newSection._id,
				studentId: newStudent._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Section.findOne({ _id: newSection._id });
			expect(updatedSection.students).toHaveLength(1);
		});
	});

	describe('DELETE /update/staff', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.delete('/admin/section/update/staff')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '6098d94aff57742ef8dbd048',
				staffId: '6098d94aff57742ef8dbd056'
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

		it('should return 400 if staffId not passed', async () => {
			delete payload.staffId;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"staffId" is required');
		});

		it('should return 400 if staffId is not valid', async () => {
			payload.staffId = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"staffId" must be valid');
		});

		it('should return 404 if section not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 400 if section has only one staff', async () => {
			const newSection = new Section({
				...sectionData,
				staffs: ['6098d94aff57742ef8dbd048'],
				students: ['6098d94aff57742ef8dbd056']
			});
			await newSection.save();

			payload.id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 404 if staff not found', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			payload.id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if section updated', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			const newStaff = new Staff({
				...staff[0],
				section: newSection._id
			});
			await newStaff.save();

			payload = {
				id: newSection._id,
				staffId: newStaff._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Staff.findOne({ _id: newStaff._id });
			expect(updatedSection.section).toBeNull();
		});
	});

	describe('DELETE /update/student', () => {
		let token, payload;

		const exec = () => {
			return request(server)
				.delete('/admin/section/update/student')
				.set('Authorization', token)
				.send(payload);
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				id: '6098d94aff57742ef8dbd048',
				studentId: '6098d94aff57742ef8dbd056'
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

		it('should return 400 if studentId not passed', async () => {
			delete payload.studentId;
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"studentId" is required');
		});

		it('should return 400 if studentId is not valid', async () => {
			payload.studentId = 'test';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', '"studentId" must be valid');
		});

		it('should return 404 if section not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 404 if student not found', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			payload.id = newSection._id;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if section updated', async () => {
			const newSection = new Section(sectionData);
			await newSection.save();

			const newStudent = new Student({
				...student[0],
				section: newSection._id
			});
			await newStudent.save();

			payload = {
				id: newSection._id,
				studentId: newStudent._id
			};
			const res = await exec();

			expect(res.status).toBe(200);

			const updatedSection = await Student.findOne({ _id: newStudent._id });
			expect(updatedSection.section).toBeNull();
		});
	});
});
