import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Mixed, ObjectId } = Schema.Types;

const movieSchema = new Schema({
	doubanId: {
		unique: true,
		type: String
	},
	category: [
		{
			type: ObjectId,
			ref: 'Category'
		}
	],
	rate: Number,
	title: String,
	summary: String,
	video: String,
	poster: String,
	cover: String,
	videoKey: String,
	posterKey: String,
	coverKey: String,
	rawTitle: String,
	movieTypes: [String],
	pubdate: Mixed,
	year: Number,
	tags: [String],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	},
	del: {
		type: Boolean,
		default: false
	}
});

movieSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

mongoose.model('Movie', movieSchema);
