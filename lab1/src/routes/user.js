import { Router } from 'express';
import User from '../models/user';
import { authorizationMiddleware } from '../middleware/auth';
const router = Router();

router.use(authorizationMiddleware);
router.get('/me', async (req, res) => {
	try {
		const user = await User.findById(req.authUser.id);
		if (!user) {
			return res.status(404).json({ error: `Can't get user information` });
		}
		res.json({ user });
	} catch {
		res.status(400).json({ error: `Can't get user information` });
	}
	return;
});

export default router;
