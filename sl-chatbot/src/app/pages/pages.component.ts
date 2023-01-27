import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/core/services/questions.service'
import { ProductsService } from 'src/app/core/services/products.service'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  loading = false;
  products:any = []
  product:any
  removable = true;
  // messages: any[];
  chats: any[] = [{
    status: 'primary',
    title: 'Shocklogic',
    messages: [
      {
        status: 'success',
        type: 'button',
        text: 'Hello how can I help you?',
        customMessageData: 'Support',
        date: new Date(),
        reply: false,
        user: {
          name: 'SL chatbot',
          avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
        },
      },
    ]
  }]

  messages: any[] = [
    {
      status: 'success',
      type: 'button',
      text: 'Hello how can I help you?',
      customMessageData: 'Support',
      date: new Date(),
      reply: false,
      user: {
        avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      },
    },
    
  ];

  constructor(
    private questionService: QuestionsService,
    private productsService: ProductsService
    ) {
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
    this.productsService.getProducts()
    .subscribe(
      res => {
        this.messages.push({
          type: 'custom-products-msg',
          customMessageData: 'Please select the product you have any questions about',
          reply: false,
          avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
          date: new Date(),
          user: {
            name: 'SL chatbot',
            avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
          },
        })
        this.products = res
      },
      err => {
        console.log(err)
      }
    )
  }

  selectProduct(product:any){
    this.product = product
    this.messages.push({
      reply: true,
      text: product.Product_Name,
      avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      date: new Date(),
      user: {
        name: 'SL chatbot',
        avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      },
    })
    this.messages.push({
      reply: false,
      text: "OK. Please describe what you need help with.",
      avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      date: new Date(),
      user: {
        name: 'SL chatbot',
        avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
      },
    })
  }
  
  getLicense(){
    
  }
}
