export class ShoppingItem {
	public productId: number = 0;
	public quantity: number = 0;
	public price: number = 0;
	public weight: number = 0; 
	public weight_unit: string = ''; 
	public selected: boolean = false;

	constructor(obj?) {
		if(obj) {
			this.productId = obj.productId || 0;
			this.quantity = obj.quantity || 0;
			this.price = obj.price || 0;
			this.weight = obj.weight || 0;
			this.weight_unit = obj.weight_unit || 0;
			this.selected = obj.selected || false;
		}
	}

}