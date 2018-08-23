export class Address {
	public username: string = '';
	public mobile: string ='';
	public tel: string = '';
	public city: string = '';
	public street: string = '';
	public customer_id: number = 0;
	public default_address: boolean = false;

	constructor(obj?) {
		if(obj) {
			this.username = obj.username;
			this.mobile = obj.mobile;
			this.tel = obj.tel;
			this.city = obj.city;
			this.street = obj.street;
			this.default_address = obj.default_address;
		}
	}
}