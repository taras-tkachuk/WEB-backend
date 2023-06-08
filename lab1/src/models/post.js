import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

const Post = mongoose.model(
	'Post',
	new mongoose.Schema(
		{
			title: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50,
			},
			body: {
				type: String,
				required: true,
				minlength: 1,
				maxlength: 255,
			},
			owner: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			likes: {
				type: Number,
				default: 0,
			},
			dislikes: {
				type: Number,
				default: 0,
			},
		},
		{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
	),
);

function validatePost(post) {
	const schema = Joi.object({
		title: Joi.string().min(5).max(50).required(),
		body: Joi.string().min(1).max(255).required(),
	});
	return schema.validate(post);
}
export { validatePost };
export default Post;
