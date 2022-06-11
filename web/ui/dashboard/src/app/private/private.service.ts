import { Injectable } from '@angular/core';
import { HTTP_RESPONSE } from 'src/app/models/http.model';
import { HttpService } from 'src/app/services/http/http.service';
import { GROUP } from '../models/group.model';
import { ORGANIZATION_DATA } from '../models/organisation.model';

@Injectable({
	providedIn: 'root'
})
export class PrivateService {
	activeProjectDetails!: GROUP;

	constructor(private http: HttpService) {}

	getOrganisation(): ORGANIZATION_DATA {
		let org = localStorage.getItem('CONVOY_ORG');
		return org ? JSON.parse(org) : null;
	}

	urlFactory(level: 'org' | 'org_project'): string {
		switch (level) {
			case 'org':
				return `/organisations/${this.getOrganisation().uid}`;
			case 'org_project':
				return `/organisations/${this.getOrganisation().uid}/groups/${this.activeProjectDetails.uid}`;
			default:
				return '';
		}
	}

	async getApps(requestDetails?: { pageNo?: number; searchString?: string }): Promise<HTTP_RESPONSE> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await this.http.request({
					url: `${this.urlFactory('org_project')}/apps?sort=AESC&page=${requestDetails?.pageNo || 1}&perPage=20${requestDetails?.searchString ? `&q=${requestDetails?.searchString}` : ''}`,
					method: 'get'
				});

				return resolve(response);
			} catch (error: any) {
				return reject(error);
			}
		});
	}

	getSources(requestDetails?: { page?: number }): Promise<HTTP_RESPONSE> {
		return new Promise(async (resolve, reject) => {
			try {
				const sourcesResponse = await this.http.request({
					url: `${this.urlFactory('org_project')}/sources?groupId=${this.activeProjectDetails.uid}&page=${requestDetails?.page}`,
					method: 'get'
				});

				return resolve(sourcesResponse);
			} catch (error: any) {
				return reject(error);
			}
		});
	}

	getProjectDetails(): Promise<HTTP_RESPONSE> {
		return new Promise(async (resolve, reject) => {
			try {
				const projectResponse = await this.http.request({
					url: `${this.urlFactory('org')}/groups/${this.activeProjectDetails.uid}`,
					method: 'get'
				});

				this.activeProjectDetails = projectResponse.data;
				return resolve(projectResponse);
			} catch (error: any) {
				return reject(error);
			}
		});
	}

	async getOrganizations(): Promise<HTTP_RESPONSE> {
		try {
			const response = await this.http.request({
				url: `/organisations`,
				method: 'get'
			});
			return response;
		} catch (error: any) {
			return error;
		}
	}

	async logout(): Promise<HTTP_RESPONSE> {
		try {
			const response = await this.http.request({
				url: '/auth/logout',
				method: 'post',
				body: null
			});
			return response;
		} catch (error: any) {
			return error;
		}
	}
}