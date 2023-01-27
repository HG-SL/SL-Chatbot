import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { BotComponent } from './bot/bot.component';
import { NbChatModule, NbSpinnerModule } from '@nebular/theme';

@NgModule({
  declarations: [
    PagesComponent, 
    BotComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    NbChatModule,
    NbSpinnerModule
  ]
})
export class PagesModule { }
