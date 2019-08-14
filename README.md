ngx-tab-scroll
=====================

A scrollable tab plugin intended for scrolling UI Bootstrap [tabset](https://ng-bootstrap.github.io/#/components/tabset/examples).

[![npm version](https://img.shields.io/npm/v/ngx-tab-scroll.svg?style=flat-square)](https://www.npmjs.com/package/ngx-tab-scroll)
[![npm downloads](https://img.shields.io/npm/dm/ngx-tab-scroll.svg?style=flat-square)](http://npm-stat.com/charts.html?package=ngx-tab-scroll&from=2019-08-01)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

### Usage
* Import preferred theme styles: 

  ```scss
  /**
  ngx-tab-scroll
   */
  @import '~ngx-tab-scroll/tab-scroll-theme-flatten';
    
  ```
  
  OR
  
  ```scss
  /**
  ngx-tab-scroll
   */
  @import '~ngx-tab-scroll/tab-scroll-theme-bootstrap';
    
  ```
  
  And icons
  
  ```scss
  @import '~ngx-tab-scroll/tab-scroll-icons';
  ```
    
* Import angular npm module:
   ```typescript
   import { TabScrollModule } from 'ngx-tab-scroll';
   ```

  and in your @NgModule() decorator
  
  ```typescript
  {
    ...,
    imports: [
      ...,
      TabScrollModule.forRoot({
        autoRecalculate: true,
        showDropDown: true,
        showTooltips: false,
        tooltipLeftPlacement: 'top',
        tooltipRightPlacement: 'top',
        scrollBy: 50,
        autoRecalculate: false,
        leftScrollAddition: 0
      }),
      ...
    ],
  }
  ```
   
* Wrap your `<ngb-tabset>` inside of `<ngx-tab-scroll>`, like so:

```html
<ngx-tab-scroll [showTooltips]="true">
	<ngb-tabset>
		<ngb-tab *ngFor="let x of tabs">...</ngb-tab>
	</ngb-tabset>
</scrollable-tabset>
```

### Attributes
* `showDropDown` - whether or not to show the drop-down for navigating the tabs, the drop-down reflects the selected tab and reflect if a tab is disabled.  default is `true`.
* `showTooltips` - whether or not to show tooltips on the scroll buttons. default is `true`.
* `tooltipLeftPlacement` - which tooltip direction to use for the left button tooltip (bottom, top, left, right). default is `right`.
* `tooltipRightPlacement` - which tooltip direction to use for the right button tooltip (bottom, top, left, right). default is `left`.
* `scrollBy` - the amount of pixels to offset upon each scroll. default is `50`.
* `autoRecalculate` - whether or not to watch the tabs collection for changes to initiate a re-calculation. default is `false`. important! see warning below
* `dropDownHeaderTemplate` - set custom header TemplateRef<any> inside the drop-down. default is empty.

And additional attributes you can set on an individual tab:
* `data-tabScrollIgnore` - if there is 'data-tabScrollIgnore="true"' on a tab than it will not be shown in the drop-down.
* `data-tabScrollHeading` - put this on a tab and the value of it will be the text for this tab's tooltip and drop-down item.

Attributes can be directly set on each directive as DOM attributes

Example:
```html
<ngx-tab-scroll [showTooltips]="true"
	              tooltipLeftPlacement="bottom"
	              [scrollBy]="150">
	<ngb-tabset>
		<ngb-tab *ngFor="let x of tabs">...</ngb-tab>
	</ngb-tabset>
</ngx-tab-scroll>
```

Or, they can be configured globally for all your `ngx-tab-scroll` components, by using the **TabScrollConfigInterface**, in the `forRoot/forChild` parameter. This way, you can keep the directive usage simple and consistent across all your html.

> **Important Notes:**
* Use `autoRecalculate` with caution! - when set to true a watcher is added to the collection of tabs, and watcher are costly on performance! it is better to call `doRecalculate()` when needed. use this option only on small applications.
* When an option is both defined at directive level and at config level, the value specified in the DOM takes precedence over the one from the config!.


### Api
there is an exposed api, with it you can call:
* `doRecalculate()` - force a re-calculation of the scroll, this will calculate if the scroll buttons are needed and which to enable\disable. usually needed after a tabs are added or removed.
* `scrollTabIntoView()` - scroll the selected tab into center of view. or if you want to scroll to a specific tab index:
* `scrollTabIntoView(number)` - scroll the tab index into center of view.

Example:
```typescript
export class AppComponent {

  @ViewChild(forwardRef(() => TabScrollComponent)) tabScroll: TabScrollComponent;

  tabs: {heading: string, content: string}[] = [];

  reCalcScroll() {
    this.tabScroll.api.doRecalculate();
  }

  scrollIntoView(n?: number) {
    this.tabScroll.api.scrollTabIntoView(n);
  }
}
```

### Styling
you can use the default style by referencing `tab-scroll-theme-bootstrap.css`, or you can chose to use the alternative customized flat style by referencing the supplied `tab-scroll-theme-flatten.css`.
both files are the result of a transpiled scss, which are also included in this package.

if you intend to have your own design i highly recommend you start with `tab-scroll-theme-flatten.scss` with it you can unleash the power of scss&css.

to change the icons on the buttons you simply need to override the relevant button's css with your own css

Example:
```scss
i[class^=ts-icon] {
  display: inline-block;
  width: 100%;
  margin-top: 10px;
  margin-left: 6px;
}
.ts-icon {
  &-chevron-left:before {
    content: url(data:image/svg+xml);
  }
  &-chevron-right:before {
    content: url(data:image/svg+xml);
  }
  &-chevron-down:before {
    content: url(data:image/svg+xml);
  }
  &-check:before {
    content: url(data:image/svg+xml);
  }
}
```
the drop-down can be given a class by using the `dropDownClass` property.

the drop-down menu can be given a class by using the `dropDownMenuClass` property.

the drop-down menu header can be given a class by using the `dropDownHeaderClass` property.

### Dependencies
* Angular7
* Ngx Bootstrap
* Bootstrap CSS
