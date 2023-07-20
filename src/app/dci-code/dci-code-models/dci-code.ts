import { Dosage } from './../../dosage/models/dosage';
import { Dci } from './../../dci/dci-models/dci';

export class DciCode {
    public id : string;
    public name :string;
    public formId : string;
    public formName : string;
    public innCodeDosages :InnCodeDosage[];
}
export class InnCodeDosage {
 public innCodeId : string;
 public innId: string;
 public dosageId : string; 
 public inn : Dci;
 public dosage : Dosage  
}