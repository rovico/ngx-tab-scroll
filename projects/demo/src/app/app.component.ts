import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TabScrollComponent } from 'ngx-tab-scroll';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('tabScroll') tabScroll: TabScrollComponent;

  @ViewChild('tabSetLike') tabSetLike: TabScrollComponent;

  tabs: {heading: string, content: string}[] = [];

  currentTabScroll: TabScrollComponent;

  ngAfterViewInit(): void {
    this.currentTabScroll = this.tabScroll ? this.tabScroll : this.tabSetLike;
  }

  onTabChange($event) {
    if ($event.nextId === 'ngb-tab-0') {
      window.setTimeout(() => {
        this.currentTabScroll = this.tabScroll;
      });
    } else if ($event.nextId === 'ngb-tab-1') {
      window.setTimeout(() => {
        this.currentTabScroll = this.tabSetLike;
      });
    }
  }

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
    this.currentTabScroll.api.doRecalculate();
  }

  scrollIntoView(n?: number) {
    this.currentTabScroll.api.scrollTabIntoView(n);
  }
}
