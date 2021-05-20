const data = [
	{
		name: 'Saran M',
		registerNumber: 810018104083,
		dateOfBirth: '2000-11-18',
		email: 'saran18112000@gmail.com',
		phoneNumber: '9715450057',
		gender: 'male',
		profileImg:
			'https://firebasestorage.googleapis.com/v0/b/bonafide-generator.appspot.com/o/CSE-B%2F4083%20-%20Saran.jpg?alt=media&token=62b2db0b-47df-4899-a5e0-71abcd4c0c47'
	},
	{
		name: 'Santhosh Kumar G',
		registerNumber: 810018104082,
		dateOfBirth: '2001-02-21',
		email: 'santhoshgovind007@gmail.com',
		phoneNumber: '8220246038',
		gender: 'male',
		profileImg:
			'https://firebasestorage.googleapis.com/v0/b/bonafide-generator.appspot.com/o/CSE-B%2F4082%20-%20Santhosh%20Kumar.jpg?alt=media&token=bcb6e583-b408-4fbd-81c6-c044505c33a4'
	},
	{
		name: 'Nivas Praveen C',
		registerNumber: 810018104059,
		dateOfBirth: '2001-05-07',
		email: 'nivaspraveen07@gmail.com',
		phoneNumber: '9840501642',
		gender: 'male',
		profileImg:
			'https://firebasestorage.googleapis.com/v0/b/bonafide-generator.appspot.com/o/CSE-B%2F4059%20-%20Nivas%20Praveen.jpg?alt=media&token=0f9c8647-8c2f-43d1-a71c-c9308eec48f3'
	},
	{
		name: 'Praveen R',
		registerNumber: 810018104064,
		dateOfBirth: '2001-06-16',
		email: 'praveensumathi16@gmail.com',
		phoneNumber: '9789623026',
		gender: 'male',
		profileImg:
			'https://firebasestorage.googleapis.com/v0/b/bonafide-generator.appspot.com/o/CSE-B%2F4064%20-%20Praveen%20R.jpg?alt=media&token=37a8c06e-4ca9-4329-acd6-a9f46c2fe0c9'
	},
	{
		name: 'Praveen Kumar S',
		registerNumber: 810018104065,
		dateOfBirth: '2001-07-10',
		email: 'praveencse284@gmail.com',
		phoneNumber: '9629340745',
		gender: 'male',
		profileImg:
			'https://firebasestorage.googleapis.com/v0/b/bonafide-generator.appspot.com/o/CSE-B%2F4065%20-%20Praveen%20Kumar.jpg?alt=media&token=139b7b0b-3ba5-41fc-bbd8-561714e13e39'
	},
	{
		name: 'VijayBharathi S R',
		registerNumber: 810018104107,
		dateOfBirth: '2001-06-04',
		email: 'vijaybharathi483@gmail.com',
		phoneNumber: '9443499570',
		gender: 'male',
		profileImg:
			'https://firebasestorage.googleapis.com/v0/b/bonafide-generator.appspot.com/o/CSE-B%2F4107%20-%20Vijaybharathi.jpg?alt=media&token=7f5c5863-8984-4eac-8aba-9310932d1ad5'
	}
];

export default data.map(val => ({
	degree: 'B.E',
	department: 'CSE',
	batch: '2018 - 2022',
	campus: 'BIT',
	section: '6097e8de257767373c0b3b33',
	gender: 'male',
	...val
}));
