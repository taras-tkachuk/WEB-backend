export default class PostController {
	static likePost(post, user) {
		post.likes += 1;
		if (user.likedPosts.includes(post.id)) {
			return { error: 'Already liked!' };
		}

		user.likedPosts.push(post.id);
		const disInd = user.dislikedPosts.findIndex((id) => post.id === id.toString());
		if (disInd > -1) {
			user.dislikedPosts.splice(disInd, 1);
			post.dislikes -= 1;
		}
		return { error: '' };
	}

	static dislikePost(post, user) {
		if (user.dislikedPosts.includes(post.id)) {
			return { error: 'Already disliked!' };
		}
		user.dislikedPosts.push(post.id);
		post.dislikes += 1;
		const likeInd = user.likedPosts.findIndex((id) => post.id === id.toString());
		if (likeInd > -1) {
			user.likedPosts.splice(likeInd, 1);
			post.likes -= 1;
		}
		return { error: '' };
	}
}
