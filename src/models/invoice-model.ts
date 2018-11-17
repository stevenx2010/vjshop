import { InvoiceType } from './constants.model';

export class Invoice {
	public head: string = '';
	public tax_number: string = '';
	public type: number = InvoiceType.PERSONAL; // 1: personal; 2: enterprise
	public email: string = '';
	public required: boolean = false;

	constructor(obj?) {
		if(obj) {
			this.head = obj.head || '';
			this.tax_number = obj.tax_number || '';
			this.type = obj.type || InvoiceType.PERSONAL;
			this.email = obj.email || '';
			this.required = obj.required || false;
		}
	}
}