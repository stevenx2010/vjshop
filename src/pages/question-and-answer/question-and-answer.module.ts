import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionAndAnswerPage } from './question-and-answer';

@NgModule({
  declarations: [
    QuestionAndAnswerPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionAndAnswerPage),
  ],
})
export class QuestionAndAnswerPageModule {}
