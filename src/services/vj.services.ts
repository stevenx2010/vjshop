import { Injectable, Inject } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Image } from '../models/image.model';
import { ProductCategory } from '../models/product-category.model';
import { Product } from '../models/product.model';
import { ProductDetail } from '../models/product-detail.model';
import { ProductDetailImage } from '../models/product-detail-image.model';
import { ProductSubCategory } from '../models/product-sub-category.model';

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
		this.loader.dismiss().catch(()=>{});
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

	/********************************************************************************************
	 *                   API Section: get products related data
	 *
	 * 1. Interface to get product category
	 *   	GET: http://api_url/api/product/category
	 * 2. Interface to get a list of all products
	 *   	GET: http://api_url/api/product/all
	 * 3. Interface to get the detail of a product
	 *		GET: http://api_url/api/product/detail/{id}		//get product info
	 *		GET: http://api_url/api/product/images/{id}/{position}	//get product's images at position
	 * 4. Interface to get products under a sub-category & sub-categories under a category
	 		GET: http://api_url/api/product/products/{subCategoryId}
	 		GET: http://api_url/api/product/productSubCategories/{categoryId}
	 ********************************************************************************************/

	 public getProductCategories(): Observable<ProductCategory[]> {
//	 	this.showLoader();

	 	let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl +'api/' + 'product/categories', {headers: headers})
	 			.pipe(map((res: Response) => res.json()));

	 }

	 public getProductAll(): Observable<Product[]> {
//	 	this.showLoader();

		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/' + 'product/all', {headers: headers})
	 			.pipe(map((res: Response) => res.json()));

	 }

	 public getProductDetailInfo(productId: number): Observable<ProductDetail[]> {
//	 	this.showLoader();

		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/' + 'product/detail/' + productId, {headers: headers})
				.pipe(map((res: Response) => res.json()));	 	
	 }

	 public getProductDetailImages(productId: number, position: number): Observable<ProductDetailImage[]> {
//	 	this.showLoader();

		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/' + 'product/detail/images/' + productId + '/' + position, {headers: headers})
				.pipe(map((res: Response) => res.json()));	 	
	 }

	 public getSubCategories(categoryId: number): Observable<ProductSubCategory[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/' + 'product/productSubCategories/' + categoryId, {headers: headers})
	 			.pipe(map((res: Response) => res.json()));
	 }

	 public getProducts(categoryId: number): Observable<Product[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/' + 'product/products/' + categoryId, {headers: headers})
	 			.pipe(map((res: Response) => res.json()));
	}

	public getSearchedProducts(keyword: string): Observable<ProductDetail[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/' + 'product/search/' + keyword, {headers: headers})
				.pipe(map((res: Response) => res.json()));
	}


	/********************************************************************************************
	 *                   API Section: User Login related interface
	 *
	 * 1. Interface to request SMS verification code
	 *   	POST: https://api_url/api/customer/login/getsms
	 * 2. Interface to send SMS confirmation
	 *		POST: https://api_url/api/customer/login/confirm
	 *
	 ********************************************************************************************/
	 public getSmsCode(body: any): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.post(this.apiUrl + 'api/customer/login/getsms', body, {headers: headers});
	 }

	 public confirmSmsCode(body: any): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.post(this.apiUrl + 'api/customer/login/confirm', body, {headers: headers});
	 }

}