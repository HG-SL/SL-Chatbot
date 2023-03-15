import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {getTimeFormat} from "../../core/utils/date.formatting";
import {ProductsService} from "../../core/services/products.service";
import {UsersService} from "../../core/services/users.service";
import {Answer} from "../../core/interfaces/interfaces";
import {LocalstorageService} from "../../core/services/localstorage.service";
import {QuestionsService} from "../../core/services/questions.service";
import {NluService} from "../../core/services/responses/nlu.service";
import {ScoreService} from "../../core/services/responses/score.service";
import {JMusersService} from "../../core/services/v2/jmusers.service";


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements AfterViewInit {
  // Parent's component interaction
  @Output() buildMessage = new EventEmitter<any>();
  @Output() enable = new EventEmitter<any>();
  @Output() setProducts = new EventEmitter<any>();
  @Output() validateUserId = new EventEmitter<any>();
  @Output() setCanScheduleMeetings = new EventEmitter<any>();
  @Output() setPurpose = new EventEmitter<any>();
  @Input() userIdFlag: boolean | undefined;
  @Input() userId: string | undefined;
  @Input() location: any | undefined;

  // For requests
  body:any = {}

  // Products
  product:any = {}

  // Zendesk
  zendeskMessage: boolean = false;

  currentMessage: string = "";

  currentAnswer: Answer = {
    answer_id: 0,
    question_id: 0
  };


  constructor(private productsService: ProductsService,
              private usersService: UsersService,
              private localStorageService: LocalstorageService,
              private questionService: QuestionsService,
              private nluService: NluService,
              private scoreService: ScoreService,
              private JMusersService: JMusersService) { }

  ngAfterViewInit(): void {
    this.buildMessage.emit({text:'Support', reply:true})

    if (!this.userIdFlag){
      this.getProducts()
    }
    else {
      this.buildMessage.emit({
        text:'',
        reply:false,
        type:'custom-email-msg',
        customMessageData:"For a more personalized experience, please introduce your user id"
      })
    }
  }

  /**
   * [Get the list of Shocklogic products available for support so the user can select the one they need help with]
   * */
  getProducts(){
    this.productsService.getProducts()
      .subscribe(
        res => {
          this.buildMessage.emit(
            {text:'',
              reply:false,
              type:'custom-products-msg',
              customMessageData:'Please select the product you have any questions about'
            })
          this.setProducts.emit(res);
          this.enable.emit(false)
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
    this.buildMessage.emit({text:event.message, reply:true})
    if(this.userIdFlag){
      this.validateUserId.emit(event.message)
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
            this.enable.emit(false)

            // If the answer comes from a Zendesk article we are building a message of the type link
            if (zendesk) {
              this.buildMessage.emit({text:this.currentMessage, reply:false, type:'link',
                customMessageData:{href: answer_url, text:title}
              })

              this.setPurpose.emit('zendesk_article')
            }
            else this.buildMessage.emit({text:this.currentMessage, reply:false})

            // TODO: When open ticket option is clicked, give the URL to open the ticket
          })
        },
          (err: any) => {
          console.log(err)
        }
      )
    }
  }


  /**
   * [Prompts the user for a question about the product they selected]
   * @param {[any]} product [Selected product]
   * */
  selectProduct(product:any){
    this.product = product
    this.buildMessage.emit({text: product.Product_Name,reply: true})
    this.buildMessage.emit({text: "Ok. Please describe what you need help with.", reply: false})
    this.enable.emit(true)
  }


  /**
   * [Reply to the bot using the score that the user gave]
   * @param {[any]} product [Selected product]
   * */
  getQualification(){
    this.buildMessage.emit({text: "Done", reply: true})
    this.buildMessage.emit({text: '', reply: false, type: 'custom-score-msg', customMessageData: 'Support'})
  }


  /**
   * [Score the quality of an answer]
   * @param {[score]} number [Score]
   * */
  setAnswerScore(score:number){
    // Reply using the score
    this.buildMessage.emit({text: score.toString(), reply: true})

    // Ask the user if he wants to open ticket on zendesk or schedule a meeting

    // Set score
    this.scoreService.qualifyAnswer(this.currentAnswer.question_id, this.currentAnswer.answer_id, score).subscribe((res) => {
      // If score is below 3, give the user other options to help them with their issue
      if (score < 3){
        // Determine if the user is allowed to schedule meetings
        // @ts-ignore
        this.JMusersService.checkSchedulingPermissions(this.userId).subscribe(({allowed}) => {
          this.setCanScheduleMeetings.emit(allowed)
        })

        this.buildMessage.emit({text: '', reply: false, type: 'custom-options-msg', customMessageData: 'Support'})
      }
      else {
        // Ask the user if they have any other questions
        this.buildMessage.emit({text: '', reply: false, type: 'custom-retry-msg', customMessageData: 'Support'})
      }
    })
  }

  /**
   * [Gives the user a link to open a support ticket on zendesk]
   * */
  openZendeskTicket(){
    let href = "https://shocklogic.zendesk.com/hc/en-us/requests/new"
    this.buildMessage.emit({text: '', reply: false, type: 'link',
      customMessageData: {href: href, text: "Click here to open a support ticket"}})

    this.setPurpose.emit('open_ticket')
  }


  scheduleMeeting(){

  }

  /**
   * [Farewell message to the user]
   * */
  endSession(){
    this.buildMessage.emit({text: 'Have a good day!', reply: false, type: 'text', customMessageData: 'Support'})
  }

  /**
   * [Restart process]
   * */
  restartSession(){
    this.buildMessage.emit({text: 'Hello, how can I help you?', reply: false, type: 'button', customMessageData: 'Support'}) // Greeting
    this.localStorageService.setCurrentItem('userIdFlag', false);
  }

  /**
   * [Execute a function after clicking a link depending on where in the user's flow it is]
   * @param {[string]} purpose [Purpose of the given link]
   * */
  linkClick(purpose: string){
    if (purpose == 'zendesk_article'){
      this.getQualification()
    }
    else if (purpose == 'open_ticket'){
      this.endSession()
    }
  }
}
