export class Tools {
	public static getDateTime() {
	let date = new Date();

    let d1 = date.getHours() - date.getTimezoneOffset() / 60;
    let d2 = date.getMinutes() - date.getTimezoneOffset() % 60;

    date.setHours(d1);
    date.setMinutes(d2);

    let d3 = date.toJSON();
    let d4 = d3.replace(/(.*)T(.*)\..*/, "$1 $2");

    let d5 = d4.replace(/.* (.*):(.*):(.*)/, "$1");
    let n = Number(d5) + 8;
    let d6 = n < 10 ? '0' + n : '' + n;
    d6 = n >= 24 ? '00' : '' + n;
    let d7 = d4.replace(/(.*) (.*):(.*):(.*)/, "$1 " + d6 + ":$3:$4");

    return d4;
	}
}