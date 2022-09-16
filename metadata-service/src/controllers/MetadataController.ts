import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Currency from '@/models/Currency';
import JobCategory from '@/models/JobCategory';
import Country from '@/models/Country';
import Language from '@/models/Language';
import JobRole from '@/models/JobRole';
import Timezone from '@/models/Timezone';
import { ITimezone } from '@/interfaces/timezone.interface';

class MetadataController {
	// countries
	public async initCountries(req: Request, res: Response) {
		try {
			const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'country.json'));
			const countries: { name: string; code: string; dialCode: string; flag: string }[] = JSON.parse(jsonFile.toString());
			const country = await Country.findOne();
			if (!country) await Country.insertMany(countries);
			res.status(200).send({ message: 'Countries added' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	public async getCountries(req: Request, res: Response) {
		try {
			const { name = '', limit, page } = req.query;
			const query = Country.find({ name: { $regex: name, $options: 'i' } });
			const count = await Country.count();
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const countries = await query;
			res.status(200).send({ content: countries, count, size: countries.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	/// currencies
	public async initCurrencies(req: Request, res: Response) {
		try {
			const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'currencies.json'));
			const currencies: { [code: string]: string } = JSON.parse(jsonFile.toString());
			const dbCurrencies: { name: string; code: string }[] = [];
			for (const code in currencies) {
				dbCurrencies.push({ name: currencies[code], code });
			}
			const currency = await Currency.findOne();
			if (!currency) await Currency.insertMany(dbCurrencies);
			res.status(200).send({ message: 'Currencies added' });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	public async getCurrencies(req: Request, res: Response) {
		try {
			const { name = '', limit, page } = req.query;
			const query = Currency.find({ name: { $regex: name, $options: 'i' } });
			const count = await Currency.count();
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const currencies = await query;
			res.status(200).send({ content: currencies, count, size: currencies.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	// countries
	public async initCategories(req: Request, res: Response) {
		try {
			const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'categories.json'));
			const categories: any[] = JSON.parse(jsonFile.toString());
			const category = await JobCategory.findOne();
			if (!category)
				await JobCategory.insertMany(
					categories.map((category) => {
						return {
							name: category.label,
						};
					})
				);
			res.status(200).send({ message: 'Categories added' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	public async getCategories(req: Request, res: Response) {
		try {
			const { name = '', limit, page } = req.query;
			const query = JobCategory.find({ name: { $regex: name, $options: 'i' } });
			const count = await JobCategory.count();
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const categories = await query;
			res.status(200).send({ content: categories, count, size: categories.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	// languages
	public async initLanguages(req: Request, res: Response) {
		try {
			const language = await Language.findOne();
			if (!language) {
				const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'languages.json'));
				const languages: any[] = JSON.parse(jsonFile.toString());
				const dbLanguages: { name: string; code: string }[] = [];
				for (const code in languages) {
					dbLanguages.push({ name: languages[code], code });
				}
				await Language.insertMany(dbLanguages);
			}
			res.status(200).send({ message: 'Languages added' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	public async getLanguages(req: Request, res: Response) {
		try {
			const { name = '', limit, page } = req.query;
			const query = Language.find({ name: { $regex: name, $options: 'i' } });
			const count = await Language.count();
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const languages = await query;
			res.status(200).send({ content: languages, count, size: languages.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	// languages
	public async initJobRoles(req: Request, res: Response) {
		try {
			const jobRoles = await JobRole.findOne();
			if (!jobRoles) {
				const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'roles.json'));
				const roles: string[] = JSON.parse(jsonFile.toString()).data;
				const dbRoles: { name: string }[] = [];
				for (const role of roles) {
					dbRoles.push({ name: role });
				}
				await JobRole.insertMany(dbRoles);
			}
			res.status(200).send({ message: 'JobRoles added' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	public async getJobRoles(req: Request, res: Response) {
		try {
			const { name = '', limit, page } = req.query;
			const query = JobRole.find({ name: { $regex: name, $options: 'i' } });
			const count = await JobRole.count();
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const jobRoles = await query;
			res.status(200).send({ content: jobRoles, count, size: jobRoles.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}

	// timezones
	public async initTimezones(req: Request, res: Response) {
		try {
			const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'timezones.json'));
			const timezones: { label: string; tzCode: string; name: String; utc: String }[] = JSON.parse(jsonFile.toString());
			const timezone = await Timezone.findOne();
			if (!timezone) {
				const data: ITimezone[] = timezones.map((_) => {
					return {
						code: _.tzCode,
						name: _.label,
						utc: _.utc,
					};
				});
				await Timezone.insertMany(data);
			}
			res.status(200).send({ message: 'Timezones added' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	public async getTimezones(req: Request, res: Response) {
		try {
			const { code = '', name = '', limit, page } = req.query;
			const query = Timezone.find({ code: { $regex: code, $options: 'i' }, name: { $regex: name, $options: 'i' } });
			const count = await Timezone.count();
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const timezones = await query;
			res.status(200).send({ content: timezones, count, size: timezones.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
}
export default MetadataController;
