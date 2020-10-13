import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTohhmmss'
})
export class ConvertTohhmmssPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
