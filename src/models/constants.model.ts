export class Constants {
	static  SHIPPING_ADDRESS_KEY 	= 'shipping_address';
    static  LOGIN_KEY 				= 'login';
    static 	SEARCH_HISTORY_KEY 		= 'search_history';
    static  API_TOKEN_KEY 			= 'api_token';
    static  ACCESS_TOKEN_KEY		= 'access_token';
    static  USER_MOBILE_KEY			= 'user_mobile';
    static  USER_INFO_KEY			= 'user_info'; 
    static  SHOPPING_CART_KEY		= 'shoppingCart';

    static 	LOCATION_KEY			= 'location_province';
    static  COUPON_WALLET_KEY		= 'coupon_wallet';
}

export class Login { 
	// commands
	static 	GET_SMS_CODE 				= 0;
	static	CONFIRM_SMS_CODE 			= 1;
	static  CREATE_SHIPPING_ADDDRESS	= 2;

	// status constants
	static  CONFIRM_SMS_CODE_SUCCESS 	= 1;
	static  CONFIRM_SMS_CODE_FAILURE 	= 0;
	static  SHIPPING_ADDRESS_CHECK_SUCCESS	= 1;
	static  SHIPPING_ADDRESS_CHECK_FAILURE	= 0;
	static  CREATE_SHIPPING_ADDRESS_SUCCESS	= 1;
	static  CREATE_SHIPPING_ADDRESS_FAILURE = 0;
}

export enum InvoiceType  {PERSONAL = 1, ENTERPRISE = 2}
export enum InvoiceStatus { NOT_ISSUED = 1, ISSUED = 2}
export enum OrderStatus { NOT_PAY_YET = 1, PAYED = 2, RECEIVED = 3, CLOSED = 4, CANCELD = 5, COMMENTED = 6, NOT_COMMENTED = 7}
export enum DeliveryStatus { WAITING_FOR_DELIVERY = 1, IN_DELIVERY = 2, DELIVERED_NOT_CONFIRM = 3, CONFIRMED = 4}
export enum PaymentMethod { WECHAT= 1, ALIPAY = 2 }
export enum CouponDiscountMethod { PERCENTAGE = 1, VALUE = 2}
export enum CommentStatus { NOT_COMMENTED = 1, COMMENTED = 2}
