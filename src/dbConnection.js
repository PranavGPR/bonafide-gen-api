import mongoose from 'mongoose';

export const dbConnection = () => {
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	};

	mongoose.connect('http://localhost/bonafide-gen', options);
};
