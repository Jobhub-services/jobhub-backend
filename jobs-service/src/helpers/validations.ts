import { Types } from 'mongoose';
const { ObjectId } = Types;
export function isValidObjectId(id) {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) return true;
		return false;
	}
	return false;
}
