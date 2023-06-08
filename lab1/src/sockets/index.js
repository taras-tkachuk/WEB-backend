import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const MessagesSend = {
	NewPost: 'newPostCreated',
	Error: 'error',
	OnlineChanged: 'onlineUserChanged',
};

const MessagesSubscribe = {
	Connection: 'connection',
	Disconnect: 'disconnect',
	RequestUsers: 'requestUsers',
};

class IServer extends Server {
	#usersOnline = new Set();

	addUser(id) {
		this.#usersOnline.add(id);
		this.notifyUsersOnlineChanged();
	}

	removeUser(id) {
		this.#usersOnline.delete(id);
		this.notifyUsersOnlineChanged();
	}

	get usersOnline() {
		return this.#usersOnline.size;
	}

	notifyOnNewPost(post) {
		this.emit(MessagesSend.NewPost, post);
	}

	notifyUsersOnlineChanged() {
		this.emit(MessagesSend.OnlineChanged, this.usersOnline);
	}

	onRequestOnline(socketId) {
		this.to(`socket#${socketId}`).emit(MessagesSend.OnlineChanged, this.usersOnline);
	}

	#onFirstConnect(socket) {
		const token = socket.request.headers.authorization;
		if (!token) {
			socket.emit(MessagesSend.Error, 'No authorization token were provided!');
			socket.disconnect();
			return;
		}
		const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (!payload.id) {
			socket.emit(MessagesSend.Error, 'Not valid authorization token!');
			socket.disconnect();
			return;
		}
		this.addUser(payload.id);
		socket.on(MessagesSubscribe.Disconnect, () => {
			console.log('disconnect userId: ', payload.id);
			this.removeUser(payload.id);
		});
		console.log('New Connection: ', socket.id, ', userId: ', payload.id);
		return;
	}

	onConnection() {
		this.on(MessagesSubscribe.RequestUsers, this.onRequestOnline.bind(this));
		return this.on(MessagesSubscribe.Connection, this.#onFirstConnect.bind(this));
	}
}

const IO = new IServer(+(process.env.PORT || 4000) + 1, { cors: { origin: '*' } });

export default IO;
