export class CouponType {
	public id:number = 0;
	public type: string = '';
	public description: string = '';
	public sort_order: number = 0;

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.type = obj.type || '';
			this.description = obj.description || '';
			this.sort_order = obj.sort_order || 0;
		}
	}
}