import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService{

  getUserLocation(){
    return this.http.get(this.LOCATION, this.httpOptions);
  }

  validateUserId(userId:string){
    return this.http.get(this.API_URL+'client/'+userId, this.httpOptions);
  }

  saveEmail(email:string, location:any){
    let body = {
      Client: {
        Client_Email: email,
        User_Agent: window.navigator.userAgent
      },
      Country: {
        Country_Name: location.country
      },
      State: {
        State_Name: location.regionName
      },
      City: {
        City_Name: location.city
      }
    }
    return this.http.post(this.API_URL+'save-email', body, this.httpOptions);
  }
}
