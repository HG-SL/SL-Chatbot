import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/core/services/questions.service'
import { ProductsService } from 'src/app/core/services/products.service'
import { UsersService } from 'src/app/core/services/users.service'
import { NluService } from 'src/app/core/services/responses/nlu.service'
import { getTimeFormat } from "../core/utils/date.formatting";
import { CHATBOT_AVATAR } from "../core/constants/constants"
import { Answer } from "../core/interfaces/interfaces";
import { ScoreService } from "../core/services/responses/score.service";
import {LocalstorageService} from "../core/services/localstorage.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})

export class PagesComponent implements OnInit {
  /* Initialize */
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

  currentMessage: string = "";
  currentAnswer: Answer = {
    answer_id: 0,
    question_id: 0
  };
  zendeskMessage: boolean = false;
  messages: any[] = []

  constructor(
    private questionService: QuestionsService,
    private productsService: ProductsService,
    private scoreService: ScoreService,
    private nluService: NluService,
    private usersService: UsersService,
    private localStorageService: LocalstorageService
    ) {
  }

  ngOnInit(): void {
    this.getLocation() // Get IP address
    this.buildMessage('Hello, how can I help you?',false, 'button','Support') // Greeting

    let firstInteraction = this.localStorageService.getCurrentItem('userIdFlag');

    if (firstInteraction == null || firstInteraction == "true") {
      this.userIdFlag = true;
    }
    else {
      this.userIdFlag = false;

      // Get stored userId
      let uId = this.localStorageService.getCurrentItem('userId')
      this.userId = uId != null ? uId : '';
    }
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
  buildMessage(text:string = '', reply:boolean = false, type:string = '', customMessageData:any = ''){
    if(type != ""){
      this.messages.push({
        text: text,
        type: type,
        date: new Date(),
        customMessageData: customMessageData,
        reply: reply,
        user: {
          avatar: CHATBOT_AVATAR,
        },
      });
    }
    else{
      this.messages.push({
        text: text,
        date: new Date(),
        reply: reply,
        user: {
          avatar: CHATBOT_AVATAR,
        },
      });
    }
  }

  /**
   * [Validate that the ID given is an ID that exists in the database]
   * @param {[string]} userId [User's ID]
   * */
  validateUserId(userId:string){
    this.usersService.validateUserId(userId)
    .subscribe(
      res => {
        let auxRes:any = res
        /* If the ID is valid, ask the user which product they need help with */
        if(auxRes.result != 'error'){
          this.userId = userId
          this.localStorageService.setCurrentItem('userId', userId)
          if(this.serviceType == 'support')this.getProducts()
          this.userIdFlag = false
        }
        else this.buildMessage("Please provide a valid user's ID")
      },
      err => {
        console.log(err)
      }
    )
  }

  /**
   * [Event of user sending a message to the chatbot. It will save the question the user makes to the database,
   * if the bot is asking for the user's ID, it will validate that ID first]
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
          Question_Date: getTimeFormat(),
          Question_Type: "Failure"
        }
      }
      // @ts-ignore
      this.questionService.savequestion(this.body, "support").subscribe(({Question_Id, Question_Date, Client_Id}) => {
          let currentQuestion = Question_Id
          let currentQuestionDate = Question_Date
          let currentClient = Client_Id
          /* After saving the question we are going to give answer to that question */
          // @ts-ignore
          this.nluService.processUserInput(currentQuestion, currentQuestionDate, currentClient, this.product.Product_Name, event.message).subscribe(({answer_id, question_id, message, answer_url, zendesk, title}) => {
            this.currentMessage = message;
            this.zendeskMessage = zendesk
            this.currentAnswer.answer_id = answer_id;
            this.currentAnswer.question_id = question_id;

            console.log(answer_id, question_id)

            // If the answer comes from a Zendesk article we are building a message of the type link
            if(zendesk)this.buildMessage(this.currentMessage,false, 'link',{href: answer_url, text: title})
            else this.buildMessage(this.currentMessage,false)

            // Ask the user to qualify the quality of the response
            this.buildMessage('', false, 'custom-score-msg','Support')
          })
        },
        err => {
          console.log(err)
        }
      )
    }
  }



  getSupport(){
    this.serviceType = 'support'
    this.buildMessage('Support',true)

    if (!this.userIdFlag){
      this.getProducts()
    }
    else {
      this.buildMessage('',false,'custom-email-msg',"For a more personalized experience, please introduce your user id")
    }
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

  setAnswerScore(score:number){
    // Reply using the score
    this.buildMessage(score.toString(),true)

    // Set score
    this.scoreService.qualifyAnswer(this.currentAnswer.question_id, this.currentAnswer.answer_id, score).subscribe((res) => {
      // TODO: In case the score is too low (1/2). Ask the user if they want to open a ticket with Zendesk or schedule a meeting

      // Ask the user if they have any other questions
      this.buildMessage('', false, 'custom-retry-msg','Support')
    })
  }

  endSession(){
    this.buildMessage('Have a good day!', false, 'text','Support')
  }

  restartSession(){
    this.buildMessage('Hello, how can I help you?',false, 'button','Support') // Greeting
    this.localStorageService.setCurrentItem('userIdFlag', false);
  }
}
