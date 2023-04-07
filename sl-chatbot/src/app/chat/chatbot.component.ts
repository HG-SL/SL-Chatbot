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
import {findSpecificItem} from "../core/utils/array.helper";
import {JMusersService} from "../core/services/v2/jmusers.service";
import {LicenseComponent} from "./license/license.component";

@Component({
  selector: 'app-pages',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

export class ChatbotComponent implements OnInit {
  @ViewChild(SupportComponent) public sc: SupportComponent | undefined;
  @ViewChild(TicketsComponent) public tc: TicketsComponent | undefined;
  @ViewChild(LicenseComponent) public lc: LicenseComponent | undefined;

  loading = false;

  // Enable/disable user's input
  enabled: boolean = false;
  buttonDisabled: boolean = false;

  // Product view
  removable = true;

  // Products
  products:any = []
  product:any;

  // Fees
  flatFees:any = []
  yearList: any = [
    {"years": "1 year", "value": 1},
    {"years": "2 years", "value": 2},
    {"years": "More than 2 years", "value": "TBC"}
  ]

  // Estimates
  recordList: any = [
    {"records": "1-100", "value": 50},
    {"records": "101-200", "value": 150},
    {"records": "201-3999", "value": 2000},
    {"records": "4000+", "value": 4000}
  ]
  projectList: any = [
    {"projects": "1-100", "value": 50},
    {"projects": "101-200", "value": 150},
    {"projects": "200-3999", "value": 500}
  ]
  formList: any = [
    {"forms": "No forms", value: 0},
    {"forms": "1 form", "value": 1},
    {"forms": "2 forms", "value": 2},
    {"forms": "3 forms", "value": 3},
    {"forms": "More than 3", "value": "TBC"}
  ]
  memberList: any = [
    {"members": "1-100", "value": 50},
    {"members": "101-200", "value": 150},
    {"members": "201+", "value": 201}
  ]

  // User data
  location:any = {}
  userId:any = '';
  userIdFlag:boolean = false;
  emailFlag:any = "";
  canScheduleMeetings:boolean = false;
  token:string | null = '';
  email:any = '';

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

  // Prefs
  flatFee: any = 0;


  constructor(
    private questionService: QuestionsService,
    private productsService: ProductsService,
    private scoreService: ScoreService,
    private nluService: NluService,
    private usersService: UsersService,
    private localStorageService: LocalstorageService,
    private JMUsersService: JMusersService
    ) {
  }

  ngOnInit(): void {
    this.getLocation() // Get IP address
    this.buildMessage({text: 'Hello, how can I help you?', reply: false, type:'button', customMessageData:'Support'}) // Greeting

    // Ask for user's ID if it's the first time the user visits the page
    let firstInteraction = this.localStorageService.getCurrentItem('userIdFlag');
    this.emailFlag = this.localStorageService.getCurrentItem('userId');
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

  /**
   * [Save the email given by any user registered or not]
   * @param {[string]} email [Client_Email]
   * */
  saveEmail(email:string){
    this.usersService.saveEmail(email, this.location)
      .subscribe(
        res => {
          let auxRes:any = res
          // If the ID is valid, ask the user which product they need help with
          if(auxRes.result != 'error'){
            this.email = email
            if(this.serviceType == 'buy_license'){
              this.lc?.getProducts()
            }
            this.emailFlag = false
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  sendMessage(event: any){
    if (this.serviceType == 'support'){
      this.sc?.sendMessage(event)
    }
    else if (this.serviceType == 'buy_license'){
      this.lc?.sendMessage(event)
    }
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

  setFlatFees(flatFees: any){
    this.flatFees = flatFees
  }

  setFlatFee(flatFee: any){
    this.flatFee = flatFee
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
   * [Start check open tickets flow, user will only be able to visualize tickets if they are logged on]
   * */
  getOpenTickets(){
    this.token = this.localStorageService.getCurrentItem('token')
    this.userId = this.localStorageService.getCurrentItem('userId')

    // Get user's email in JM_User table
    if (this.userId){
      // @ts-ignore
      this.JMUsersService.getEmail(this.userId).subscribe(({email}) => {
        this.email = email;
        this.serviceType = 'open_tickets'
        this.buttonDisabled = true
      })
    }
    else {
      this.serviceType = 'open_tickets'
    }
  }

  /**
   * [Go back to main menu]
   * */
  getMainMenu(){
    this.buildMessage({text: 'Hello, how can I help you?', reply: false, type:'button', customMessageData:'Support'}) // Greeting
    this.buttonDisabled = false
    findSpecificItem("how can I", this.messages)
    this.serviceType = ''
  }

  /**
   * [Buy license]
   * */
  getLicense(){
    this.serviceType = 'buy_license'
    this.buttonDisabled = true
    this.enabled = true
    this.emailFlag = this.localStorageService.getCurrentItem('userId')
  }

  /**
   * [Product selection event]
   * */
  selectProduct(product: any){
    this.product = product
    if (this.serviceType == 'support'){
      this.sc?.selectProduct(product)
    }
    else if (this.serviceType == 'buy_license'){
      this.lc?.selectProduct(product)
    }
  }
}

// TODO: For projects we have to ask how many projects are planned to be used: 1, 2 or more than 2 (TBC)
