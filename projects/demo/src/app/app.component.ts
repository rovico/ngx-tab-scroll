import { Component, forwardRef, ViewChild } from '@angular/core';
import { TabScrollComponent } from 'ngx-tab-scroll';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(forwardRef(() => TabScrollComponent)) tabScroll: TabScrollComponent;

  tabs: {heading: string, content: string}[] = [];

  addTab() {
    this.tabs.push({
      heading: 'New Tab ' + this.tabs.length,
      content: 'This is the content for a NEW tab ' + this.tabs.length
    });
  }

  removeTab() {
    this.tabs.splice(this.tabs.length - 1, 1);
  }

  reCalcScroll() {
    this.tabScroll.api.doRecalculate();
  }

  scrollIntoView(n?: number) {
    this.tabScroll.api.scrollTabIntoView(n);
  }
}
