import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app-module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: any): void => console.error(err));