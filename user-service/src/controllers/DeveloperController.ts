import { Request, Response } from 'express';
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

			if (profileBody.summary) this.setSummary(profile, profileBody.summary);
			if (profileBody.languages) this.setLanguages(profile, profileBody.languages);
			if (profileBody.skills) this.setSkills(profile, profileBody.skills);
			if (profileBody.role) this.setRole(profile, profileBody.role);
			if (profileBody.work_experience) this.setExperiences(profile, profileBody.work_experience);
			if (profileBody.educations) this.setEducations(profile, profileBody.educations);
			if (profileBody.certifications) this.setCertifications(profile, profileBody.certifications);
			if (profileBody.social_profile) this.setSocialProfile(profile, profileBody.social_profile);
			if (req.files && req.files.resume) await this.updateResume(profile, req.files.resume as UploadedFile);

			await profile.save();
			res.status(200).send({ content: profile });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	private setSummary = (profile: IDeveloper, summary: IDeveloper['summary']) => {
		profile.summary = summary;
	};

	private setLanguages = (profile: IDeveloper, languages: IDeveloper['languages']) => {
		profile.languages = languages;
	};

	private setSkills = (profile: IDeveloper, skills: IDeveloper['skills']) => {
		profile.skills = skills;
	};

	private setRole = (profile: IDeveloper, role: IDeveloper['role']) => {
		profile.role = role;
	};

	private setExperiences = (profile: IDeveloper, experiences: IDeveloper['work_experience']) => {
		profile.work_experience = experiences;
	};

	private setEducations = (profile: IDeveloper, educations: IDeveloper['educations']) => {
		profile.educations = educations;
	};

	private setCertifications = (profile: IDeveloper, certifications: IDeveloper['certifications']) => {
		profile.certifications = certifications;
	};

	private setSocialProfile = (profile: IDeveloper, socialProfile: IDeveloper['social_profile']) => {
		profile.social_profile = socialProfile;
	};

	private updateResume = async (profile: IDeveloper, file: UploadedFile) => {
		const resumePath = await storageService.moveFile(file);
		profile.resume = resumePath;
	};
}
export default DeveloperController;
