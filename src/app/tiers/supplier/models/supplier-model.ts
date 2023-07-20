import { Address } from "src/app/address/address-model";
import { EmailModel } from "src/app/email/email-model";
import { PhoneNumber } from "src/app/phone/phone";
import { BankAccount } from "../../bank-account/bank-model/bank";

export class Supplier {
    id : string;
    name?: string;
    nis?: string;
    nif?: string;
    rc?: string;
    ai?:string;
    disabledReason?: string;
    owner?: string;
    customerState: number;
    activity: number;
    establishmentDate?: Date;
    addresses: Address[];
    phoneNumbers: PhoneNumber[];
    emails: EmailModel[];
    bankAccounts : BankAccount[];
    organizationActivity : string;
}
