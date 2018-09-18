import { Component, Output, EventEmitter, Input } from '@angular/core';

/**
 * Generated class for the RatingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  @Output() onChange = new EventEmitter<number>();
  @Input() rating: number = 0;
  @Input() disabled: boolean = false;

  onClick(value) {
  	if(!this.disabled) {
	    this.rating = value;
	    this.onChange.emit(this.rating);
	}	
  }
}
