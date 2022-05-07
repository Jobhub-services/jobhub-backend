import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Currency from '@/models/Currency';
import JobCategory from '@/models/JobCategory';
import Country from '@/models/Country';

class MetadataController {
	// countries
	public async initCountries(req: Request, res: Response) {
		try {
			const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'country.json'));
			const countries: { name: string; code: string }[] = JSON.parse(jsonFile.toString());
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
}
export default MetadataController;
