import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductsService} from "../../core/services/products.service";
import {max} from "rxjs/operators";
import {LocalstorageService} from "../../core/services/localstorage.service";
import {getTimeFormat} from "../../core/utils/date.formatting";
import {checkingInputEmail} from "../../core/utils/regex.helper";
import {QuestionsService} from "../../core/services/questions.service";
import {AnswerService} from "../../core/services/responses/answer.service";

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements AfterViewInit {
  // Parent's component interaction
  @Output() buildMessage = new EventEmitter<any>();
  @Output() setProducts = new EventEmitter<any>();
  @Output() setFlatFeeOut = new EventEmitter<any>();
  @Output() setFlatFeesParent = new EventEmitter<any>();
  @Output() enable = new EventEmitter<any>();
  @Output() saveEmail = new EventEmitter<any>();
  @Input() emailFlag: any | undefined;
  @Input() email: string | undefined;
  @Input() location: any | undefined;
  // Products
  product:any = {}

  // Product preferences
  flatFees: any = []
  flatFee: any;
  years: any = 0;
  records: any = 0;
  projects: any = 0;
  forms: any = 0;
  members: any = 0;
  option: any = 0;
  floorplans: any = 0;
  days: any = 0;

  // Onsitelogic
  onsitelogic: any = false;
  onsitelogicDays: any = false;

  // Onsitelogic items
  items: any = [
    'laptop or tablet',
    'tablet stand/holder',
    'monitor',
    'wired PC mouse',
    'external USB port',
    'laser printer - laser black & white',
    'laser printer - ink colour',
    'thermal printer - colour',
    'colour badge printer - Epson c3500',
    'extra ink cartridge for the colour badge printer (Epson c3500)',
    'desk barcode/QR-code scanners',
    'plastic cards printer (hire)',
    'self check-in kiosk (hire)',
    'network & equipment (Routers, access points, antenna and antenna bases)',
    'badge paper for laser printer (A6 and double sided)',
    'contingency badge paper for laser printer (A6 and double sided)',
    'plastic badge holders (A6 with perforations in middle and at both ends)',
    'contingency plastic badge holders (A6 with perforations in middle and at both ends)',
    'butterfly badge paper for laser printer',
    'contingency butterfly badge paper for laser printer',
    'plastic cards A7/credit card size',
    'contingency plastic cards A7/credit card size',
    'badge paper for thermal printer',
    'contingency badge paper for thermal printer',
    'branded lanyards']

  selected_items: any = {
    "lts": 0,
    "tsh": 0,
    "mon": 0,
    "wm": 0,
    "eusb": 0,
    "lp": 0,
    "lpi": 0,
    "tp": 0,
    "cb": 0,
    "ei": 0,
    "db": 0,
    "pcp": 0,
    "sck": 0,
    "ntw": 0,
    "bp": 0,
    "cbp": 0,
    "pb": 0,
    "cpb": 0,
    "bplp": 0,
    "cbplp": 0,
    "pca": 0,
    "cpca": 0,
    "bptp": 0,
    "cbptp": 0,
    "bly": 0
  }

  current_item_index = 0;

  result:any = {}

  constructor(private productsService: ProductsService,
              private questionsService: QuestionsService,
              private answerService: AnswerService,
              private localStorageService: LocalstorageService,) { }

  ngAfterViewInit(): void {
    this.buildMessage.emit({text:'License', reply:true})

    // Show product list if it's not needed to ask for email first
    if (!this.emailFlag){
      this.getProducts()
    }
    else {
      this.buildMessage.emit({
        text:'',
        reply:false,
        type:'custom-email-msg',
        customMessageData:"To continue our conversation and provide you with personalized assistance, could you please enter your email address?"
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
          this.buildMessage.emit({reply: false, type: 'custom-products-msg'})
          this.setProducts.emit(res);
        },
        err => {
          console.log(err)
        }
      )
  }

  /**
   * [Get the list of flat fees of a specified product]
   * */
  getFlatFees(productId: number){
    // @ts-ignore
    this.productsService.getFlatFees(productId).subscribe(({fees}) => {
      this.flatFees = fees
      this.setFlatFeesParent.emit(fees)
    })
  }

  /**
   * [After a product is selected, it will prompt the user for specific things that will affect the product's final
   * price depending on the product selected]
   * @param {[any]} product [Selected product]
   * */
  selectProduct(product:any){
    this.product = product
    this.showProductPreferencesForm(product)
  }

  /**
   * [Show the full list of products, this function is going to be triggered on back button click]
   * */
  showProductSelectionForm(product: any){
    if (product.Product_Id == 8){
      this.buildMessage.emit({reply: false, type: 'custom-products-msg'})
    }
  }

  /**
   * [Show a form according to the product selected]
   * @param {[any]} product [Selected product]
   * */
  showProductPreferencesForm(product: any){
    if (product.Product_Id == 2 || product.Product_Id == 4){
      this.showFlatFeeForm(product)
    }
    else if (product.Product_Id == 6 || product.Product_Id == 1 || product.Product_Id == 7 || product.Product_Id == 9){
      this.showYearsForm()
    }
    else if (product.Product_Id == 8){
      this.showOptionsForm()
    }
    else if (product.Product_Id == 10){
      this.showProjectsFeeForm()
    }
  }

  /**
   * [Show custom menu that will show options for flat annual fees on specific products]
   * */
  showFlatFeeForm(product: any){
    // Participantlogic and Abstractlogic
    if (product.Product_Id == 2 || product.Product_Id == 4) {
      this.getFlatFees(product.Product_Id)
      this.buildMessage.emit({reply: false, type: 'custom-flat-fee-view'})
    }
    else if (product.Product_Id == 6 || product.Product_Id == 1){
      this.showYearsForm()
    }
  }

  /**
   * [Show custom menu that will show options for number of members]
   * */
  showMembersForm(){
    this.buildMessage.emit({reply: false, type: 'custom-members-view'})
  }

  /**
   * [Show custom menu that will show options for years of subscription]
   * */
  showYearsForm(){
    this.buildMessage.emit({reply: false, type: 'custom-years-view'})
  }

  /**
   * [Show custom menu that will show options for number of records]
   * */
  showRecordsFeeForm(){
    this.buildMessage.emit({reply: false, type: 'custom-records-view'})
  }

  /**
   * [Show custom menu that will show options for number of projects]
   * */
  showProjectsFeeForm(){
    this.buildMessage.emit({reply: false, type: 'custom-projects-view'})
  }

  /**
   * [Show custom menu that will show options for number of registration forms]
   * */
  showRegistrationForm(){
    this.buildMessage.emit({reply: false, type: 'custom-forms-view'})
  }

  /**
   * [Show custom menu that will show options for license modes]
   * */
  showOptionsForm(){
    this.buildMessage.emit({reply: false, type: 'custom-options-view'})
  }

  /**
   * [Show custom menu that will ask the user if any training is required]
   * */
  showTrainingForm(){
    this.buildMessage.emit({reply: false, type: 'custom-training-view'})
  }

  /**
   * [Show prompt that will ask the user item for hire]
   * */
  showHireForm(index: number){
    let text = 'How many items of ' + this.items[index] + ' would you like to hire? Type 0 if none'
    this.buildMessage.emit({text: text, reply: false})
  }

  /**
   * [Show estimate price after all parameters have been taken]
   * */
  showSubTotalPrice(result: any){
    this.saveStep("Sub-total price", result.final_price.toString())

    let text = ""

    // If some estimates couldn't be calculated precisely it will tell the user which ones are those
    if (result.tbc_value_exists == true){
      text = "The estimate price is " + result.final_price.toString() + ". Keep in mind that this does not include the " +
        "actual prices of " + result.tbc_value.toString()
    }
    else {
      text = "The estimate price is " + result.final_price.toString()
    }
    this.buildMessage.emit({text: text,
      reply: false})
  }

  /**
   * [Receive preferred flat fee amount from the user
   * @param {[flatFee]}
   * ]
   * */
  setFlatFee(flatFee: any){
    this.flatFee = Number(flatFee.replace(/[^0-9.-]+/g,""))
    this.saveStep("Product's flat fee", this.flatFee.toString())

    if (this.product.Product_Id == 2 || this.product.Product_Id == 4){
      this.showYearsForm()
    }
    this.setFlatFeeOut.emit(this.flatFee)
  }

  /**
   * [Receive preferred years of subscription from the user
   * @param {[years]}]
   * */
  setYears(years: any){
    this.years = years
    this.saveStep("For how many years would you like to subscribe?", this.years)

    // In participantlogic there's no record fee if the annual fee is 6K
    if ((this.product.Product_Id == 2 || this.product.Product_Id == 4) && this.flatFee != 6750){
      this.showRecordsFeeForm()
    }
    else if ((this.product.Product_Id == 2 || this.product.Product_Id == 4) && this.flatFee == 6750){
      this.showProjectsFeeForm()
    }
    else if (this.product.Product_Id == 6 || this.product.Product_Id == 8 || this.product.Product_Id == 7){
      this.showMembersForm()
    }
    else if (this.product.Product_Id == 1){
      this.showOptionsForm()
    }
    // Ask the user about items needed to hire
    else if (this.product.Product_Id == 9){
      this.onsitelogic = true;
      this.showHireForm(this.current_item_index)
      this.enable.emit(true)
    }
  }

  /**
   * [Receive preferred number of records from the user
   * @param {[records]}]
   * */
  setRecords(records: any){
    this.records = records
    this.saveStep("Number of records to store", this.records.toString())

    if (this.product.Product_Id == 2 || this.product.Product_Id == 4){
      this.showProjectsFeeForm()
    }
    else if (this.product.Product_Id == 10){
      let data = {
        "Product": this.product.Product_Name,
        "Projects": this.projects,
        "Records": this.records,
        "User": this.localStorageService.getCurrentItem('userId') || this.email,
        "Date": getTimeFormat()
      }
      this.productsService.calculatePrice(data).subscribe((res) => {
        this.result = res;
        this.showSubTotalPrice(this.result)
      })
    }
  }

  /**
   * [Receive preferred number of projects from the user
   * @param {[projects]}]
   * */
  setProjects(projects: any){
    this.projects = projects
    this.saveStep("Number of projects", this.projects.toString())

    if (this.product.Product_Id == 2){
      this.showRegistrationForm()
    }
    else if (this.product.Product_Id == 4){
      this.showTrainingForm()
    }
    else if (this.product.Product_Id == 10){
      this.showRecordsFeeForm()
    }
  }

  /**
   * [Receive preferred number of members/devices from the user
   * @param {[members]}]
   * */
  setMembers(members: any){
    this.members = members
    this.saveStep("Number of members/devices that will use the software", this.members.toString())

    if (this.product.Product_Id == 6){
      let data = {
        "Product": this.product.Product_Name,
        "Years": this.years,
        "Members": this.members,
        "User": this.localStorageService.getCurrentItem('userId') || this.email,
        "Date": getTimeFormat()
      }
      this.productsService.calculatePrice(data).subscribe((res) => {
        this.result = res;
        this.showSubTotalPrice(this.result)
      })
    }
    else if (this.product.Product_Id == 1){
      let data = {
        "Product": this.product.Product_Name,
        "Years": this.years,
        "Devices": this.members,
        "Option": this.option,
        "User": this.localStorageService.getCurrentItem('userId') || this.email,
        "Date": getTimeFormat()
      }
        this.productsService.calculatePrice(data).subscribe((res) => {
        this.result = res;
        this.showSubTotalPrice(this.result)
      })
    }
    else if (this.product.Product_Id == 8){
      let data = {
        "Product": this.product.Product_Name,
        "Option": this.option,
        "Devices": this.members,
        "Members": this.members,
        "User": this.localStorageService.getCurrentItem('userId') || this.email,
        "Date": getTimeFormat()
      }

      this.productsService.calculatePrice(data).subscribe((res) => {
        this.result = res;
        this.showSubTotalPrice(this.result)
      })
    }
    else if (this.product.Product_Id == 7){
      this.showTrainingForm()
    }
  }

  /**
   * [Receive preferred license mode from the user
   * @param {[option]}]
   * */
  setOption(option: any){
    this.option = option
    this.saveStep("License mode (option)", this.option)

    if ((this.product.Product_Id == 1) || (this.product.Product_Id == 8)){
      this.showMembersForm()
    }
  }

  /**
   * [Receive either preferred number of registration forms or if any training is required
   * @param {[forms]}]
   * */
  setForms(forms: any){
    this.forms = forms
    this.saveStep("Number of registration forms required or if any training is required", this.forms)

    if (this.product.Product_Id == 2 || this.product.Product_Id == 4){
      let data = {
        "Product": this.product.Product_Name,
        "Years": this.years,
        "Flat": this.flatFee,
        "Records": this.records,
        "Projects": this.projects,
        "Forms": this.forms,
        "User": this.localStorageService.getCurrentItem('userId') || this.email,
        "Date": getTimeFormat()
      }
      this.productsService.calculatePrice(data).subscribe((res) => {
        this.result = res;
        this.showSubTotalPrice(this.result)
      })
    }

    else if (this.product.Product_Id == 7){
      this.enable.emit(true)
      this.buildMessage.emit({text:"How many floorplans do you need? Type 0 if you do not need any", reply:false})
    }
  }

  /**
   * [Receive preferred number of floorplans from the user
   * @param {[floorplans]}]
   * */
  setFloorplans(floorplans: any){
    this.floorplans = floorplans
    this.saveStep("Number of floorplans", this.floorplans.toString())

    let data = {
      "Product": this.product.Product_Name,
      "Years": this.years,
      "Members": this.members,
      "Forms": this.forms,
      "Floorplans": parseInt(this.floorplans),
      "User": this.localStorageService.getCurrentItem('userId') || this.email,
      "Date": getTimeFormat()
    }
    this.productsService.calculatePrice(data).subscribe((res) => {
      this.result = res;
      this.showSubTotalPrice(this.result)
    })
  }

  // TODO: Don't ask for email if there's already an userID in localstorage
  saveStep(step: string, amount: any){
    let body = {
      Client: {
        Client_Email: this.email,
        User_Agent: window.navigator.userAgent,
        User_Id: null
      },
      Organization: {

      },
      Product: {
        Product_Id: this.product.Product_Id,
        Product_Name: this.product.Product_Name
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
        Description: step,
        FK_Product_Id: this.product.Product_Id,
        Question_Date: getTimeFormat(),
        Channel: "Webpage"
      }
    }

    // @ts-ignore
    this.questionsService.savequestion(body, "sales").subscribe(({Question_Id, Question_Date, Client_Id}) => {
      let body_answer = {
        Question_Id: Question_Id,
        Question_Date: Question_Date,
        Client_Id: Client_Id,
        Amount: amount
      }

      this.answerService.saveAnswerProduct(body_answer)
        .subscribe((res) => {
      })
    })
  }

  /**
   * [Validate and process message that is sent by the user
   * @param {[event]}]
   * */
  sendMessage(event: any){
    this.buildMessage.emit({text:event.message, reply:true})

    // Receive and verify email given
    if(this.emailFlag){
      if (checkingInputEmail(event.message)) {
        this.saveEmail.emit(event.message)
        this.enable.emit(false)
      }
      else this.buildMessage.emit({text:"Please introduce a valid email"})
    }

    // Other inputs
    else if(!this.emailFlag && this.email != ''){
      if (isNaN(event.message)){
        this.buildMessage.emit({text:"Value must be numeric. Please try again"})
      }
      else {
        if (!this.onsitelogic && !this.onsitelogicDays){
          this.setFloorplans(event.message)
        }
        // Onsitelogic for hire items
        else if (this.onsitelogic && !this.onsitelogicDays){
          Object.entries(this.selected_items).forEach(([key, value], index) => {
            if (this.current_item_index == index){
              this.selected_items[key] = parseInt(event.message)
              this.saveStep(this.items[index], parseInt(event.message))
            }
          });
          this.current_item_index += 1

          // Item for fire
          if (this.current_item_index < this.items.length){
            this.showHireForm(this.current_item_index)
          }
          else {
            this.onsitelogicDays = true

            // Ask for how many days they will hire
            this.buildMessage.emit({text: 'How many days will the event last? Type 0 if not sure', reply: false})
          }
        }

        else if (this.onsitelogic && this.onsitelogicDays){
          this.days = parseInt(event.message)
          this.onsitelogicDays = false
          this.onsitelogic = false

          if (this.days == 0){
            this.days = "TBC"
          }

          let data = {
            "Product": this.product.Product_Name,
            "Years": this.years,
            "Items": this.selected_items,
            "Days": this.days,
            "User": this.localStorageService.getCurrentItem('userId') || this.email,
            "Date": getTimeFormat()
          }

          this.productsService.calculatePrice(data).subscribe((res) => {
            this.result = res;
            this.showSubTotalPrice(this.result)
            this.enable.emit(false)
          })
        }
      }
    }
  }

}
