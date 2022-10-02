import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { BotComponent } from './bot/bot.component';
import { NbChatModule } from '@nebular/theme';

@NgModule({
  declarations: [
    PagesComponent, 
    BotComponent
  ],
  providers: [
    
  ],
  entryComponents: [
    
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    NbChatModule
  ]
})
export class PagesModule { }
