import { Component, Input } from '@angular/core';

/**
 * Generated class for the SeperatorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'seperator',
  template: `<div 
  	[style.margin]="0" 
  	[style.padding]="0" 
  	[style.background-color]="color" 
  	[style.color]="color" 
  	[style.font-size]="height" 
  	[style.height]="height"
  	>.</div>`
})
export class SeperatorComponent {

  @Input() color='#efefef';
  @Input() height='1px';

  constructor() {
  }

}
