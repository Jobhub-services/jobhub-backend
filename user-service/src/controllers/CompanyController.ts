import { Schema } from 'mongoose';
import { Request, Response } from 'express';
import CompanyDivision from '@/models/CompanyDivision';
import { CompanyDto } from '@/dtos/company.dto';
import Company from '@/models/Company';
import { ICompany } from '@/interfaces/company.interface';
import { UploadedFile } from 'express-fileupload';
import { storageService } from '@/services/StorageService';
import Developer from '@/models/Developer';
import { isValidObjectId } from '@/helpers';
class CompanyController {
	async createDivision(req: Request, res: Response) {
		try {
			const user = req.user;
			const division = await CompanyDivision.create({ name: req.body.name, company_id: user._id });
			res.status(200).send({ content: division });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	async getDivision(req: Request, res: Response) {
		try {
			const user = req.user;
			const divisions = await CompanyDivision.find({ company_id: user._id });
			res.status(200).send({ content: divisions, size: divisions.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	getProfile = async (req: Request, res: Response) => {
		try {
			const profileBody: CompanyDto = req.body;
			const rootObjectId = req.rootObjectId;
			const profile = await Company.findOne({ userId: rootObjectId });
			if (profileBody.description) this._setDescription(profile, profileBody.description);
			if (profileBody.keywords) this._setKeywords(profile, profileBody.keywords);
			if (profileBody.company_division) this._setCompanyDivision(profile, profileBody.company_division);
			if (profileBody.social_profile) this._setSocialProfile(profile, profileBody.social_profile);
			if (profileBody.headquarter) this._setHeadquarter(profile, profileBody.headquarter);
			if (profileBody.generalinfo) this._setGeneralinfo(profile, profileBody.generalinfo);
			await profile.save();
			const profileContent = await this._getProfileById(rootObjectId);

			res.status(200).send({ content: profileContent });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	updateProfile = async (req: Request, res: Response) => {
		try {
			const profileBody: CompanyDto = req.body;
			const rootObjectId = req.rootObjectId;
			const profile = await Company.findOne({ userId: rootObjectId });
			if (profileBody.description) this._setDescription(profile, profileBody.description);
			if (profileBody.keywords) this._setKeywords(profile, profileBody.keywords);
			if (profileBody.company_division) this._setCompanyDivision(profile, profileBody.company_division);
			if (profileBody.social_profile) this._setSocialProfile(profile, profileBody.social_profile);
			if (profileBody.headquarter) this._setHeadquarter(profile, profileBody.headquarter);
			if (profileBody.generalinfo) this._setGeneralinfo(profile, profileBody.generalinfo);
			if (req.files) {
				if (req.files.avatar) await this._updateAvatar(profile, req.files.avatar as UploadedFile);
			}
			await profile.save();
			const profileContent = await this._getProfileById(rootObjectId);

			res.status(200).send({ content: profileContent });
		} catch (e: any) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getTalents = async (req: Request, res: Response) => {
		try {
			const { name = '', limit = 20, page } = req.query;
			const count = await Developer.count();
			const query = Developer.find({}, { summary: 1, userId: 1, status: 1, address: 1, skills: 1, createdAt: 1, updatedAt: 1 })
				.populate({
					path: 'address',
					populate: {
						path: 'country',
						select: 'name',
					},
				})
				.populate({
					path: 'skills',
					select: 'name',
				})
				.populate({
					path: 'role',
					populate: [
						{
							path: 'primary_role',
							select: 'name',
						},
					],
				});
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const talents = await query;
			res.status(200).send({ content: talents, count, size: talents.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch {}
	};
	getTalentDetails = async (req: Request, res: Response) => {
		try {
			const talentId = req.params.talentId;
			if (!talentId || !isValidObjectId(talentId)) return res.status(406).send({ message: 'Talent not found' });
			const query = Developer.findById(talentId)
				.populate({
					path: 'work_experience',
					populate: {
						path: 'location',
						select: 'name',
					},
				})
				.populate({
					path: 'languages',
					populate: {
						path: 'language',
						select: ['name', 'code'],
					},
				})
				.populate({
					path: 'address',
					populate: {
						path: 'country',
						select: 'name',
					},
				})
				.populate({
					path: 'role',
					populate: [
						{
							path: 'other_roles',
							select: 'name',
						},
						{
							path: 'primary_role',
							select: 'name',
						},
					],
				})
				.populate({
					path: 'desired_location',
					select: 'name',
				})
				.populate({
					path: 'skills',
					select: 'name',
				});
			const talent = await query;
			if (!talent) return res.status(406).send({ message: 'Talent not found' });
			res.status(200).send({ content: talent });
		} catch {}
	};
	private _setDescription = (profile: ICompany, description: ICompany['description']) => {
		profile.description = description;
	};
	private _setKeywords = (profile: ICompany, keywords: ICompany['keywords']) => {
		profile.keywords = keywords;
	};
	private _setCompanyDivision = (profile: ICompany, company_division: ICompany['company_division']) => {
		profile.company_division = company_division;
	};
	private _setSocialProfile = (profile: ICompany, social_profile: ICompany['social_profile']) => {
		profile.social_profile = social_profile;
	};
	private _setHeadquarter = (profile: ICompany, headquarter: ICompany['headquarter']) => {
		profile.headquarter = headquarter;
	};
	private _setGeneralinfo = (profile: ICompany, generalinfo: ICompany['generalinfo']) => {
		profile.generalinfo = generalinfo;
	};
	private _getProfileById = async (userId: Schema.Types.ObjectId) => {
		try {
			const query = Company.findOne({ userId }).populate({
				path: 'headquarter',
				populate: {
					path: 'country',
					select: 'name',
				},
			});
			const profile = await query;
			return profile;
		} catch {
			return null;
		}
	};
	private _updateAvatar = async (profile: ICompany, file: UploadedFile) => {
		const avatarPath = await storageService.moveFile(file);
		profile.avatar = avatarPath;
	};
}
export default CompanyController;
