import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NluService {

  constructor() { }

  /**
   * [Will clean up user's input for a proper response generation]
   * @param {[string]} input [User's input]
   * @return {[Object]} [User's input with POS tagging]
   * */
  processUserInput(input: string){

  }
}
