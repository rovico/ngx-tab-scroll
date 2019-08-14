import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TabScrollModule } from 'ngx-tab-scroll';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsetLikeComponent } from './tabset-like/tabset-like.component';

@NgModule({
  declarations: [
    TabsetLikeComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TabScrollModule.forRoot({
      autoRecalculate: true,
      showDropDown: true,
      showTooltips: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
