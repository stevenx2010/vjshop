import { Component, Output, EventEmitter } from '@angular/core';

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

  rating: number = 0;

  onClick(value) {
    this.rating = value;
    this.onChange.emit(this.rating);
  }
}
