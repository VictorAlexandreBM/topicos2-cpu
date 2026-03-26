import {input, Pipe, PipeTransform} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {GLOBAL_ERROR_MAP} from '../global-error-map';

@Pipe({ name: 'fieldError', pure: true })
export class FieldErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors | null, touched: boolean, localMap?: {[key: string]: (args?: any) => string}): string | null {
    console.log('hello world')
    if (errors === null || !touched) return null;
    console.log('touched')
    const [key, value] = Object.entries(errors)[0];

    const fn = localMap?.[key] ?? GLOBAL_ERROR_MAP[key];
    return fn ? fn(value) : 'Campo inválido';
  }
}

