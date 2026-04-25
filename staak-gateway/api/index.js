'use strict';

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));

const SERVICES = {
	users:         process.env.USERS_SERVICE_URL,
	jobs:          process.env.JOBS_SERVICE_URL,
	metadata:      process.env.METADATA_SERVICE_URL,
	payments:      process.env.PAYMENTS_SERVICE_URL,
	notifications: process.env.NOTIFICATIONS_SERVICE_URL,
	storage:       process.env.STORAGE_SERVICE_URL,
};

function authMiddleware(excludedRoutes = []) {
	return (req, res, next) => {
		const isExcluded = excludedRoutes.some(
			(route) => req.path === route || req.path.startsWith(route + '/'),
		);
		if (isExcluded) return next();

		const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
		if (!token) return res.status(401).json({ message: 'Unauthorized' });

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.headers['user']    = JSON.stringify(decoded);
			req.headers['user_id'] = decoded._id || decoded.id || '';
			next();
		} catch {
			return res.status(401).json({ message: 'Invalid token' });
		}
	};
}

function proxy(target) {
	return createProxyMiddleware({ target, changeOrigin: true, secure: true });
}

// CDN / storage — no auth
app.use('/cdn', proxy(SERVICES.storage));

// Notifications
app.use(
	'/api/notifications',
	authMiddleware([
		'/api/notifications/newsletter/subscribe',
		'/api/notifications/contact-us',
		'/api/notifications/preview/reset-password',
		'/api/notifications/preview/job-alerts',
	]),
	proxy(SERVICES.notifications),
);

// Users
app.use(
	'/api/users',
	authMiddleware([
		'/api/users/auth/login',
		'/api/users/auth/register',
		'/api/users/auth/forget-password',
		'/api/users/auth/reset-password',
		'/api/users/super-user/create',
	]),
	proxy(SERVICES.users),
);

// Jobs
app.use('/api/jobs', authMiddleware(['/api/jobs/public']), proxy(SERVICES.jobs));

// Metadata
app.use('/api/metadata', authMiddleware(['/api/metadata/countries']), proxy(SERVICES.metadata));

// Payments
app.use(
	'/api/payments',
	authMiddleware(['/api/payments/customers/customer']),
	proxy(SERVICES.payments),
);

module.exports = app;
