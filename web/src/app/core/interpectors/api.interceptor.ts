import {HttpInterceptorFn} from '@angular/common/http';

export const apiInterceptorFn: HttpInterceptorFn = (req, next) => {
  const prefixo = 'http://localhost:8080/api';

  const apiReq = req.clone({url: `${prefixo}/${req.url}`});

  return next(apiReq)
}
