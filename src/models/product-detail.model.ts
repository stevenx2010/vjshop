export class ProductDetail {
	public id: number = 0;
	public name: string = ''; 
	public description: string =''; 
	public price: number = 0;
	public weight: number = 0; 
	public weight_unit: string = ''; 
	public sold_amount: number = 0;
	public thumbnail_url: string = '';

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.name = obj.name || 0;
			this.description = obj.description || 0;
			this.price = obj.price || 0;
			this.weight = obj.weight || 0;
			this.weight_unit = obj.weight_unit || '';
			this.sold_amount = obj.sold_amount || 0;
			this.thumbnail_url = obj.thumbnail_url = '';
		}
	}
}