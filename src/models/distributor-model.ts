import { DistributorAddress } from './distributor-address-model';
import { DistributorContact } from './distributor-contact-model';

export class Distributor {
	public id: number = 0;
	public name: string = '';
	public description: string = '';
	public addresses: DistributorAddress[] = new Array<DistributorAddress>(new DistributorAddress());
	public contacts: DistributorContact[] = new Array<DistributorContact>(new DistributorContact());

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.name = obj.name || '';
			this.description = obj.description || '';
			this.addresses = obj.addresses;
			this.contacts = obj.contacts;
		}
	}

}