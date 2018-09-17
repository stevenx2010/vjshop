export class Comment {
	public id: number = 0;
	public order_id: number = 0;
	public product_id: number = 0;
	public rating: number = 0;
	public comment: string = '';
	public comment_date: string = '';
	public comment_owner: string = '';
	public prev_id: number = 0;
	public next_id: number = 0;

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.order_id = obj.order_id || 0;
			this.product_id = obj.product_id || 0;
			this.rating = obj.rating || 0;
			this.comment = obj.comment || '';
			this.comment_date = obj.comment_date || '';
			this.comment_owner = obj.comment_owner || '';
			this.prev_id = obj.prev_id || 0;
			this.next_id = obj.next_id || 0;
		}
	}
}