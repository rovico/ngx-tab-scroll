import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef, EventEmitter, forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { TabScrollConfigService } from './tab-scroll-config';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { TabScrollAnimationService } from './tab-scroll-animation.service';

export interface TabsetLikeInterface {
  /**
   * Active tab was changed
   */
  tabChange: EventEmitter<any>;

  /**
   * set given tab selected by it's id
   * @param id string html id param of selecting tab
   */
  select(id: string): void;
}

export class TabScrollTab {
  id: string;
  active: boolean;
  disabled: boolean;
  tabScrollTitle: string;
}

/**
 * there is an exposed api, with it you can call:
 * doRecalculate() - force a re-calculation of the scroll, this will calculate if the scroll buttons are needed and which to enable\disable.
 * usually needed after a tabs are added or removed.
 * scrollTabIntoView() - scroll the selected tab into center of view. or if you want to scroll to a specific tab index:
 * scrollTabIntoView(number) - scroll the tab index into center of view.
 */
export class TabScrollAPI {
  constructor(private $scope: TabScrollComponent) {
  }

  doRecalculate() {
    this.$scope.reCalcAll();
  }

  scrollTabIntoView(arg) {
    this.$scope.scrollTabIntoView(arg);
  }
}


/**
 * Based on code of angular-ui-tab-scroll Version: 2.3.5
 * https://github.com/VersifitTechnologies/angular-ui-tab-scroll
 */
@Component({
  selector: 'ngx-tab-scroll',
  template: `
    <ng-template #tooltipLeftTemplate>
      <div [innerHtml]="tooltipLeftHtml"></div>
    </ng-template>
    <ng-template #tooltipRightTemplate>
      <div [innerHtml]="tooltipRightHtml"></div>
    </ng-template>
    <div class="ui-tabs-scrollable" [ngClass]="{'show-drop-down': !hideDropDown}">
      <button type="button" (mousedown)="scrollButtonDown('left', $event)" (mouseup)="scrollButtonUp()" [hidden]="hideButtons"
              [disabled]="disableLeft" class="btn nav-button left-nav-button" [placement]="tooltipLeftDirection"
              [ngbTooltip]="tooltipLeftTemplate" [disableTooltip]="!userShowTooltips">
        <i class="ts-icon-chevron-left"></i>
      </button>
      <div #spacer class="spacer" [ngClass]="{'hidden-buttons': hideButtons}">
        <ng-content></ng-content>
      </div>
      <button type="button" (mousedown)="scrollButtonDown('right', $event)" (mouseup)="scrollButtonUp()" [hidden]="hideButtons"
              [disabled]="disableRight" class="btn nav-button right-nav-button" [placement]="tooltipRightDirection"
              [ngbTooltip]="tooltipRightTemplate" [disableTooltip]="!userShowTooltips">
        <i class="ts-icon-chevron-right"></i>
      </button>

      <div class="btn-group" [ngClass]="[dropDownClass || '']" ngbDropdown container="body" [hidden]="hideDropDown">
        <button type="button" class="btn" ngbDropdownToggle>
          <i class="ts-icon-chevron-down"></i>
        </button>
        <ul class="ngx-tab-scroll-dropdown-menu" ngbDropdownMenu role="menu" [ngClass]="[dropDownMenuClass || 'dropdown-menu-right']">
          <li [ngClass]="dropDownHeaderClass">
            <ng-container [ngTemplateOutlet]="dropDownHeaderTemplate"></ng-container>
          </li>
          <li role="menuitem" *ngFor="let tab of dropdownTabs" [ngClass]="{'disabled': tab.disabled, 'active': tab.active}"
              (click)="activateTab(tab)">
            <span class="dropdown-tab-active-mark" [ngStyle]="{'visibility': tab.active ? 'visible' : 'hidden'}">
              <i class="ts-icon-check"></i>
            </span>{{tab.tabScrollTitle}}
          </li>
        </ul>
      </div>
    </div>
  `,
  providers: [TabScrollAnimationService]
})
export class TabScrollComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * whether or not to show the drop-down for navigating the tabs,
   * the drop-down reflects the selected tab and reflect if a tab is disabled. default is true.
   */
  @Input() showDropDown: boolean;

  /**
   * whether or not to show tooltips on the scroll buttons. default is true
   */
  @Input() showTooltips: boolean;

  /**
   * which tooltip direction to use for the left button tooltip (bottom, top, left, right). default is right.
   */
  @Input() tooltipLeftPlacement: string;

  /**
   * which tooltip direction to use for the right button tooltip (bottom, top, left, right). default is left.
   */
  @Input() tooltipRightPlacement: string;

  /**
   * the amount of pixels to offset upon each scroll. default is 50
   */
  @Input() scrollBy: number;

  /**
   * whether or not to watch the tabs collection for changes to initiate a re-calculation. default is false.
   * Use auto-recalculate with caution! - when set to true a watcher is added to the collection of tabs,
   * and watcher are costly on performance! it is better to call doRecalculate() when needed.
   * use this option only on small applications.
   */
  @Input() autoRecalculate: boolean;

  /**
   * the drop-down can be given a class by using the drop-down-class property.
   */
  @Input() dropDownClass: string;

  /**
   * the drop-down menu can be given a class by using the drop-down-menu-class property.
   */
  @Input() dropDownMenuClass: string;

  /**
   * the drop-down menu header can be given a class by using the drop-down-header-class property.
   */
  @Input() dropDownHeaderClass: string;

  /**
   * Scroll addition in pixels. WTF?
   */
  @Input() leftScrollAddition: number;

  /**
   * Template for tabs bootstrap dropdown set custom header inside the drop-down. default is empty.
   */
  @Input() dropDownHeaderTemplate: TemplateRef<any>;

  /**
   * wrapper to access nav tabs
   */
  @ViewChild('spacer') navTabWrapper!: ElementRef;

  /**
   * get NgbTabset as ContentChild
   */
  @ContentChild(forwardRef(() => NgbTabset)) ngbTabset: NgbTabset;

  /**
   * Get custom tabset as ContentChild.
   * Note, that your component should implement TabsetLikeInterface
   */
  @ContentChild('customTabset') customTabset: TabsetLikeInterface;

  get tabset(): TabsetLikeInterface {
    return this.ngbTabset ? this.ngbTabset : this.customTabset;
  }

  api: TabScrollAPI;

  disableLeft: boolean;

  disableRight: boolean;

  isButtonsVisible: boolean;

  /**
   * Html to show inside right button's ngbTooltip
   * @todo should not be used! Use tabScroll components instead
   */
  tooltipLeftHtml;

  /**
   * Html to show inside right button's ngbTooltip
   * @todo should not be used! Use tabScroll components instead
   */
  tooltipRightHtml;

  /**
   * Tabs to walk through
   */
  dropdownTabs: TabScrollTab[];

  /**
   * Dropdown should be hidden
   */
  hideDropDown: boolean;

  /**
   * Hide left/right buttons
   */
  hideButtons: boolean;

  /**
   * Left button's ngbTooltip direction
   */
  tooltipLeftDirection;

  /**
   * Right button's ngbTooltip direction
   */
  tooltipRightDirection;

  /**
   * Enable tooltips when showTooltips is true or this.config.getConfig().showTooltips is true
   */
  userShowTooltips: boolean;

  private userShowDropDown: boolean;
  private scrollByPixels: number;
  private leftScrollAdditionPixels: number;
  private mouseDownInterval: any;
  private isHolding = false;
  private winResizeTimeout: any;
  private tabContainer: HTMLElement;

  constructor(
    private config: TabScrollConfigService,
    private animation: TabScrollAnimationService,
    private $cdr: ChangeDetectorRef
  ) {
    this.api = new TabScrollAPI(this);
    this.dropdownTabs = [];
    this.hideButtons = true;
    this.hideDropDown = true;
    this.tooltipRightHtml = '';
    this.tooltipLeftHtml = '';
    this.disableLeft = true;
    this.disableRight = true;
  }

  ngOnInit() {
    this.tooltipLeftDirection = this.tooltipLeftPlacement ? this.tooltipLeftPlacement : this.config.getConfig().tooltipLeftPlacement;
    this.tooltipRightDirection = this.tooltipRightPlacement ? this.tooltipRightPlacement : this.config.getConfig().tooltipRightPlacement;
    this.userShowDropDown = this.showDropDown !== undefined ? this.showDropDown : this.config.getConfig().showDropDown;
    this.userShowTooltips = this.showTooltips !== undefined ? this.showTooltips : this.config.getConfig().showTooltips;
    this.scrollByPixels = this.scrollBy ? this.scrollBy : this.config.getConfig().scrollBy;
    this.leftScrollAdditionPixels = this.leftScrollAddition ? this.leftScrollAddition : this.config.getConfig().leftScrollAddition;
  }

  ngOnDestroy(): void {
    this.dropdownTabs = [];
  }

  ngAfterViewInit(): void {
    this.tabContainer = this.navTabWrapper.nativeElement.querySelector('ul.nav-tabs');
    if (!this.tabContainer) {
      throw new Error('You have to specify ngb-bootstrap tabs right between inside component tag');
    }

    const autoRecalc = this.autoRecalculate !== undefined ? this.autoRecalculate : this.config.getConfig().autoRecalculate;
    if (autoRecalc) {
      this.tabset.tabChange.subscribe(() => {
        this.reCalcAll();
      });
    }
    this.reCalcAll();
  }

  /**
   * @param direction where to scroll tabs left or right
   * @param event native event
   */
  scrollButtonDown(direction, event) {
    event.stopPropagation();
    this.isHolding = true;
    const realScroll = direction === 'left' ? 0 - this.scrollByPixels : this.scrollByPixels;
    this.animation.scrollTo(this.tabContainer, realScroll, 150, () => {
      setTimeout(() => {
        this.reCalcSides();
      });
    }, true);
    this.initMouseDownInterval(realScroll, event);
  }

  scrollButtonUp() {
    this.cancelMouseDownInterval();
  }

  /**
   * Go to the tab using dropdown
   * @param tab TabScrollTab to make it current
   */
  activateTab(tab: TabScrollTab) {
    if (tab.disabled) {
      return;
    }
    this.tabset.select(tab.id);
    window.setTimeout(() => {
      this.scrollTabIntoView();
    });
  }

  /**
   * re-calculate if the scroll buttons are needed, than call re-calculate for both buttons.
   */
  reCalcAll() {
    if (!this.tabContainer) {
      return;
    }

    this.hideButtons = this.tabContainer.scrollWidth <= this.tabContainer.offsetWidth;
    this.hideDropDown = this.userShowDropDown ? this.hideButtons : true;
    this.isButtonsVisible = !this.hideButtons;

    if (!this.hideButtons) {
      if (!this.hideDropDown) {
        window.setTimeout(() => {
          this.dropdownTabs = this.getAllTabs().reduce((acu, htmlTab: HTMLElement) => {
            const ignore = htmlTab.getAttribute('data-tabScrollIgnore');
            if (ignore) {
              return acu;
            }
            const heading = htmlTab.getAttribute('data-tabScrollHeading');
            const tabScope = new TabScrollTab();
            tabScope.id = htmlTab.firstElementChild.getAttribute('id');
            tabScope.active = htmlTab.firstElementChild.classList.contains('active');
            tabScope.tabScrollTitle = heading ? heading : htmlTab.textContent.trim();

            return acu.concat([tabScope]);
          }, []);
        });
      } else {
        this.dropdownTabs = [];
      }

      this.reCalcSides();
    } else {
      this.dropdownTabs = [];
    }

    this.$cdr.detectChanges();
  }

  /**
   * scrollTabIntoView() - scroll the selected tab into center of view.
   * scrollTabIntoView(number) - if you want to scroll to a specific tab index
   * @param tabIndex tab index to scroll to
   */
  scrollTabIntoView(tabIndex?: number) {
    if (!this.tabContainer || this.hideButtons) {
      return;
    }
    let tabToScroll;
    const allTabs = this.getAllTabs();

    // first we find the tab element.
    if (tabIndex) { // scroll tab index into view
      if (allTabs.length > tabIndex) { // only if its really exist
        tabToScroll = allTabs[tabIndex];
      }
    } else { // scroll selected tab into view
      const activeTab = allTabs.find((htmlTab: HTMLElement) => htmlTab.firstElementChild.classList.contains('active'));
      if (activeTab) {
        tabToScroll = activeTab;
      }
    }

    // now let's scroll it into view.
    if (tabToScroll) {
      const position = this.getHtmlElementPosition(tabToScroll, this.tabContainer);
      let dif: number;
      if (position.left - this.leftScrollAdditionPixels < 0) {
        dif = position.left - 20 - this.leftScrollAdditionPixels;
        this.animation.scrollTo(this.tabContainer, dif, 700, () => {
          this.reCalcSides();
        });
      } else if (position.right > this.tabContainer.offsetWidth) {
        dif = position.right - this.tabContainer.offsetWidth + 20;
        this.animation.scrollTo(this.tabContainer, dif, 700, () => {
          this.reCalcSides();
        });
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    // delay for a bit to avoid running lots of times.
    clearTimeout(this.winResizeTimeout);
    this.winResizeTimeout = setTimeout(() => {
      this.reCalcAll();
      this.scrollTabIntoView();
      // this.$apply(); <- cdr
    }, 250);
  }

  /**
   * @TODO replace $interval with something from rxjs
   */
  cancelMouseDownInterval() {
    this.isHolding = false;

    if (this.mouseDownInterval) {
      clearInterval(this.mouseDownInterval);
      this.mouseDownInterval = null;
    }
  }

  /**
   * Init mouseDownInterval
   * @param realScroll amount of pixels to scroll to
   * @param event Button click Event
   */
  initMouseDownInterval(realScroll, event) {
    this.mouseDownInterval = setInterval(() => {
      if (this.isHolding) {
        this.animation.scrollTo(this.tabContainer, realScroll, 150, () => {
          this.reCalcSides();
        }, true);

        if (event.target.disabled) {
          this.cancelMouseDownInterval();
        }
      }
    }, 100);
  }

  reCalcSides() {
    if (!this.tabContainer || this.hideButtons) {
      return;
    }
    this.disableRight = this.tabContainer.scrollLeft >= this.tabContainer.scrollWidth - this.tabContainer.offsetWidth;
    this.disableLeft = this.tabContainer.scrollLeft <= 0;

    if (this.userShowTooltips) {
      this.reCalcTooltips();
    }
  }

  reCalcTooltips() {
    if (!this.tabContainer || this.hideButtons) {
      return;
    }
    const rightTooltips = [];
    const leftTooltips = [];

    this.getAllTabs().forEach((htmlTab: HTMLElement) => {
      const position = this.getHtmlElementPosition(htmlTab, this.tabContainer);
      const heading = htmlTab.getAttribute('data-tabScrollHeading');
      const ignore = htmlTab.getAttribute('data-tabScrollIgnore');

      if (position.right > this.tabContainer.offsetWidth && !ignore) {
        if (heading) {
          rightTooltips.push(heading);
        } else if (htmlTab.textContent) {
          rightTooltips.push(htmlTab.textContent);
        }
      }

      if (position.left < 0 && !ignore) {
        if (heading) {
          leftTooltips.push(heading);
        } else if (htmlTab.textContent) {
          leftTooltips.push(htmlTab.textContent);
        }
      }

    });

    this.tooltipRightHtml = rightTooltips.join('<br/>');
    this.tooltipLeftHtml = leftTooltips.join('<br/>');
  }

  /**
   * Returns all tabs as array oh html elements
   */
  private getAllTabs(): HTMLElement[] {
    const allTabs = this.tabContainer.querySelectorAll('ul.nav-tabs > li');
    return <HTMLElement[]>(Array.from(allTabs));
  }

  /**
   * Returns left and right position of element inside parent
   * @param el tested element
   * @param parent parent of tested element
   */
  private getHtmlElementPosition(el: HTMLElement, parent: HTMLElement): { right: number, left: number } {
    const right = el.getBoundingClientRect().left + el.getBoundingClientRect().width - parent.getBoundingClientRect().left;
    const left = el.getBoundingClientRect().left - parent.getBoundingClientRect().left;
    return {right, left};
  }
}

