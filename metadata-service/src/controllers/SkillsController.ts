import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Skill from '@/models/Skill';
class SkillsController {
	async initSkills(req: Request, res: Response) {
		try {
			const jsonFile = await fs.readFileSync(path.join(__dirname, '..', '..', 'json_data', 'skills.json'));
			const skills: any[] = JSON.parse(jsonFile.toString());
			const skill = await Skill.findOne();
			if (!skill)
				await Skill.insertMany(
					skills.map((skill) => {
						return { name: skill.keyName };
					})
				);
			res.status(200).send({ message: 'Skills added' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	async getSkills(req: Request, res: Response) {
		try {
			const { name = '', limit, page } = req.query;
			const count = await Skill.count();
			const query = Skill.aggregate([
				{ $match: { name: { $regex: name, $options: 'i' } } },
				{ $addFields: { score: { $indexOfCP: [{ $toLower: '$name' }, { $toLower: name }] } } },
				{ $sort: { score: 1 } },
			]);

			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const skills = await query;
			res.status(200).send({ content: skills, count, size: skills.length });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
}
export default SkillsController;
