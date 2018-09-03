export class CouponNewComer {
	public description: string = '';
	public image_url: string = '';

	constructor(obj?) {
		if(obj) {
			this.description = obj.description || '';
			this.image_url = obj.image_url || '';
		}
	}
}