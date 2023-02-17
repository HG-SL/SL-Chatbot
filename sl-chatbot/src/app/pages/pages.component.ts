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
  userId:string = '';
  body:any = {}
  removable = true;
  userIdFlag:boolean = false;
  serviceType:string = ''
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
    this.buildMessage('Hello how can I help you?',false, 'button','Support')
    this.userIdFlag = true
  }

  /**
   * [Get IP address and location from user]
   * */
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

  /**
   * [Show chatbot's response to user]
   * @param {[string]} text [Message's content]
   * @param {[boolean]} reply [Defines if the message is a reply of another]
   * @param {[string]} type [Message's type]
   * @param {[string]} customMessageData [Custom message that can be sent from the bot once a type is assigned]
   * */
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

  /**
   * @deprecated [Checks if an email has regex of an email, we won't ask for email anymore]
   * */
  checkingInputEmail(email:string){
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm.test(email)){
      return true;
    }
    else{
      return false;
    }
  }

  validateUserId(userId:string){
    this.usersService.validateUserId(userId)
    .subscribe(
      res => {
        let auxRes:any = res
        if(auxRes.result != 'error'){
          this.userId = userId
          if(this.serviceType == 'support')this.getProducts()
          this.userIdFlag = false
        }
        else this.buildMessage('Introduce a valid user id')
      },
      err => {
        console.log(err)
      }
    )
  }

  chatbotResponse(body:any){

  }

  /**
   * [Event of user sending a message to the chatbot. It will save the question the user makes to the database]
   * @param {[any]} event [Message's event]
   * */
  sendMessage(event:any) {
    this.buildMessage(event.message,true)
    if(this.userIdFlag){
      this.validateUserId(event.message)
    }
    else if(!this.userIdFlag && this.userId != ''){
      this.body = {
        Client: {
          User_Id: this.userId,
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

  /**
   * [Format Date to string]
   * */
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
    this.serviceType = 'support'
    this.buildMessage('Support',true)
    this.buildMessage('',false,'custom-email-msg',"For a more personalized experience, please introduce your user id")
  }

  /**
   * [Get the list of Shocklogic products available for support so the user can select the one they need help with]
   * */
  getProducts(){
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

  /**
   * [Prompts the user for a question about the product they selected]
   * @param {[any]} product [Selected product]
   * */
  selectProduct(product:any){
    this.product = product
    this.buildMessage(product.Product_Name,true)
    this.buildMessage("Ok. Please describe what you need help with.",false)
  }

  getLicense(){

  }
}
