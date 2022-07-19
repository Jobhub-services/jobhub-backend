import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Developer from '@/models/Developer';
import { IDeveloper } from '@/interfaces/developer.interface';
import { DeveloperDto } from '@/dtos/developer.dto';
import { UploadedFile } from 'express-fileupload';
import { storageService } from '@/services/StorageService';
import { metadataService } from '@/services/MetadataService';
class DeveloperController {
	updateProfile = async (req: Request, res: Response) => {
		try {
			const profileBody: DeveloperDto = req.body;
			const rootObjectId = req.rootObjectId;
			const profile = await Developer.findOne({ userId: rootObjectId });
			if (profileBody.summary) this._setSummary(profile, profileBody.summary);
			if (profileBody.languages) await this._setLanguages(profile, profileBody.languages);
			if (profileBody.skills) await this._setSkills(profile, profileBody.skills);
			if (profileBody.role) await this._setRole(profile, profileBody.role);
			if (profileBody.work_experience) await this._setExperiences(profile, profileBody.work_experience);
			if (profileBody.educations) this._setEducations(profile, profileBody.educations);
			if (profileBody.certifications) this._setCertifications(profile, profileBody.certifications);
			if (profileBody.social_profile) this._setSocialProfile(profile, profileBody.social_profile);
			if (profileBody.status) this._setStatus(profile, profileBody.status);
			if (profileBody.address) await this._setAddress(profile, profileBody.address);
			if (profileBody.currency) await this._setCurrency(profile, profileBody.currency);
			if (profileBody.desired_location) await this._setDesiredLocation(profile, profileBody.desired_location);
			if (profileBody.salary) this._setSalary(profile, profileBody.salary);
			if (profileBody.job_type) this._setJobType(profile, profileBody.job_type);
			if (profileBody.other_job_type) this._setOtherJobType(profile, profileBody.other_job_type);
			if (profileBody.wants) this._setWants(profile, profileBody.wants);
			if (req.files) {
				if (req.files.avatar) await this._updateAvatar(profile, req.files.avatar as UploadedFile);
				if (req.files.resume) await this._updateResume(profile, req.files.resume as UploadedFile);
			}

			await profile.save();
			const profileContent = await this._getProfileById(rootObjectId);
			res.status(200).send({ content: profileContent });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getProfile = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const profile = await this._getProfileById(rootObjectId);
			res.status(200).send({ content: profile });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _getProfileById = async (userId: Types.ObjectId) => {
		try {
			const query = Developer.findOne({ userId });
			const profile = await query;
			return profile;
		} catch (e: any) {
			console.log(e);
			return null;
		}
	};

	/*** Update developer properties stage */
	private _setSummary = (profile: IDeveloper, summary: DeveloperDto['summary']) => {
		profile.summary = summary;
	};

	private _setLanguages = async (profile: IDeveloper, languages: DeveloperDto['languages']) => {
		const langsToAssign: IDeveloper['languages'] = [];
		for (const lang of languages) {
			const langItem = await metadataService.getLanguage(lang.language);
			if (langItem)
				langsToAssign.push({
					level: lang.level,
					language: langItem,
				});
		}
		profile.languages = langsToAssign;
	};

	private _setSkills = async (profile: IDeveloper, skills: DeveloperDto['skills']) => {
		profile.skills = await metadataService.getSkills(skills);
	};

	private _setRole = async (profile: IDeveloper, role: DeveloperDto['role']) => {
		const developerRole: IDeveloper['role'] = {};
		if (role.primary_role) developerRole.primary_role = await metadataService.getJobRole(role.primary_role);
		if (role.other_roles) developerRole.other_roles = await metadataService.getJobRoles(role.other_roles);
		if (role.experience) developerRole.experience = role.experience;
		profile.role = developerRole;
	};

	private _setExperiences = async (profile: IDeveloper, experiences: DeveloperDto['work_experience']) => {
		const work_experience: IDeveloper['work_experience'] = [];
		for (const experience of experiences) {
			work_experience.push({
				...experience,
				location: await metadataService.getCountry(experience.location),
			});
		}
		profile.work_experience = work_experience;
	};

	private _setEducations = (profile: IDeveloper, educations: DeveloperDto['educations']) => {
		profile.educations = educations;
	};

	private _setCertifications = (profile: IDeveloper, certifications: DeveloperDto['certifications']) => {
		profile.certifications = certifications;
	};

	private _setSocialProfile = (profile: IDeveloper, socialProfile: DeveloperDto['social_profile']) => {
		profile.social_profile = socialProfile;
	};

	private _setStatus = (profile: IDeveloper, status: DeveloperDto['status']) => {
		profile.status = status;
	};

	private _setAddress = async (profile: IDeveloper, address: DeveloperDto['address']) => {
		const profile_address: IDeveloper['address'] = {
			...address,
			country: await metadataService.getCountry(address.country),
		};
		profile.address = profile_address;
	};

	private _setCurrency = async (profile: IDeveloper, currency: DeveloperDto['currency']) => {
		profile.currency = await metadataService.getCurrency(currency);
	};

	private _setDesiredLocation = async (profile: IDeveloper, desired_location: DeveloperDto['desired_location']) => {
		profile.desired_location = await metadataService.getCountrys(desired_location);
	};

	private _setSalary = (profile: IDeveloper, salary: DeveloperDto['salary']) => {
		profile.salary = salary;
	};

	private _setJobType = (profile: IDeveloper, job_type: DeveloperDto['job_type']) => {
		profile.job_type = job_type;
	};

	private _setOtherJobType = (profile: IDeveloper, other_job_type: DeveloperDto['other_job_type']) => {
		profile.other_job_type = other_job_type;
	};

	private _setWants = (profile: IDeveloper, wants: DeveloperDto['wants']) => {
		profile.wants = wants;
	};

	private _updateAvatar = async (profile: IDeveloper, file: UploadedFile) => {
		const avatarPath = await storageService.moveFile(file);
		profile.avatar = avatarPath;
	};

	private _updateResume = async (profile: IDeveloper, file: UploadedFile) => {
		const resumePath = await storageService.moveFile(file);
		profile.resume = resumePath;
	};
}
export default DeveloperController;
