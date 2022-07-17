import { connection, Types } from 'mongoose';
import { ILangData, IJobRoleData, ICountryData, ISkillData, ICurrencyData, IJobCategoryData } from '@/interfaces/metadata.interface';
class MetadataService {
	_connection = connection;

	/*** Countries */
	async getCountry(dataId: any): Promise<ICountryData> {
		const collectionName = 'countries';
		const selectedItem = await this._selectItem(dataId, collectionName);
		return selectedItem;
	}
	async getCountrys(dataIds: any[]): Promise<ICountryData[]> {
		const collectionName = 'countries';
		const selectedItems = await this._selectItems(dataIds, collectionName);
		return selectedItems;
	}
	/***** */

	async getLanguage(dataId: any): Promise<ILangData> {
		const collectionName = 'languages';
		const selectedItem = await this._selectItem(dataId, collectionName);
		return selectedItem;
	}

	/**** Skills */

	async getSkill(dataId: any): Promise<ISkillData> {
		const collectionName = 'skills';
		const selectedItem = await this._selectItem(dataId, collectionName);
		return selectedItem;
	}
	async getSkills(dataIds: any[]): Promise<ISkillData[]> {
		const collectionName = 'skills';
		const selectedItems = await this._selectItems(dataIds, collectionName);
		return selectedItems;
	}

	/***** */

	/*** Job roles */

	async getJobRole(dataId: any): Promise<IJobRoleData> {
		const collectionName = 'jobroles';
		const selectedItem = await this._selectItem(dataId, collectionName);
		return selectedItem;
	}

	async getJobRoles(dataIds: any[]): Promise<IJobRoleData[]> {
		const collectionName = 'jobroles';
		const selectedItems = await this._selectItems(dataIds, collectionName);
		return selectedItems;
	}
	/**** */

	async getJobCategory(dataId: any): Promise<IJobCategoryData> {
		const collectionName = 'jobcategories';
		const selectedItem = await this._selectItem(dataId, collectionName);
		return selectedItem;
	}

	async getCurrency(dataId: any): Promise<ICurrencyData> {
		const collectionName = 'currencies';
		const selectedItem = await this._selectItem(dataId, collectionName);
		return selectedItem;
	}

	private _selectItem = async (itemId: any, collectionName: string): Promise<any> => {
		const collection = this._connection.collection(collectionName);
		const itemObjectId = new Types.ObjectId(itemId);
		const item = await collection.findOne({ _id: itemObjectId });
		return item;
	};
	private _selectItems = async (itemIds: any[], collectionName: string): Promise<any[]> => {
		const collection = this._connection.collection(collectionName);
		const ids = [];
		itemIds.forEach((id) => {
			ids.push(new Types.ObjectId(id));
		});
		const item = await collection.find({ _id: { $in: ids } }).toArray();
		return item;
	};
}

export const metadataService = new MetadataService();
