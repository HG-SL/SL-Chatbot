import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatbotComponent } from './chatbot.component';

const routes: Routes = [
  {
    path: '',
    component: ChatbotComponent,
    children: [
      { path: '', redirectTo: 'chatbot', pathMatch: 'full' },
      { path: 'chatbot', component: ChatbotComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatbotRoutingModule { }
