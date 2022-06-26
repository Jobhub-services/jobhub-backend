import { Schema } from 'mongoose';
import { Request, Response } from 'express';
import CompanyDivision from '@/models/CompanyDivision';
import { CompanyDto } from '@/dtos/company.dto';
import Company from '@/models/Company';
import { ICompany } from '@/interfaces/company.interface';
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
			await profile.save();
			const profileContent = await this._getProfileById(rootObjectId);

			res.status(200).send({ content: profileContent });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getTalents = async (req: Request, res: Response) => {
		try {
		} catch {}
	};
	getTalentDetails = async (req: Request, res: Response) => {
		try {
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
}
export default CompanyController;
