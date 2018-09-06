import { InvoiceType, InvoiceStatus, OrderStatus, DeliveryStatus, PaymentMethod } from './constants.model';
import { ShoppingItem } from './shopping-item.model';

export class Order {
	public id: number = 0;
	public customer_id: number = 0;
	public distributor_id: number = 0;
	public total_price: number =0;
	public order_date: string = '';
	public delivery_date: string = '';
	public delivery_status: number = DeliveryStatus.WAITING_FOR_DELIVERY;
	public payment_method: number = PaymentMethod.ALIPAY;
	public shipping_method: number = 0;
	public shipping_charges: number = 0;
	public shipping_address: string = '';
	public order_status: number = OrderStatus.NOT_PAY_YET;
	public is_invoice_required: boolean = false;
	public invoice_status: number = InvoiceStatus.NOT_ISSUED;
	public invoice_type: number = InvoiceType.PERSONAL;
	public invoice_head: string = '';
	public invoice_tax_number: string = '';

	public products: ShoppingItem[] = new Array<ShoppingItem>(new ShoppingItem());

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.customer_id = obj.customer_id || 0;
			this.distributor_id = obj.distributor_id || 0;
			this.total_price = obj.total_price || 0;
			this.order_date = obj.order_date || '';
			this.delivery_date = obj.delivery_date || '';
			this.delivery_status = obj.delivery_status || DeliveryStatus.WAITING_FOR_DELIVERY;
			this.payment_method = obj.payment_method || PaymentMethod.ALIPAY;
			this.shipping_method = obj.shipping_method || 0;
			this.shipping_charges = obj.shipping_charges || 0;
			this.shipping_address = obj.shipping_address || '';
			this.order_status = obj.order_status || OrderStatus.NOT_PAY_YET;
			this.is_invoice_required = obj.is_invoice_required || false;
			this.invoice_status = obj.invoice_status || InvoiceStatus.NOT_ISSUED;
			this.invoice_type = obj.invoice_type || InvoiceType.PERSONAL;
			this.invoice_head = obj.invoice_head ||'';
			this.invoice_tax_number = obj.invoice_tax_number || '';
			this.products = obj.products || new Array<ShoppingItem>(new ShoppingItem());
		}
	}

}