import { Injectable } from '@angular/core';
import { ApiService } from '../api.service'

@Injectable({
  providedIn: 'root'
})
export class NluService extends ApiService {

  /**
   * [Will clean up user's input for a proper response generation]
   * @param {[string]} input [User's input]
   * @return {[Object]} [User's input with POS tagging]
   * */
  processUserInput(product: string, input: string){
    let body = {
      product: product,
      input: input
    }

    return this.http.post(this.API_URL+'generate-answer', body, this.httpOptions);
  }
}
