import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('vn'); // Default language
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(public translate: TranslateService) {
       this.translate.setDefaultLang('vn'); // Set default language
      this.translate.use('vn');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLangSubject.next(lang); // Update language value
  }
   getCurrentLanguage(): string{
       return this.currentLangSubject.value;
   }

}