export class Filter {
	public brand_vj: boolean = false;
	public brand_hf: boolean = false;
	public package_box: boolean = false;
	public package_pan: boolean = false;
	public package_dai: boolean = false;
	public coating_zinc: boolean = false;
	public coating_color: boolean = false;
	public quality_aftermarket: boolean = false;
	public quality_oem: boolean = false;

	constructor(obj?) {
		if(obj) {
			this.brand_vj = obj.brand_vj || false;
			this.brand_hf = obj.brand_hf || false;
			this.package_box = obj.package_box || false;
			this.package_pan = obj.package_pan || false;
			this.package_dai = obj.package_dai || false;
			this.coating_zinc = obj.coating_zinc || false;
			this.coating_color = obj.coating_color || false;
			this.quality_aftermarket = obj.quality_aftermarket || false;
			this.quality_oem = obj.oem || false;
		}
	}
}