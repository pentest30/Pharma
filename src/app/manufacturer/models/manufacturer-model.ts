import { EmailModel } from './../../email/email-model';
import { Address } from 'src/app/address/address-model';
import {  PhoneNumber } from 'src/app/phone/phone';


export interface Manufacturer {
  name : string;
  code : string;
  addresses : Address[],
  phoneNumbers : PhoneNumber[],
  emais :EmailModel[],
  id : string;

}