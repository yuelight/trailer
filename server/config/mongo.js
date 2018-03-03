import mongoose from 'mongoose';
import glob from 'glob';
import { resolve } from 'path';
const modelsPath = resolve(__dirname, '..', 'app', 'models', '*.js');

export default class Db {
	constructor() {
		this.connectTime = 0;
		this.db = 'mongodb://localhost/trailer';
	}

	init() {
		mongoose.Promise = global.Promise;
		if (process.env.NODE_ENV !== 'production') {
			mongoose.set('debug', true);
		}
		this.connect();
		this.model();
	}

	connect() {
		mongoose.connect(this.db);
		this.onConnected();
		this.onDisconnected();
		this.onError();
	}

	onDisconnected() {
		mongoose.connection.on('disconnected', () => {
			this.connect();
		});
	}

	onError() {
		mongoose.connection.on('error', err => {
			this.connectTime++;
			if (this.connectTime < 5)
				this.connect();
			else
				console.error(err);
		});
	}

	onConnected() {
		mongoose.connection.once('open', () => {
			console.log('Database connected!');
		});
	}

	model() {
		glob.sync(modelsPath).forEach(require);
	}
}
