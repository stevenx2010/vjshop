export class Coupon {
	public id: number = 0;
	public name: string = '';
	public description: string = '';
	public coupon_type_id: number = 0;
	public expire_date: string = '';
	public expired: boolean = true;
	public discount_method: number = 2;
	public discount_percentage: number = 100;
	public discount_value: number = 0;
	public quantity_initial: number = 0;
	public quantity_available: number = 0;
	public image_url: string = '';

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.name = obj.name || '';
			this.description = obj.description || '';
			this.coupon_type_id = obj.coupon_type_id || 0;
			this.expire_date = obj.expire_date || '';
			this.expired = obj.expired || true;
			this.discount_method = obj.discount_method || 2;
			this.discount_percentage = obj.discount_percentage || 100;
			this.discount_value = obj.discount_value || 0;
			this.quantity_initial = obj.quantity_initial || 0;
			this.quantity_available = obj.quantity_available || 0;
			this.image_url = obj.image_url || '';
		}
	}
}