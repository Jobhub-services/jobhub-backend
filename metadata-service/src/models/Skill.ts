import { model, Schema, Document } from 'mongoose';
import { ISkills } from '@/interfaces/skills.interface';
const skillsSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	industry: {
		type: String,
	},
});
skillsSchema.index({ name: 'text' });

const Skill = model<ISkills & Document>('Skill', skillsSchema);

export default Skill;
