import authRoutes from './routes/authorization';
import userRoutes from './routes/user';
import postRoutes from './routes/post';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import IO from './sockets';

dotenv.config();

const app = express();

const domains = 'http://localhost:3000';
const corsOptions = {
	origin: domains ? domains.split(',') : '*',
	exposedHeaders: ['tableau-site-id', 'tableau-user-id', 'voc-user-id'],
};

const start = async () => {
	try {
		if (process.env.MONGO_DB_URL) {
			await mongoose.connect(process.env.MONGO_DB_URL, { autoCreate: true });
			console.info('MongoClient connected!');
		} else {
			console.log('Missing credentials for Mongo DB');
		}
	} catch (err) {
		return console.error('Mongo DB connection error', err);
	}

	app.use(express.json());
	app.use(cors(corsOptions));
	app.use('/static', express.static(path.join(__dirname, '../public')));
	app.use('/api/auth', authRoutes);
	app.use('/api/users', userRoutes);
	app.use('/api/posts', postRoutes);

	const port = process.env.PORT || 4000;
	IO.onConnection();
	app.listen(port, () => console.log(`Listening on port ${port}...`));
};

start();
