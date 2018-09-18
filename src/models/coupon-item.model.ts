import { CouponCustomerPivot } from './coupon-model';

export class CouponItem {
	public id: number = 0;
	public name: string = '';
	public description: string = '';
	public coupon_type_id: number = 0;
	public expire_date: string = '';
	public expired: boolean = false;
	public discount_method: number = 2;
	public discount_percentage: number = 100;
	public discount_value: number = 0;
	public image_url: string = '';
	public has_used: boolean = false;

	public pivot: CouponCustomerPivot = new CouponCustomerPivot();

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.name = obj.name || '';
			this.description = obj.description || '';
			this.coupon_type_id = obj.coupon_type_id || 0;
			this.expire_date = obj.expire_date || '';
			this.expired = obj.expired || false;
			this.discount_method = obj.discount_method || 2;
			this.discount_percentage = obj.discount_percentage || 100;
			this.discount_value = obj.discount_value || 0;
			this.image_url = obj.image_url || '';
			this.has_used = obj.has_used || false;

			this.pivot = obj.pivot || new CouponCustomerPivot();
		}
	}
}
