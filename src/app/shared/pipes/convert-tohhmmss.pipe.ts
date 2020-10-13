import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTohhmmss'
})
export class ConvertTohhmmssPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    var dateObj = new Date(value * 60 * 1000);
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();
    var seconds = dateObj.getSeconds();

    var timeString = hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
    return timeString;
  }

}
