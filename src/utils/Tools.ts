export class Tools {
	public static getDateTime() {
	let date = new Date();
    let d1 = Date.now() - date.getTimezoneOffset()
    let d2 = new Date(d1);
    let d3 = d2.toJSON();
    let d4 = d3.replace(/(.*)T(.*)\..*/, "$1 $2");
    let d5 = d4.replace(/.* (.*):(.*):(.*)/, "$1");
    let n = Number(d5) + 8;
    let d6 = n < 10 ? '0' + n : '' + n;
    d6 = n >= 24 ? '00' : '' + n;
    let d7 = d4.replace(/(.*) (.*):(.*):(.*)/, "$1 " + d6 + ":$3:$4");

    return d7;
	}
}