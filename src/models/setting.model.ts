export class Setting {
	public id: number = 0;
	public type: number = 0;
	public description: string = '';
	public setting_name: string = '';
	public setting_value: string = '';
	public setting_value_postfix: string = '';
	public parameter1: number= 0;
	public parameter2: number = 0;
	public condition1: number = 0;
	public condition2: number = 0; 

	constructor(obj?) {
		if(obj) {
			this.id = obj.id || 0;
			this.type = obj.type || 0;
			this.description = obj.description || '';
			this.setting_name = obj.setting_name || '';
			this.setting_value = obj.setting_value || '';
			this.setting_value_postfix = obj.setting_value_postfix || '';
			this.parameter1 = obj.parameter1 || 0;
			this.parameter2 = obj.parameter2 || 0;
			this.condition1 = obj.condition1 || 0;
			this.condition2 = obj.condition2 || 0;
		}
	}
}