import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService{

  public getProducts(){
    return this.http.get(this.API_URL+'products',  this.httpOptions);
  }

  getFlatFees(product: number){
    return this.http.get(this.API_URL+'get-flat-fee/'+product, this.httpOptions)
  }

  calculatePrice(data: any){
    return this.http.post(this.API_URL + 'get-price', data, this.httpOptions)
  }
}
