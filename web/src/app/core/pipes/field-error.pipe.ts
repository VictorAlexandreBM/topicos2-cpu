import {input, Pipe, PipeTransform} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GLOBAL_ERROR_MAP} from '../global-error-map';

@Pipe({ name: 'fieldError', pure: false })
export class FieldErrorPipe implements PipeTransform {
  transform(control: FormControl, localMap?: {[key: string]: (args?: any) => string}): string | null {
    console.log(control);
    if (control.errors === null || !control.touched) return null;
    console.log(control.errors);
    const [key, value] = Object.entries(control.errors)[0];

    const fn = localMap?.[key] ?? GLOBAL_ERROR_MAP[key];
    return fn ? fn(value) : 'Campo inválido';
  }
}
