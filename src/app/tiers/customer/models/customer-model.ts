import { Address } from "src/app/address/address-model";
import { EmailModel } from "src/app/email/email-model";
import { PhoneNumber } from "src/app/phone/phone";
import { BankAccount } from "../../bank-account/bank-model/bank";

export class Customer {
    id : string;
    name?: string;
    nis?: string;
    nif?: string;
    rc?: string;
    ai?:string;
    disabledReason?: string;
    owner?: string;
    organizationStatus: number;
    activity: number;
    organizationActivity : string;
    organizationState : string;
    establishmentDate?: Date;
    addresses: Address[];
    phoneNumbers: PhoneNumber[];
    emails: EmailModel[];
    bankAccounts : BankAccount[];
    eCommerce : boolean;
    code : string;
    organizationId: string;
    customerGroup : string;
    organizationGroupCode: string;
}