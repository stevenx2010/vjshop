import { Product } from './product.model';
import { ProductSubCategory } from './product-sub-category.model';

export class ProductBySubCategory {
	constructor(public subCategory: ProductSubCategory, public products: Product[]) {
	}
}