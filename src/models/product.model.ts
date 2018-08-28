export class Product {
	constructor(public id: number, public product_sub_category_id: number, public product_sub_category_name: string, public model: string, 
		public thumbnail_url: string, public price: number, public sold_amount: number, public weight: number) {}
}