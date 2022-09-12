import Conversation from '@/models/Conversation';

class PermissionService {
	async checkUsersConnection(companyId: any, developerId: any): Promise<boolean> {
		try {
			const conversation = await Conversation.findOne({ members: { $all: [companyId, developerId] } });
			if (conversation) return true;
			return false;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}

export const permissionService = new PermissionService();
