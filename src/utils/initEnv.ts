import { Injectable, Inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

import { Constants } from '../models/constants.model';
import { VJAPI } from '../services/vj.services';
import { CouponItem } from '../models/coupon-item.model';
import { Address } from '../models/address.model';

@Injectable()
export class InitEnv {

	constructor(private storage: Storage, private vjApi: VJAPI) {}

	public checkLogin(): Observable<boolean> {
		return new Observable((observer) => {
			this.storage.ready().then(() => {
				this.storage.get(Constants.LOGIN_KEY).then((data) => {
					observer.next(data);
			})
		})});
	}

	public getMobile(): Observable<string> {
		return new Observable((observer) => {
			this.storage.ready().then(()=>{
				this.storage.get(Constants.USER_MOBILE_KEY).then((data) => {
					observer.next(data);
				})
			});
		})
	}

	public getCouponWallet(mobile: string): Observable<Set<CouponItem>> {
		return new Observable((observer) => {
			let couponWallet: Set<CouponItem> = new Set<CouponItem>();

			this.vjApi.getCouponsByMobile(mobile).subscribe((data) => {
	          if(data.length > 0) {
	            for(let item of data) {
	                let coupon_item: CouponItem = new CouponItem(item);
	                couponWallet.add(coupon_item);
	                   
	            }

	            this.storage.ready().then(() => {
	              this.storage.remove(Constants.COUPON_WALLET_KEY);
	              this.storage.set(Constants.COUPON_WALLET_KEY, couponWallet);
	            });

	            observer.next(couponWallet);
	          }
	         },
	         (err) => console.log(err));   

		})
	}

	public getUserAddresses(mobile: string): Observable<Address> {
		return new Observable<Address>((observer) => {
			this.vjApi.getDefaultAddress(mobile).subscribe((data) => {
				if(data.length > 0) {
					this.storage.ready().then(() => {
						this.storage.set(Constants.SHIPPING_ADDRESS_KEY, data[0]);
					});

					observer.next(data[0]);
				}
			})
		})
	}

}