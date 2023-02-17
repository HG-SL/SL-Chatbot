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
}
