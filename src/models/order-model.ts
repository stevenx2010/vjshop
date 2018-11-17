import { InvoiceType, InvoiceStatus, OrderStatus, DeliveryStatus, PaymentMethod, RefundStatus } from './constants.model';
import { ShoppingItem } from './shopping-item.model';
import { Address } from './address.model';

export class Order {
	public id: number = 0;
	public order_serial: string = '';
	public customer_id: number = 0;
	public distributor_id: number = 0;
	public total_price: number =0;
	public total_weight: number = 0;
	public order_date: string = '';
	public delivery_date: string = '';
	public delivery_confirm_date: string = '';
	public delivery_status: number = DeliveryStatus.NA;
	public payment_method: number = PaymentMethod.ALIPAY;
	public shipping_method: number = 0;
	public shipping_charges: number = 0;
	public shipping_address: Address = new Address();
	public order_status: number = OrderStatus.NOT_PAY_YET;
	public is_invoice_required: boolean = false;
	public invoice_status: number = InvoiceStatus.NA;
	public invoice_type: number = InvoiceType.PERSONAL;
	public invoice_head: string = '';
	public invoice_tax_number: string = '';
	public email: string = '';
	public refund_status: number = RefundStatus.NA;
	public coupon_used_ids: number[] = new Array<number>();

	public products: ShoppingItem[] = new Array<ShoppingItem>(new ShoppingItem());

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.order_serial = obj.order_serial || '';
			this.customer_id = obj.customer_id || 0;
			this.distributor_id = obj.distributor_id || 0;
			this.total_price = obj.total_price || 0;
			this.total_weight = obj.total_weight || 0;
			this.order_date = obj.order_date || '';
			this.delivery_date = obj.delivery_date || '';
			this.delivery_confirm_date = obj.delivery_confirm_date || '';
			this.delivery_status = obj.delivery_status || DeliveryStatus.WAITING_FOR_DELIVERY;
			this.payment_method = obj.payment_method || PaymentMethod.ALIPAY;
			this.shipping_method = obj.shipping_method || 0;
			this.shipping_charges = obj.shipping_charges || 0;
			this.shipping_address = obj.shipping_address || new Address();
			this.order_status = obj.order_status || OrderStatus.NOT_PAY_YET;
			this.is_invoice_required = obj.is_invoice_required || false;
			this.invoice_status = obj.invoice_status || InvoiceStatus.NOT_ISSUED;
			this.invoice_type = obj.invoice_type || InvoiceType.PERSONAL;
			this.invoice_head = obj.invoice_head ||'';
			this.invoice_tax_number = obj.invoice_tax_number || '';
			this.email = obj.email ||'';
			this.products = obj.products || new Array<ShoppingItem>(new ShoppingItem());
			this.coupon_used_ids = obj.coupon_used_ids || new Array<number>();
		}
	}

}