import { CouponDiscountMethod } from './constants.model';

export class Coupon {
	public id: number = 0;
	public name: string = '';
	public description: string = '';
	public coupon_type_id: number = 0;
	public expire_date: string = '';
	public expired: boolean = false;
	public discount_method: number = CouponDiscountMethod.VALUE;
	public discount_percentage: number = 100;
	public discount_value: number = 0;
	public quantity_initial: number = 0;
	public quantity_available: number = 0;
	public image_url: string = '';
	public has_used: boolean = false;
	public min_purchased_amount: number = 0;

	public pivot: CouponCustomerPivot = new CouponCustomerPivot();

	// helper fields to disable the take button & display text
	public btn_disabled: boolean = false;
	public z_index: number = -1;

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.name = obj.name || '';
			this.description = obj.description || '';
			this.coupon_type_id = obj.coupon_type_id || 0;
			this.expire_date = obj.expire_date || '';
			this.expired = obj.expired || false;
			this.discount_method = obj.discount_method || CouponDiscountMethod.VALUE;
			this.discount_percentage = obj.discount_percentage || 100;
			this.discount_value = obj.discount_value || 0;
			this.quantity_initial = obj.quantity_initial || 0;
			this.quantity_available = obj.quantity_available || 0;
			this.image_url = obj.image_url || '';
			this.has_used = obj.has_used || false;
			this.min_purchased_amount = obj.min_purchased_amount || 0;
			
			this.btn_disabled = obj.btn_disable || false;			
			this.z_index = obj.z_idnex || -1;

			this.pivot = obj.pivot || new CouponCustomerPivot();
		}
	}
}

export class CouponCustomerPivot {
	public coupon_id: number = 0;
	public customer_id: number = 0;
	public quantity: number = 0;
}