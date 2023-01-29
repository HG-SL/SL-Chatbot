import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/core/services/questions.service'
import { ProductsService } from 'src/app/core/services/products.service'
import { UsersService } from 'src/app/core/services/users.service'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  loading = false;
  products:any = []
  product:any = {}
  location:any = {}
  clientEmail:string = '';
  body:any = {}
  removable = true;
  emailFlag:boolean = false;
  // messages: any[];
  chats: any[] = [{
    status: 'primary',
    title: 'Shocklogic',
  }]

  messages: any[] = []

  constructor(
    private questionService: QuestionsService,
    private productsService: ProductsService,
    private usersService: UsersService
    ) {
  }

  ngOnInit(): void {
    this.getLocation()
    this.buildMessage('Hello how can I help you?',false,'custom-email-msg',"For a more personalized experience, please introduce your email")
    this.emailFlag = true
  }

  getLocation(){
    this.usersService.getUserLocation()
    .subscribe(
      res => { 
        this.location = res
      },
      err => {
        console.log(err)
      }
    )
  }

  buildMessage(text:string = '', reply:boolean = false, type:string = '', customMessageData:string = ''){
    if(type != ""){
      this.messages.push({
        text: text,
        type: type,
        date: new Date(),
        customMessageData: customMessageData,
        reply: reply,
        user: {
          avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
        },
      });
    }
    else{
      this.messages.push({
        text: text,
        date: new Date(),
        reply: reply,
        user: {
          avatar: 'https://theme.zdassets.com/theme_assets/1299963/42d732715e6bb358b56da2f15f476f6811138b40.png',
        },
      });
    }
  }

  checkingInputEmail(email:string){
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm.test(email)){
      return true;
    }
    else{
      return false;
    }
  }

  chatbotResponse(body:any){
    
  }

  sendMessage(event:any) {
    this.buildMessage(event.message,true)
    if(this.emailFlag){
      if(this.checkingInputEmail(event.message)){
        this.clientEmail = event.message
        this.buildMessage('',false,'button','Support')
        this.emailFlag = false
      }
      else{
        this.buildMessage('Please introduce a valid email')
      }
    }
  }

  getSupport(){
    this.buildMessage('Support',true)
    this.productsService.getProducts()
    .subscribe(
      res => {
        this.buildMessage('',false,'custom-products-msg','Please select the product you have any questions about')
        this.products = res
      },
      err => {
        console.log(err)
      }
    )
  }

  selectProduct(product:any){
    this.product = product
    this.buildMessage(product.Product_Name,true)
    this.buildMessage("Ok. Please describe what you need help with.",false)
    this.emailFlag = true
  }
  
  getLicense(){
    
  }
}
