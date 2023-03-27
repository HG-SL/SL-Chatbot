import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";

@Injectable({
  providedIn: 'root'
})
export class TicketsService extends ApiService{

  getOpenTickets(email: string){
    let body = {
      email: email
    }

    return this.http.post(this.API_URL+'get-tickets', body, this.httpOptions);
  }
}
