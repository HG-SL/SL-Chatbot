import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends ApiService{

  savequestion(body: any, questionType:boolean){
    return this.http.post(this.API_URL+'save-question/'+questionType, body, this.httpOptions);
  }
}
