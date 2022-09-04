import { connection, Types } from 'mongoose';
import { ILangData, IJobRoleData, ICountryData, ISkillData, ICurrencyData, IJobCategoryData, ITimezoneData } from '@/interfaces/metadata.interface';

const COUNTRIES_COLLECTION = 'countries';
const LANGUAGES_COLLECTION = 'languages';
const SKILLS_COLLECTION = 'skills';
const JOBROLES_COLLECTION = 'jobroles';
const TIMEZONES_COLLECTION = 'timezones';
const JOBCATEGORIES_COLLECTION = 'jobcategories';
const CURRENCIES_COLLECTION = 'currencies';

class MetadataService {
	_connection = connection;

	/*** Countries */
	async getCountry(dataId: any): Promise<ICountryData> {
		const selectedItem = await this._selectItem(dataId, COUNTRIES_COLLECTION);
		return selectedItem;
	}
	async getCountrys(dataIds: any[]): Promise<ICountryData[]> {
		const selectedItems = await this._selectItems(dataIds, COUNTRIES_COLLECTION);
		return selectedItems;
	}
	/***** */

	async getLanguage(dataId: any): Promise<ILangData> {
		const selectedItem = await this._selectItem(dataId, LANGUAGES_COLLECTION);
		return selectedItem;
	}

	/**** Skills */

	async getSkill(dataId: any): Promise<ISkillData> {
		const selectedItem = await this._selectItem(dataId, SKILLS_COLLECTION);
		return selectedItem;
	}
	async getSkills(dataIds: any[]): Promise<ISkillData[]> {
		const selectedItems = await this._selectItems(dataIds, SKILLS_COLLECTION);
		return selectedItems;
	}

	/***** */

	/*** Job roles */

	async getJobRole(dataId: any): Promise<IJobRoleData> {
		const selectedItem = await this._selectItem(dataId, JOBROLES_COLLECTION);
		return selectedItem;
	}

	async getJobRoles(dataIds: any[]): Promise<IJobRoleData[]> {
		const selectedItems = await this._selectItems(dataIds, JOBROLES_COLLECTION);
		return selectedItems;
	}

	/*** Timezones */
	async getTimezone(dataId: any): Promise<ITimezoneData> {
		const selectedItem = await this._selectItem(dataId, TIMEZONES_COLLECTION);
		return selectedItem;
	}
	async getTimezones(dataIds: any[]): Promise<ITimezoneData[]> {
		const selectedItems = await this._selectItems(dataIds, TIMEZONES_COLLECTION);
		return selectedItems;
	}
	async getTimezoneByCode(code: string): Promise<ITimezoneData> {
		const selectedItem = await this._selectItemByQeury({ code }, TIMEZONES_COLLECTION);
		return selectedItem;
	}

	/**** */

	async getJobCategory(dataId: any): Promise<IJobCategoryData> {
		const selectedItem = await this._selectItem(dataId, JOBCATEGORIES_COLLECTION);
		return selectedItem;
	}

	async getCurrency(dataId: any): Promise<ICurrencyData> {
		const selectedItem = await this._selectItem(dataId, CURRENCIES_COLLECTION);
		return selectedItem;
	}

	async getCurrencyByCode(code: string): Promise<ICurrencyData> {
		const selectedItem = await this._selectItemByQeury({ code }, CURRENCIES_COLLECTION);
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

	private _selectItemByQeury = async (query: any, collectionName: string): Promise<any> => {
		const collection = this._connection.collection(collectionName);
		const item = await collection.findOne(query);
		return item;
	};
}

export const metadataService = new MetadataService();
