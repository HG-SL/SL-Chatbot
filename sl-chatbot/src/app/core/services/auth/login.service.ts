import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ApiService {
  login(user: any){
    let httpOptions = {
      headers: new HttpHeaders({
        'Token-App': this.TOKEN_APP
      })
    }

    return this.http.post(this.V1_URL+'NONE-NONE-2-/User/login/', user, httpOptions);
  }

}
