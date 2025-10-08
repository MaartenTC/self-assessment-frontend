import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'TimestampAsDateStringPipe',
})
export class TimestampAsDateStringPipe implements PipeTransform {
  transform(timestamp: number): string{
        return new Date(timestamp * 1000).toLocaleString("nl-NL");
  }
}
