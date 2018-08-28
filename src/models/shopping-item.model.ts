export class ShoppingItem {
	constructor(public productId: number, public quantity: number, public price: number, public weight: number, public weight_unit: string, 
		public selected: boolean) {
	}
}