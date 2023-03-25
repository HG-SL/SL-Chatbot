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
  @Output() setFlatFeesParent = new EventEmitter<any>();

  // Products
  product:any = {}

  // Product preferences
  flatFees: any = []
  flatFee: any;

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
      console.log(fees)
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
  }

  showFlatFeeForm(product: any){
    // Participantlogic
    if (product.Product_Id == 2){
      this.getFlatFees(product.Product_Id)
      this.buildMessage.emit({reply: false, type: 'custom-flat-fee-view'})
    }
  }

  setFlatFee(flatFee: any){
    this.flatFee = Number(flatFee.replace(/[^0-9.-]+/g,""))
  }

}
