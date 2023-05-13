import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends ApiService{

  savequestion(body: any, questionType:string){
    return this.http.post(this.API_URL+'save-question/'+questionType, body, this.httpOptions);
  }

  requestTicket(questionId: number){
    let body = {
      Question_Id: questionId
    }
    return this.http.post(this.API_URL+'request-ticket', body, this.httpOptions);
  }

  completeSession(questionId: number){
    let body = {
      Question_Id: questionId
    }
    return this.http.post(this.API_URL+'complete-session', body, this.httpOptions);
  }
}
