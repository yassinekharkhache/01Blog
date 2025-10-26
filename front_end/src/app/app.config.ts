import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { routes } from './app.routes';
import { firstValueFrom } from 'rxjs';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'assets/tinymce/tinymce.min.js' },
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};