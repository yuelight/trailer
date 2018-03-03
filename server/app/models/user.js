import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const userSchema = new Schema({
	username: {
		unique: true,
		required: true,
		type: String
	},
	email: {
		unique: true,
		required: true,
		type: String
	},
	password: {
		unique: true,
		type: String
	},
	loginAttepts: {
		type: Number,
		required: true,
		default: 0
	},
	lockUntil: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

userSchema.virtual('isLocked').get(function () {
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password'))
		return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err)
			return next(err);
		bcrypt.hash(this.password, salt, (error, hash) => {
			if (error)
				return next(error);
			this.password = hash;
			next();
		});
	});
});

userSchema.methods = {
	comparePassword: (_password, password) => {
		return new Promise((resolve, reject) => {
			bcrypt.compare(_password, password, (err, isMatch) => {
				if (err)
					reject(err);
				resolve(isMatch);
			});
		});
	},
	incLoginAttepts: (user) => {
		return new Promise((resolve, reject) => {
			if (this.lockUntil && this.lockUntil < Date.now()) {
				this.update({
					$set: {
						loginAttepts: 1
					},
					$unset: {
						lockUntil: 1
					}
				}, err => {
					if (err)
						reject(err);
					resolve(true);
				});
			} else {
				let updates = {
					$inc: {
						loginAttepts: 1
					}
				};

				if (this.loginAttepts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
					updates.$set = {
						lockUntil: Date.now() + LOCK_TIME
					};

					this.update(updates, err => {
						if (err)
							reject(err);
						resolve(true);
					});
				}
			}
		});
	}
};

mongoose.model('User', userSchema);