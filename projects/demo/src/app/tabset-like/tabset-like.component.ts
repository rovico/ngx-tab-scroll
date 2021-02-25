import { Component, EventEmitter, OnInit } from "@angular/core";
import { TabsetLikeInterface } from "../../../../ngx-tab-scroll/src/lib/tab-scroll.component";

export class CustomTab {
  id: string;
  active: boolean;
  name: string;
  content: string;

  deactivate() {
    this.active = false;
    return this;
  }

  activate() {
    this.active = true;
    return this;
  }
}

@Component({
  selector: "app-tabset-like",
  template: `
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" [class.active]="tab.active" *ngFor="let tab of tabs">
        <a
          href
          [id]="tab.id"
          class="nav-link"
          [class.active]="tab.active"
          (click)="select(tab.id); $event.preventDefault()"
        >
          <span class="uib-tab-heading">{{ tab.name }}</span>
        </a>
      </li>
    </ul>
    <div *ngIf="currentTab">{{ currentTab.content }}</div>
  `,
})
export class TabsetLikeComponent implements OnInit, TabsetLikeInterface {
  tabs: CustomTab[] = [];

  navChange: EventEmitter<any> = new EventEmitter();

  currentTab: CustomTab;

  ngOnInit() {
    for (let i = 0; i < 11; i++) {
      this.tabs.push(this.initTab());
    }
    this.select(this.tabs[0].id);
  }

  select(id: string): void {
    if (this.currentTab && this.currentTab.id === id) {
      return;
    }
    this.currentTab = this.tabs
      .map((tab) => tab.deactivate())
      .find((tab) => tab.id === id)
      .activate();
    this.navChange.next();
  }

  initTab() {
    const tab = new CustomTab();
    tab.id = `tab-index-${this.tabs.length}`;
    tab.active = this.tabs.length === 0;
    tab.name = `New Tab ${this.tabs.length}`;
    tab.content = `This is the content for a NEW tab ${this.tabs.length}`;
    return tab;
  }
}
