import { LoadingController, AlertController } from 'ionic-angular';

export class Loader {
	loader: any;

	constructor(private loadingCtrl: LoadingController) {

	}

	public show(text?: string) {
		this.loader = this.loadingCtrl.create({
			//content: text ||'加载中...'
			spinner: 'ios',
			cssClass: 'transparent'
		});

		this.loader.present();

		setTimeout(() => {
			this.loader.dismiss();
		}, 10000);
	}

	/**
	 * Helper: Hide HTTP loading spinner
	 */
	public hide() {
		this.loader.dismiss().catch(()=>{});
	}
}