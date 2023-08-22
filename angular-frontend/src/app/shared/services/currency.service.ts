import {Injectable} from "@angular/core";

@Injectable({
  // angular 6 new feature, works the same as adding service to providers array
  providedIn: 'root'
})

export class CurrencyService {
  currencyCode: string = "USD";

}
