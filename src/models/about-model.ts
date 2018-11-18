export class About {
	public content: string = '';
	public images: string[] = new Array<string>();

	constructor(obj?) {
		if(obj) {
			this.content = obj.content || '';
			this.images = obj.images || new Array<string>();
		}
	}
}