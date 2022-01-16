import { Injectable } from '@angular/core';
import { HTTP_RESPONSE } from 'src/app/models/http.model';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
	providedIn: 'root'
})
export class LoginService {
	constructor(private http: HttpService) {}

	async login(requestDetails: { email?: string; password?: string }): Promise<HTTP_RESPONSE> {
		try {
			const response = await this.http.request({
				url: 'login',
				body: requestDetails,
				method: 'post'
			});
			return response;
		} catch (error: any) {
			return error;
		}
	}
	
	async logout(): Promise<HTTP_RESPONSE> {
		try {
			const response = await this.http.request({
				url: 'logout',
				method: 'delete'
			});
			return response;
		} catch (error: any) {
			return error;
		}
	}

	async getOrganizations(requestOptions: { userId: string }): Promise<HTTP_RESPONSE> {
		try {
			const response = await this.http.request({
				url: `organizations?${requestOptions.userId || ''}`,
				method: 'get'
			});
			return response;
		} catch (error: any) {
			return error;
		}
	}
}