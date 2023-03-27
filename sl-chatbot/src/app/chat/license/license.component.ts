import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductsService} from "../../core/services/products.service";
import {max} from "rxjs/operators";

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements OnInit {
  // Parent's component interaction
  @Output() buildMessage = new EventEmitter<any>();
  @Output() setProducts = new EventEmitter<any>();
  @Output() setFlatFeeOut = new EventEmitter<any>();
  @Output() setFlatFeesParent = new EventEmitter<any>();
  @Output() enable = new EventEmitter<any>();

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

  result:any = {}

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.getProducts()
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
   * [Show a form according to the product selected]
   * @param {[any]} product [Selected product]
   * */
  showProductPreferencesForm(product: any){
    if (product.Product_Id == 2){
      this.showFlatFeeForm(product)
    }
    else if (product.Product_Id == 6 || product.Product_Id == 1 || product.Product_Id == 7){
      this.showYearsForm()
    }
    else if (product.Product_Id == 8){
      this.showOptionsForm()
    }
  }

  showFlatFeeForm(product: any){
    // Participantlogic
    if (product.Product_Id == 2){
      this.getFlatFees(product.Product_Id)
      this.buildMessage.emit({reply: false, type: 'custom-flat-fee-view'})
    }
    else if (product.Product_Id == 6 || product.Product_Id == 1){
      this.showYearsForm()
    }
  }

  showMembersForm(){
    this.buildMessage.emit({reply: false, type: 'custom-members-view'})
  }

  showYearsForm(){
    this.buildMessage.emit({reply: false, type: 'custom-years-view'})
  }

  showRecordsFeeForm(){
    this.buildMessage.emit({reply: false, type: 'custom-records-view'})
  }

  showProjectsFeeForm(){
    this.buildMessage.emit({reply: false, type: 'custom-projects-view'})
  }

  showRegistrationForm(){
    this.buildMessage.emit({reply: false, type: 'custom-forms-view'})
  }

  showOptionsForm(){
    this.buildMessage.emit({reply: false, type: 'custom-options-view'})
  }

  showTrainingForm(){
    this.buildMessage.emit({reply: false, type: 'custom-training-view'})
  }

  showSubTotalPrice(result: any){
    let text = ""
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

  setFlatFee(flatFee: any){
    this.flatFee = Number(flatFee.replace(/[^0-9.-]+/g,""))
    if (this.product.Product_Id == 2){
      this.showYearsForm()
    }
    this.setFlatFeeOut.emit(this.flatFee)
  }

  setYears(years: any){
    this.years = years
    // In participantlogic there's no record fee if the annual fee is 6K
    if (this.product.Product_Id == 2 && this.flatFee != 6750){
      this.showRecordsFeeForm()
    }
    else if (this.product.Product_Id == 2 && this.flatFee == 6750){
      this.showProjectsFeeForm()
    }
    else if (this.product.Product_Id == 6 || this.product.Product_Id == 8 || this.product.Product_Id == 7){
      this.showMembersForm()
    }
    else if (this.product.Product_Id == 1){
      this.showOptionsForm()
    }
  }

  setRecords(records: any){
    this.records = records
    if (this.product.Product_Id == 2){
      this.showProjectsFeeForm()
    }
  }

  setProjects(projects: any){
    this.projects = projects
    if (this.product.Product_Id == 2){
      this.showRegistrationForm()
    }
  }

  setMembers(members: any){
    this.members = members
    if (this.product.Product_Id == 6){
      let data = {
        "Product": this.product.Product_Name,
        "Years": this.years,
        "Members": this.members
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
        "Option": this.option
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
        "Members": this.members
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

  setOption(option: any){
    this.option = option
    if ((this.product.Product_Id == 1) || (this.product.Product_Id == 8)){
      this.showMembersForm()
    }
  }

  setForms(forms: any){
    this.forms = forms

    if (this.product.Product_Id == 2){
      let data = {
        "Product": this.product.Product_Name,
        "Years": this.years,
        "Flat": this.flatFee,
        "Records": this.records,
        "Projects": this.projects,
        "Forms": this.forms
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

  setFloorplans(floorplans: any){
    this.floorplans = floorplans
    let data = {
      "Product": this.product.Product_Name,
      "Years": this.years,
      "Members": this.members,
      "Forms": this.forms,
      "Floorplans": parseInt(this.floorplans)
    }
    this.productsService.calculatePrice(data).subscribe((res) => {
      this.result = res;
      this.showSubTotalPrice(this.result)
    })
  }

  sendMessage(event: any){
    this.buildMessage.emit({text:event.message, reply:true})
    if (isNaN(event.message)){
      this.buildMessage.emit({text:"Floorplans must have a numeric value. Please try again"})
    }
    else {
      this.enable.emit(false)
      this.setFloorplans(event.message)
    }
  }

}
