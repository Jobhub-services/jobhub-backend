import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { CompanyDto } from '@/dtos/company.dto';
import Company from '@/models/Company';
import { ICompany } from '@/interfaces/company.interface';
import { UploadedFile } from 'express-fileupload';
import { storageService } from '@/services/StorageService';
import Developer from '@/models/Developer';
import { isValidObjectId } from '@/helpers';
import { metadataService } from '@/services/MetadataService';
class CompanyController {
	getDivision = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const company = await this._getProfileById(rootObjectId);
			const company_division = company.company_division;
			res.status(200).send({ content: company_division, size: company_division.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getProfile = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
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
			if (profileBody.company_division) await this._setCompanyDivision(profile, profileBody.company_division);
			if (profileBody.social_profile) this._setSocialProfile(profile, profileBody.social_profile);
			if (profileBody.headquarter) await this._setHeadquarter(profile, profileBody.headquarter);
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
			const query = Developer.find({}, { summary: 1, userId: 1, status: 1, address: 1, skills: 1, createdAt: 1, updatedAt: 1, avatar: 1 });
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
			const query = Developer.findById(talentId);
			const talent = await query;
			if (!talent) return res.status(406).send({ message: 'Talent not found' });
			res.status(200).send({ content: talent });
		} catch {}
	};

	/**** function for update company */
	private _setDescription = (profile: ICompany, description: CompanyDto['description']) => {
		profile.description = description;
	};

	private _setKeywords = (profile: ICompany, keywords: CompanyDto['keywords']) => {
		profile.keywords = keywords;
	};

	private _setCompanyDivision = async (profile: ICompany, company_division: CompanyDto['company_division']) => {
		const divisions: ICompany['company_division'] = [];
		company_division.forEach((division) => {
			divisions.push({ name: division });
		});
		profile.company_division = divisions;
	};

	private _setSocialProfile = (profile: ICompany, social_profile: CompanyDto['social_profile']) => {
		profile.social_profile = social_profile;
	};

	private _setHeadquarter = async (profile: ICompany, headquarter: CompanyDto['headquarter']) => {
		profile.headquarter = { ...headquarter, country: await metadataService.getCountry(headquarter.country) };
	};

	private _setGeneralinfo = (profile: ICompany, generalinfo: CompanyDto['generalinfo']) => {
		profile.generalinfo = generalinfo;
	};

	private _updateAvatar = async (profile: ICompany, file: UploadedFile) => {
		const avatarPath = await storageService.moveFile(file);
		profile.avatar = avatarPath;
	};

	private _getProfileById = async (userId: Types.ObjectId) => {
		try {
			const query = Company.findOne({ userId });
			const profile = await query;

			return profile;
		} catch {
			return null;
		}
	};
}
export default CompanyController;
