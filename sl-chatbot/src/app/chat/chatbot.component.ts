import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {QuestionsService} from 'src/app/core/services/questions.service'
import {ProductsService} from 'src/app/core/services/products.service'
import {UsersService} from 'src/app/core/services/users.service'
import {NluService} from 'src/app/core/services/responses/nlu.service'
import {CHATBOT_AVATAR} from "../core/constants/constants"
import {ScoreService} from "../core/services/responses/score.service";
import {LocalstorageService} from "../core/services/localstorage.service";
import {TicketsService} from "../core/services/zendesk/tickets.service";
import {SupportComponent} from "./support/support.component";
import {TicketsComponent} from "./tickets/tickets.component";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../auth/login/login.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pages',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

export class ChatbotComponent implements OnInit {
  @ViewChild(SupportComponent) public sc: SupportComponent | undefined;
  @ViewChild(TicketsComponent) public tc: TicketsComponent | undefined;

  loading = false;

  // Enable/disable user's input
  enabled: boolean = false;
  buttonDisabled: boolean = false;

  // Product view
  removable = true;

  // Products
  products:any = []

  // User data
  location:any = {}
  userId:string = '';
  userIdFlag:boolean = false;
  canScheduleMeetings:boolean = false;

  body:any = {}

  // Chatbot's use
  serviceType:string = ''
  purpose:string = ''

  // Chats
  chats: any[] = [{
    status: 'primary',
    title: 'Shocklogic',
  }]

  // Zendesk
  openTickets: any = [];

  messages: any[] = []


  constructor(
    private questionService: QuestionsService,
    private productsService: ProductsService,
    private scoreService: ScoreService,
    private nluService: NluService,
    private usersService: UsersService,
    private localStorageService: LocalstorageService,
    public dialog: MatDialog,
    public router: Router
    ) {
  }

  ngOnInit(): void {
    this.getLocation() // Get IP address
    this.buildMessage({text: 'Hello, how can I help you?', reply: false, type:'button', customMessageData:'Support'}) // Greeting

    // Ask for user's ID if it's the first time the user visits the page
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
  buildMessage(values: any){
    if(values.type != ""){
      this.messages.push({
        text: values.text,
        type: values.type,
        date: new Date(),
        customMessageData: values.customMessageData,
        reply: values.reply,
        user: {
          avatar: CHATBOT_AVATAR,
        },
      });
    }
    else{
      this.messages.push({
        text: values.text,
        date: new Date(),
        reply: values.reply,
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
          // If the ID is valid, ask the user which product they need help with
          if(auxRes.result != 'error'){
            this.userId = userId
            this.localStorageService.setCurrentItem('userId', userId)
            if(this.serviceType == 'support'){
              this.sc?.getProducts()
            }
            this.userIdFlag = false
          }
          else this.buildMessage({text: "Please provide a valid user's ID"})
        },
        err => {
          console.log(err)
        }
      )
  }

  sendMessage(event: any){
    this.sc?.sendMessage(event)
  }

  setEnabled(enabled: boolean){
    this.enabled = enabled
  }

  setProducts(products: any){
    this.products = products
  }

  setCanScheduleMeetings(canScheduleMeetings: boolean){
    this.canScheduleMeetings = canScheduleMeetings
  }

  setPurpose(purpose: string){
    this.purpose = purpose
  }

  setButtonDisabled(buttonDisabled: boolean){
    this.buttonDisabled = buttonDisabled
  }

  setOpenTickets(openTickets: any){
    this.openTickets = openTickets
  }

  setServiceType(serviceType: any){
    this.serviceType = serviceType
  }

  /**
   * [Start user's support flow]
   * */
  getSupport(){
    this.serviceType = 'support'
    this.buttonDisabled = true
    this.enabled = true
  }

  /**
   * [Start check open tickets flow]
   * */
  getOpenTickets(){
    this.serviceType = 'open_tickets'
    this.buttonDisabled = true
  }

  getLicense(){

  }
}
