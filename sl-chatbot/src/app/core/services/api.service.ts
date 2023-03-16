import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = environment.apiUrl;
  LOCATION = environment.locationUrl;
  V1_URL = environment.v1ApiUrl;
  TOKEN_APP = environment.tokenApp

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  constructor(protected http: HttpClient) { }
}
