export class Location {
	public province: string = '';
	public city: string = '';
	public district: string = '';
	public street: string = '';
	public address: string = '';
	public locationDescribe: string = '';

	constructor(obj?) {
		if(obj) {
			this.province = obj.province;
			this.city = obj.city;
			this.district = obj.district;
			this.street = obj.street;
			this.address = obj.addr;
			this.locationDescribe = obj.locationDescribe;
		}
	}
}