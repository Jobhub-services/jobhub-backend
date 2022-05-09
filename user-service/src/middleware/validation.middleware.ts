import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, RequestHandler, Response } from 'express';

const formatValidationErrors = (errors: ValidationError[]) => {
	const validations = {};
	const traverseErrors = (errors: ValidationError[]) => {
		errors.forEach((err) => {
			if (err.property && err.constraints) {
				validations[err.property] = Object.values(err.constraints);
			}
			if (err.children && err.children.length > 0) traverseErrors(err.children);
		});
	};
	traverseErrors(errors);
	return validations;
};

const validationMiddleware =
	(rules: any, skipMissingProperties = false): RequestHandler =>
	(req: Request, res: Response, next) => {
		const tranformedBody = plainToInstance(rules, req.body, { excludeExtraneousValues: true });
		validate(tranformedBody, { skipMissingProperties }).then((errors: ValidationError[]) => {
			if (errors && errors.length > 0) {
				const message = formatValidationErrors(errors);
				res.status(406).send(message);
			} else {
				req.body = tranformedBody;
				next();
			}
		});
	};

export default validationMiddleware;
