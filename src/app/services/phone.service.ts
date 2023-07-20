import { CountryCode } from './../phone/country-code';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class PhoneService {
      constructor(private httpClient :HttpClient){

      }
      getCountryCodes(): Observable<CountryCode[]>  {
       
        return this.httpClient.get<CountryCode[]>('assets/data/CountryCodes.json');
    
        
    } 

  }