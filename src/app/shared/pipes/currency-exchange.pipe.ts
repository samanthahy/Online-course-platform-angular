import {Pipe, PipeTransform} from "@angular/core";


const rates = new Map([ ['USD',1], ['CNY', 6.93], ['JPY', 134.34] ] );           // array of entries
@Pipe({
  name: 'currencyExchange'
})

export class CurrencyExchangePipe implements PipeTransform {
  transform(price: number, currencyCode: string) : number {
    return price * (rates.get(currencyCode) || 1);
  }
}
