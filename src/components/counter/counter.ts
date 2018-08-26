import { Component, Input } from '@angular/core';
import { Content } from 'ionic-angular';

/**
 * Generated class for the CounterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'counter',
  templateUrl: 'counter.html'
})
export class CounterComponent {
  @Input() size = '1rem';
  @Input() start = 1;
  @Input() count: number;

  btnDisabled: boolean = true;

  constructor() {
  	if(this.count <= this.start) this.btnDisabled = true;
  	else this.btnDisabled = false;
  }

  decrease() {
  	if(this.count > this.start) 
  		this.count -= 1;
  	if(this.count <= this.start) this.btnDisabled = true;
  	else this.btnDisabled = false;
  }

  increase() {
  	this.count = Number(this.count) + 1;
  	if(this.count >= this.start) this.btnDisabled = false;
  	else this.btnDisabled = true;
  }
}
