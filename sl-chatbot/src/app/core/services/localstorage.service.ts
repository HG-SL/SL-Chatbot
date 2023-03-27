import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getCurrentItem(item: string){
    return localStorage.getItem(item) != null ? localStorage.getItem(item) : null;
  }

  setCurrentItem(item: string, value: any){
    localStorage.setItem(item, value)
  }
}
