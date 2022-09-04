import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { CompanyDto } from '@/dtos/company.dto';
import Company from '@/models/Company';
import { ICompany } from '@/interfaces/company.interface';
import { UploadedFile } from 'express-fileupload';
import Developer, { populateDevelopersToJson, populateDeveloperToJson } from '@/models/Developer';
import { isValidObjectId } from '@/helpers';
import { metadataService } from '@/services/MetadataService';
import messagingService from '@/services/MessagingService';
import User from '@/models/User';

class CompanyController {
	getDivision = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const company = await this._getProfileById(rootObjectId);
			const company_division = company.company_division;
			res.status(200).send({ content: company_division, size: company_division.length });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getProfile = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const profileContent = await this._getProfileById(rootObjectId);
			res.status(200).send({ content: profileContent });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateAccountSettings = async (req: Request, res: Response) => {
		try {
			const profileBody: any = req.body;
			const rootObjectId = req.rootObjectId;
			const companyInfo: any = {};
			const userInfo: any = {};
			if (profileBody.companyName) companyInfo.companyName = profileBody.companyName;
			if (profileBody.owner_first_name) companyInfo.owner_first_name = profileBody.owner_first_name;
			if (profileBody.owner_last_name) companyInfo.owner_last_name = profileBody.owner_last_name;

			if (profileBody.email) userInfo.email = profileBody.email;
			if (profileBody.username) userInfo.username = profileBody.username;
			if (profileBody.phone) userInfo.phone = profileBody.phone;

			if (Object.keys(companyInfo).length > 0) await Company.updateOne({ userId: rootObjectId }, companyInfo);
			if (Object.keys(userInfo).length > 0) await User.updateOne({ _id: rootObjectId }, userInfo);

			res.status(200).send({ message: 'informations updated' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	updateProfile = async (req: Request, res: Response) => {
		try {
			const profileBody: CompanyDto = req.body;
			const rootObjectId = req.rootObjectId;
			const profile: any = {};
			if (profileBody.description) this._setDescription(profile, profileBody.description);
			if (profileBody.keywords) this._setKeywords(profile, profileBody.keywords);
			if (profileBody.company_division) await this._setCompanyDivision(profile, profileBody.company_division);
			if (profileBody.social_profile) this._setSocialProfile(profile, profileBody.social_profile);
			if (profileBody.headquarter) await this._setHeadquarter(profile, profileBody.headquarter);
			if (profileBody.generalinfo) this._setGeneralinfo(profile, profileBody.generalinfo);
			//if (profileBody.currency)await  this._setCurrency(profile, profileBody.currency);
			if (profileBody.timezone) await this._setTimezone(profile, profileBody.timezone);
			if (req.files) {
				if (req.files.avatar) await this._updateAvatar(profile, req.files.avatar as UploadedFile);
			}
			await Company.updateOne({ userId: rootObjectId }, profile);
			const profileContent = await this._getProfileById(rootObjectId);
			res.status(200).send({ content: profileContent });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getTalents = async (req: Request, res: Response) => {
		try {
			const { name = '', limit = 20, page } = req.query;
			const talentQuery = this._buildTalentQuery(req);
			const count = await Developer.count(talentQuery);
			const query = Developer.find(talentQuery);
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			query.projection({
				summary: 1,
				userId: 1,
				status: 1,
				address: 1,
				social_profile: 1,
				createdAt: 1,
				updatedAt: 1,
				avatar: 1,
				firstName: 1,
				lastName: 1,
				role: 1,
			});
			const talents = await query;
			const talnetsList = populateDevelopersToJson(talents);
			res.status(200).send({ content: talnetsList, count, size: talents.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getTalentDetails = async (req: Request, res: Response) => {
		try {
			const talentId = req.params.talentId;
			if (!talentId || !isValidObjectId(talentId)) return res.status(406).send({ message: 'Talent not found' });
			const query = Developer.findById(talentId);
			const talent = await query;
			if (!talent) return res.status(406).send({ message: 'Talent not found' });
			const talnetList = populateDeveloperToJson(talent);
			res.status(200).send({ content: talnetList });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
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

	private _setCurrency = async (profile: ICompany, currency: CompanyDto['currency']) => {
		profile.currency = await metadataService.getCurrency(currency);
	};

	private _setTimezone = async (profile: ICompany, timezone: CompanyDto['timezone']) => {
		profile.timezone = await metadataService.getTimezone(timezone);
	};

	private _updateAvatar = async (profile: ICompany, file: UploadedFile) => {
		const avatarPath = await messagingService.uploadUserMedia(profile.userId, file);
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
	private _buildTalentQuery(req: Request) {
		let tmp: any = {};
		let { skills, country, roles, experienceYear, status, jobType } = req.query;

		if (skills && !Array.isArray(skills)) skills = [skills as string];
		if (skills?.length! > 0) tmp = { 'skills._id': { $in: skills }, ...tmp };

		if (jobType && !Array.isArray(jobType)) jobType = [jobType as string];
		if (jobType?.length! > 0) tmp = { $or: [{ job_type: { $in: jobType } }, { other_job_type: { $in: jobType } }], ...tmp };

		if (roles && !Array.isArray(roles)) roles = [roles as string];
		if (roles?.length > 0) tmp = { 'role.primary_role._id': { $in: (roles as string[]).map((elem) => new Types.ObjectId(elem)) }, ...tmp };

		if (country && !Array.isArray(country)) country = [country as string];
		if (country?.length > 0) tmp = { 'address.country._id': { $in: (country as string[]).map((elem) => new Types.ObjectId(elem)) }, ...tmp };

		if (status && !Array.isArray(status)) status = [status as string];
		if (status?.length > 0) tmp = { status: { $in: status }, ...tmp };

		if (experienceYear && !Array.isArray(experienceYear)) experienceYear = [experienceYear as string];
		if (experienceYear?.length! > 0) tmp = { 'role.experience': { $in: experienceYear }, ...tmp };

		return tmp;
	}
}
export default CompanyController;
