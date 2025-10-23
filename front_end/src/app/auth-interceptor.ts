import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const jwt_token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  if (jwt_token) {
    const token = jwt_token.split('=')[1];
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }
  return next(req);
};