import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";

@Injectable({
  providedIn: 'root'
})
export class ScoreService extends ApiService {

  /**
   * [Will assign the user's score to the answer given by the chatbot]
   * @param {[string]} questionId [Question's ID]
   * @param {[answerId]} answerId [Answer's ID]
   * @param {[score]} score [User's score]
   * @return {[Object]} [Status of the HTTP request]
   * */
  qualifyAnswer(questionId: any, answerId: any, score: number){
    let body = {
      "Answer_Id": answerId,
      "FK_Question_Id": questionId,
      "Qualification": score
    }

    return this.http.put(this.API_URL+'score-answer', body, this.httpOptions);
  }
}
