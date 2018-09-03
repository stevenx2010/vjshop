export class Product {
	public id: number = 0;
	public name: string = '';
	public description: string = '';
	public product_sub_category_id: number = 0; 
	public product_sub_category_name: string = '';
	public model: string = '';
	public thumbnail_url: string = '';
	public price: number = 0;
	public sold_amount: number = 0;
	public weight: number = 0;
	public weight_unit: string = '';

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.name = obj.name || '';
			this.description = obj.description || '';
			this.product_sub_category_id = obj.product_sub_category || 0;
			this.product_sub_category_name = obj.product_sub_category_name || '';
			this.model = obj.model || '';
			this.thumbnail_url = obj.thumbnail_url || '';
			this.price = obj.price || 0;
			this.sold_amount = obj.sold_amount || 0;
			this.weight = obj.weight || 0;
			this.weight_unit = obj.weight_unit || '';
		}
	}
}