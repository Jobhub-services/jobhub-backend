import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

export default class HttpClient {
	protected _client: AxiosInstance;

	constructor(basePath: string, headers?: AxiosRequestConfig['headers']) {
		this._client = axios.create({
			baseURL: basePath,
			headers,
		});
	}
	get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		return this._client.get(url, config);
	}

	delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		return this._client.delete(url, config);
	}

	post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
		return this._client.post(url, data, config);
	}

	put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
		return this._client.put(url, data, config);
	}

	patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
		return this._client.patch(url, data, config);
	}
}
