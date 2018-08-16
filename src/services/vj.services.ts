import { Injectable, Inject } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Image } from '../models/image.model';

@Injectable()
export class VJAPI {
	private TOKEN_KEY = 'api_token';
	private api_token: string;
	private loader: any;

	constructor(private http: Http, private storage: Storage, private loadingCtrl: LoadingController,
			    private inAppBrowser: InAppBrowser, @Inject('API_BASE_URL') private apiUrl: string) {
		this.storage.get(this.TOKEN_KEY).then(
			(token) => { this.api_token = token; }
		)
	}

	/**
	 * Helper: create HTTP request headers
	 */
	private initAuthHeader(headers: Headers) {
		headers.append('Authorization', 'Bearer ' + this.api_token);
		headers.append('Accept-language', 'en_US');
		headers.append('Content-type', 'application/json');
		headers.append('Access-Control-Allow-Origin', '*');
		headers.append('Access-Control-Allow-Methods','GET, POST, PATCH, PUT,DELETE, OPTIONS, HEAD');
		headers.append('Access-Control-Allow-Headers', 'Origin, Content-type, X-Auth-Token');
	}

	/**
	 * Helper: show HTTP loading spinner
	 */
	public showLoader(text?: string) {
		this.loader = this.loadingCtrl.create({
			content: text ||'Loading'
		});

		this.loader.present();
	}

	/**
	 * Helper: Hide HTTP loading spinner
	 */
	public hideLoader() {
		this.loader.dismiss();
	}

	/********************************************************************************************
	 *                   API Section: get images for the home page
	 *
	 * 1. Interface to get all images for the home page
	 *   GET: http://api_url/api/HomePageImages
	 * 2. Interface to get images for specific area (1, 2, 3 or 4)
	 *   GET: http://api_url/api/HomePageImages/images/{location}
	 ********************************************************************************************/
	public getHomePageImages(location?: number): Observable<Response> {
		this.showLoader();

		let headers = new Headers();

		this.initAuthHeader(headers);

		if(location != null) {
			return this.http.get(this.apiUrl + 'api/' + 'HomePageImages/images/' + location, 
				{headers: headers}).switchMap((resp: Response) => resp.json());
		} else {
			return this.http.get(this.apiUrl + 'api/' + 'HomePageImages',
				{headers: headers});
		}
	}


}