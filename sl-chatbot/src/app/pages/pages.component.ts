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
    else{
      this.body = {
        Client: {
            Client_Email: this.clientEmail,
            User_Agent: window.navigator.userAgent
        },
        Organization: {},
        Product: {
          Product_Id: this.product.Product_Id,
          Product_Name: this.product.Product_Name,
          Section_Id: this.product.Section_Id
        },
        Country: {
          Country_Name: this.location.country
        },
        State: {
          State_Name: this.location.regionName
        },
        City: {
          City_Name: this.location.city
        },
        Question: {
          Description: event.message,
          Question_Date: this.getTimeFormat(),
          Question_Type: "Failure"
        }
      }
      this.questionService.savequestion(this.body, "support")
      .subscribe(
        res => {
          console.log(res)
        },
        err => {
          console.log(err)
        }
      )
    }
  }

  getTimeFormat(){
    let d = new Date();

    let year;
    let month;
    let day;
    let hour;
    let minutes;
    let seconds;

    year = d.getFullYear();

    let months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

    month = months[d.getMonth()];

    if(d.getDate() <= 9){
      day = "0"+d.getDate();
    }
    else{
      day = d.getDate();
    }

    if(d.getHours() <= 9){
      hour = "0"+d.getHours();
    }
    else{
      hour = d.getHours();
    }

    if(d.getMinutes() <= 9){
      minutes = "0"+d.getMinutes();
    }
    else{
      minutes = d.getMinutes();
    }

    if(d.getSeconds() <= 9){
      seconds = "0"+d.getSeconds();
    }
    else{
      seconds = d.getSeconds();
    }
    return year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
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
  }
  
  getLicense(){
    
  }
}
