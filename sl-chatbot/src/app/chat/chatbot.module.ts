import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';
import { NbChatModule, NbSpinnerModule } from '@nebular/theme';
import { SupportComponent } from './support/support.component';
import { TicketsComponent } from "./tickets/tickets.component";


@NgModule({
  declarations: [
    ChatbotComponent,
    SupportComponent,
    TicketsComponent
  ],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    SharedModule,
    NbChatModule,
    NbSpinnerModule
  ]
})
export class ChatbotModule { }
