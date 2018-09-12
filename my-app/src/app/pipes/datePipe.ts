
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'localizedDate',
pure:true
})

export class LocalizedDatePipe implements PipeTransform{

    
    public transform(value?: Date): any {
        if (value==null){
            return " ";
        }
        var options =window.navigator.language;     
        var number = new Date(value);
        return number.toLocaleString(options);
     
    }
    
}