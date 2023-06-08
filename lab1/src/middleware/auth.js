import jwt from 'jsonwebtoken';

export const authorizationMiddleware = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(401).json({ error: 'Authorization error' });
		}
		const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (!payload.id) {
			return res.status(401).json({ error: 'Authorization error' });
		}
		req.authUser = { id: payload.id };
		next();
	} catch (error) {
		res.status(401).json({ error: 'Authorization error' });
	}
	return;
};
