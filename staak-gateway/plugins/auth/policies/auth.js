const { config: dotenvConfig } = require('dotenv');
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });
const jwt = require('jsonwebtoken');
const {
	connect,
	Types: { ObjectId },
} = require('mongoose');

const excludedRoutes = ['/api/users/auth/login', '/api/users/auth/register'];
const excludedRoutePaths = [];

module.exports = {
	name: 'auth',
	policy: (actionParams) => {
		return (req, res, next) => {
			const pathUrl = req.baseUrl + req.path;
			const routePath = req.route.path;
			if (excludedRoutes.indexOf(pathUrl) >= 0 || excludedRoutePaths.indexOf(routePath) >= 0) return next();
			connect(process.env.DB_CONNECT_URL)
				.then(({ connection }) => {
					try {
						let authHeader = req.headers['authorization'];
						authHeader = authHeader?.split(' ');
						if (!authHeader || authHeader[0] !== 'Bearer')
							return res.status(401).send({
								message: 'unauthorized',
							});
						jwt.verify(authHeader[1], process.env.JWT_SECRET, async (err, user) => {
							if (err)
								return res.status(401).send({
									message: 'unauthorized',
								});
							if (!user)
								return res.status(401).send({
									message: 'unauthorized',
								});
							var usersModel = connection.collection('users');
							const user_id = new ObjectId(user.sub);
							user = await usersModel.findOne({ _id: user_id });
							if (!user)
								return res.status(401).send({
									message: 'unauthorized',
								});
							req.headers['user_id'] = user._id;
							req.headers['user'] = JSON.stringify(user);
							return next();
						});
					} catch (e) {
						res.status(403).send('HTTP 403 Forbidden');
					}
				})
				.catch((err) => {
					res.status(403).send('HTTP 403 Forbidden');
				});
		};
	},
};
