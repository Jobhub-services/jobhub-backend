import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import Developer from '@/models/Developer';
import { IDeveloper } from '@/interfaces/developer.interface';
import { DeveloperDto } from '@/dtos/developer.dto';
import { UploadedFile } from 'express-fileupload';
import { storageService } from '@/services/StorageService';
class DeveloperController {
	updateProfile = async (req: Request, res: Response) => {
		try {
			const profileBody: DeveloperDto = req.body;
			const rootObjectId = req.rootObjectId;
			const profile = await Developer.findOne({ userId: rootObjectId });

			if (profileBody.summary) this._setSummary(profile, profileBody.summary);
			if (profileBody.languages) this._setLanguages(profile, profileBody.languages);
			if (profileBody.skills) this._setSkills(profile, profileBody.skills);
			if (profileBody.role) this._setRole(profile, profileBody.role);
			if (profileBody.work_experience) this._setExperiences(profile, profileBody.work_experience);
			if (profileBody.educations) this._setEducations(profile, profileBody.educations);
			if (profileBody.certifications) this._setCertifications(profile, profileBody.certifications);
			if (profileBody.social_profile) this._setSocialProfile(profile, profileBody.social_profile);
			if (req.files && req.files.resume) await this._updateResume(profile, req.files.resume as UploadedFile);

			await profile.save();
			const profileContent = await this._getProfileById(rootObjectId);
			res.status(200).send({ content: profileContent });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getProfile = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;

			const profile = await this._getProfileById(rootObjectId);
			res.status(200).send({ content: profile });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _getProfileById = async (userId: Schema.Types.ObjectId) => {
		try {
			const query = Developer.findOne({ userId })
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
					path: 'skills',
					select: 'name',
				});
			const profile = await query;
			return profile;
		} catch {
			return null;
		}
	};
	private _setSummary = (profile: IDeveloper, summary: IDeveloper['summary']) => {
		profile.summary = summary;
	};

	private _setLanguages = (profile: IDeveloper, languages: IDeveloper['languages']) => {
		profile.languages = languages;
	};

	private _setSkills = (profile: IDeveloper, skills: IDeveloper['skills']) => {
		profile.skills = skills;
	};

	private _setRole = (profile: IDeveloper, role: IDeveloper['role']) => {
		profile.role = role;
	};

	private _setExperiences = (profile: IDeveloper, experiences: IDeveloper['work_experience']) => {
		profile.work_experience = experiences;
	};

	private _setEducations = (profile: IDeveloper, educations: IDeveloper['educations']) => {
		profile.educations = educations;
	};

	private _setCertifications = (profile: IDeveloper, certifications: IDeveloper['certifications']) => {
		profile.certifications = certifications;
	};

	private _setSocialProfile = (profile: IDeveloper, socialProfile: IDeveloper['social_profile']) => {
		profile.social_profile = socialProfile;
	};

	private _updateResume = async (profile: IDeveloper, file: UploadedFile) => {
		const resumePath = await storageService.moveFile(file);
		profile.resume = resumePath;
	};
}
export default DeveloperController;
