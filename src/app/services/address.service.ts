
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../address/country';

@Injectable({
    providedIn: 'root'
  })
  export class AddressService {
      constructor(private httpClient :HttpClient){

      }
      getCountries(): Observable<Country[]>  {
       
        return this.httpClient.get<Country[]>('assets/data/countries.min.json');
    
        
    } 

  }