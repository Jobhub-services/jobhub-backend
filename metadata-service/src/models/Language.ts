import { model, Schema, Document } from 'mongoose';
import { ILanguage } from '@/interfaces/languages.interface';
const languageSchema: Schema = new Schema({
	code: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

const Language = model<ILanguage & Document>('Language', languageSchema);

export default Language;
