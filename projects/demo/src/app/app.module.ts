import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

import { TabScrollModule } from "../../../ngx-tab-scroll/src/lib/tab-scroll.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TabsetLikeComponent } from "./tabset-like/tabset-like.component";

@NgModule({
  declarations: [TabsetLikeComponent, AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TabScrollModule.forRoot({
      autoRecalculate: true,
      showDropDown: true,
      showTooltips: false,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
