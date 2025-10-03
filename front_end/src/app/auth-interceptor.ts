import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("[Interceptor] Running for:", req.url);
  const jwt_token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  console.log(">>>  "+jwt_token)
  if (jwt_token) {
    const token = jwt_token.split('=')[1];
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }
  return next(req);
};