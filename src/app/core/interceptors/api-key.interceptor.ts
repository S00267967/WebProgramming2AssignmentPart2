import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroments';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith(environment.apiUrl)
    ? next(req.clone({ setHeaders: { 'x-api-key': environment.apiKey } }))
    : next(req);
