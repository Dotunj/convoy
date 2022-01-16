import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general/general.service';

@Injectable()
export class HttpIntercepter implements HttpInterceptor {
	constructor(private router: Router, private generalService: GeneralService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			map((httpEvent: HttpEvent<any>) => {
				return httpEvent;
			}),
			catchError((error: HttpErrorResponse) => {
				if (error.error.status === 401 || error.error.message == 'Signature has expired') this.router.navigate(['/login'], { replaceUrl: true });
				let errorMessage: string;

				if (Array.isArray(error.error?.errors) && error.error?.errors.length > 0) {
					errorMessage = error.error?.errors[0]?.message;
				} else {
					errorMessage = error.error?.message;
				}
				this.generalService.showNotification({
					message: `${error.message === 'Timeout has occurred' ? 'Request timeout, please check your network and try again' : errorMessage}`
				});
				return throwError(error);
			})
		);
	}
}