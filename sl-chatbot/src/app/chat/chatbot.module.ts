import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';
import { NbChatModule, NbSpinnerModule } from '@nebular/theme';
import { SupportComponent } from './support/support.component';
import { TicketsComponent } from "./tickets/tickets.component";
import { LoginComponent } from "../auth/login/login.component";
import {PortalModule} from "@angular/cdk/portal";


@NgModule({
  declarations: [
    ChatbotComponent,
    SupportComponent,
    TicketsComponent,
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    SharedModule,
    NbChatModule,
    NbSpinnerModule,
    PortalModule
  ]
})
export class ChatbotModule { }
