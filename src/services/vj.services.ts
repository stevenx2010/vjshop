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
import { Constants } from '../models/constants.model';
import { Address } from '../models/address.model';
import { DistributorAddress } from '../models/distributor-address-model';
import { DistributorContact } from '../models/distributor-contact-model';
import { Distributor } from '../models/distributor-model';
import { CouponType } from '../models/coupon-type-model';
import { Coupon } from '../models/coupon-model';
import { CouponNewComer } from '../models/coupon-newcomer-model';
import { CouponItem } from '../models/coupon-item.model';
import { Order } from '../models/order-model';

@Injectable()
export class VJAPI {
	private TOKEN_KEY = 'api_token';
	private api_token: string;
	private access_token: string;
	private loader: any;

	constructor(private http: Http, private storage: Storage, private loadingCtrl: LoadingController,
			    private inAppBrowser: InAppBrowser, @Inject('API_BASE_URL') private apiUrl: string) {
		this.storage.ready().then(() =>{ 
			this.storage.get(Constants.API_TOKEN_KEY).then((token) => { 
				this.api_token = token; }).catch(console.log);

			this.storage.get(Constants.ACCESS_TOKEN_KEY).then((token) => {
				this.access_token = token;
			}).catch(console.log);
		});
	}

	/**
	 * Helper: create HTTP request headers
	 */
	private initAuthHeader(headers: Headers) {
		headers.append('Authorization', 'Bearer ' + this.api_token);
		headers.append('X-Acces-Token', this.access_token);
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
	 * 5. Interface to search products
	 *		GET: http://api_url/api/product/search/{keyword}
	 * 6. Inteface to get products by productIds
	 *		POST: http://api_url/api/product/product/ids
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

	 public getProductById(productId: number): Observable<Product[]> {
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

	public getProductsByIds(body: any): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.post(this.apiUrl + 'api/' + 'product/products/ids', body, {headers: headers});
	}


	/********************************************************************************************
	 *                   API Section: User Login related interface
	 *
	 * 1. Interface to request SMS verification code
	 *   	POST: https://api_url/api/customer/login
	 *
	 * Requiremnet: all requests must have api_token in the Authentication header
	 *
	 * Content of POST:
	 * 	1) Get SMS Code request
	 *		{
	 *			"command": "0",		// Get SMS Code
	 *			"mobile": "13888888138",
	 *		}
	 *	   Reponse:
	 *		{
	 *			"status": "0"/"1", //0: failed to send SMS code; 1. succeeded to send SMS code
	 *			"mobile": "13888888138",
	 *
	 *		}
	 *	2) Confirm the SMS Code request
	 *		{
	 *			"command": "1",		// Confirm SMS Code
	 *			"mobile": "13888888138",
	 *			"sms_code": sms_code
	 *		}
	 *		Response:
	 * 		{
	 *			"status": "0"/"1", 	//0: failed to auth; 2. 1. succeeded to auth
	 *			"mobile": "13888888138", 
	 *			"access_token": token_string	// contains access token if authed successfully for a new user, otherwise empty string
	 *			"address_check": 0/1			// if user user has valid shipping address: 0: no, 1: yes
	 *		}
	 *
	 *	3) Save shipping address to server request
	 *		{
	 *			"command": "2",
	 *			"username": username,
	 *			"mobile": mobile,
	 *			"tel": telephone,
	 *			"city": city,
	 *			"street": street,
	 *			"default_address": true/false
	 *		}
	 *		Response:
	 *		{
	 *			"status": 0/1,		// 0:failed; 1 success
	 *			"mobile": mobile
	 *		}
	 *
	 ********************************************************************************************/
	 public auth(body: any): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.post(this.apiUrl + 'api/customer/login', body, {headers: headers});
	 }

	 public checkUserExist(mobile: string): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/customer/check_user/' + mobile, {headers: headers})
			.pipe(map((data) => data.json()));	 	
	 }

	/********************************************************************************************
	 *                   API Section: get shipping address related data
	 *
	 * 1. Interface to get a list of all address
	 *		GET:	http://api_url/api/address/all
	 * 2. Interface to verify if a user exists
	 *		GET:	http://api_url/api/address/userid
	 ********************************************************************************************/
	 public getAddressAll(mobile: string): Observable<Address[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/address/all/' + mobile, {headers: headers})
	 			.pipe(map((resp: Response) => resp.json()));

	 }

	 public getDefaultAddress(mobile: string): Observable<Address[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/address/default/' + mobile, {headers: headers})
				.pipe(map((data) => data.json()));	 	
	 }

	 public getUserId(mobile: string): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/address/userid/' + mobile, {headers: headers});

	 }

	/********************************************************************************************
	 *                   API Section: Distributor related data
	 *
	 * 1. Interface to get default address of Distributor
	 *		GET:	http://api_url/api/distributor/address/default
	 * 2. Interface to find distributor by location
	 ********************************************************************************************/
	 public getDistributorDefaultAddress(distributorId: number): Observable<DistributorAddress> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/distributor/address/default/' + distributorId, {headers: headers})
			.pipe(map((data) => data.json()));	 	
	 }

	 public getDistributorAddressByLocation(city: string): Observable<DistributorAddress[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/distributor/address/' + city, {headers: headers})
			.pipe(map((data) => data.json()));	 	
	 }

	 public getDistributorContactById(distributorId: number): Observable<DistributorContact[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/distributor/contact/' + distributorId, {headers: headers})
			.pipe(map((data) => data.json()));	 	
	 }

	 public getDistributorById(distributorId: number): Observable<Distributor[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/distributor/distributor/' + distributorId, {headers: headers})
	 		.pipe(map((data) => data.json()));
	 }

	 public getDistributorLogin(mobile: string): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/distributor/login/' + mobile, {headers: headers});	
	//		.pipe(map((data) =>data.json())); 	
	 }

	 public getOrdersOfDistributor(mobile: string): Observable<Order[]>{
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/distributor/orders/' + mobile, {headers: headers})
	 		.pipe(map((data) => data.json()));
	 }

	 public getInventoriesOfDistributor(mobile: string): Observable<Product[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/distributor/inventories/' + mobile, {headers: headers})
	 		.pipe(map((data) => data.json()));	 	
	 }

	 public getDistributorInfoByMobile(mobile: string): Observable<Distributor> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/distributor/info/mobile/' + mobile, {headers: headers})
	 		.pipe(map((data) => data.json()));		 	
	 }

	/********************************************************************************************
	 *                   API Section: Coupon related data
	 *
	 * 1. Interface to get coupon types
	 *		GET:	http://api_url/api/coupon/types
	 * 2. Interface to get coupons by type id
	 ********************************************************************************************/
	 public getCouponAllTypes(): Observable<CouponType[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/coupon/types', {headers: headers})
			.pipe(map((data) => data.json()));	 	
	 }

	 public getCouponsByTypeId(typeId: number): Observable<Coupon[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/coupon/bytype/' + typeId, {headers: headers})
	 		.pipe(map((data) => data.json()));
	 }

	 public getPageInforOfNewComer(): Observable<CouponNewComer[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/coupon/newcomer', {headers: headers})
	 		.pipe(map((data) => data.json()));
	 }

	 public updateCouponExpireStatus(body): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.post(this.apiUrl + 'api/coupon/update/expire_status', body, {headers: headers});	 	
	 }

	 public getCouponsByMobile(mobile: string): Observable<CouponItem[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/coupon/coupons/mobile/' + mobile, {headers: headers})
			.pipe(map((data) => data.json()));	 	
	 }

	 public setCouponCustomerRelation(body): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.post(this.apiUrl + 'api/coupon/coupon_customer', body, {headers: headers});	 	
	 }

	 public getCouponsFiltered(mobile: string): Observable<Coupon[]> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

	 	return this.http.get(this.apiUrl + 'api/coupon/coupons_filtered/' + mobile, {headers: headers})
	 		.pipe(map((data)=>data.json()));
	 }

	/********************************************************************************************
	 *                   API Section: Order related data
	 *
	 * 1. Interface to SUBMIT Order
	 *		POST:	http://api_url/api/order/submit
	 * 2. Interface to 
	 ********************************************************************************************/
	 public submitOrder(body): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.post(this.apiUrl + 'api/order/submit', body, {headers: headers});	 	
	 }

	 public updateOrderDeliveryStatus(orderId, status, datetime): Observable<Response> {
		let headers = new Headers();
	 	this.initAuthHeader(headers);

		return this.http.get(this.apiUrl + 'api/order/update/delivery/' + orderId + '/' + status + '/' + datetime, {headers: headers});	 	
	 }
}