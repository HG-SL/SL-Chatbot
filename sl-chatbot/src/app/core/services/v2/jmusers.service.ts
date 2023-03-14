import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";

@Injectable({
  providedIn: 'root'
})
export class JMusersService extends ApiService {
  /**
   * [Determines if an user has enough permissions to schedule a meeting with a support agent using Google Calendar]
   * @param {[any]} userId [User's ID]
   * @return {[any]} [Response]
   * */
  checkSchedulingPermissions(userId: any){
    let body = {
      User_Id: userId
    }
    return this.http.post(this.API_URL+'check-user-perms', body, this.httpOptions)
  }
}
