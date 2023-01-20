import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  // messages: any[];
  messages: any[] = [
    {
      text: 'Hello how can I help you?',
      date: new Date(),
      reply: false,
      user: {
        name: 'SL chatbot',
        avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      },
    },
    {
      type: 'button',
      customMessageData: 'Support',
      reply: false,
      date: '',
      user: {
        name: 'SL chatbot',
        avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      },
    },
  ];
  constructor() {
  }

  ngOnInit(): void {
  }

  sendMessage(event:any) {
    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      user: {
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
      },
    });
  }

  getSupport(){

  }
  
  getLicense(){
    
  }
}
