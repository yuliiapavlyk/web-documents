import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localizedDate',
    pure: true
})

export class LocalizedDatePipe implements PipeTransform {


    public transform(value?: Date): any {
        if (value == null) {
            return ' ';
        }
        const options = window.navigator.language;

        const date = new Date(value);

        return date.toLocaleString(options);
    }
}
