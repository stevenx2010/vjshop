export class Constants {
	static  SHIPPING_ADDRESS_KEY 	= 'shipping_address';
    static  LOGIN_KEY 				= 'login';
    static 	SEARCH_HISTORY_KEY 		= 'search_history';
    static  API_TOKEN_KEY 			= 'api_token';
    static  ACCESS_TOKEN_KEY		= 'access_token';
    static  USER_MOBILE_KEY			= 'user_mobile';
    static  USER_INFO_KEY			= 'user_info'; 
    static  SHOPPING_CART_KEY		= 'shoppingCart';
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
