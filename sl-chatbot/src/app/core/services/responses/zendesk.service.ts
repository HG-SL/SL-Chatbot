import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZendeskService {

  constructor() { }

  /**
   * [Will send a response based on an existing Zendesk article, it will copy the content from the Zendesk article
   * and link the article to the user (in case they want to check). Will return none if it doesn't find any match.
   *
   * To search, it will first look for the Zendesk articles that contain the nouns in the input, then it will look
   * for the verbs and will return the article that contains all of these]
   * @param {[Object]} keywords [User's input with POS tagging]
   * @return {[string]} [Response]
   * */
  searchResponseInZendesk(keywords: any){

  }
}
