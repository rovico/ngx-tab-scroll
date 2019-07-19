import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TabScrollConfigService } from './tab-scroll-config';

export class TabScrollTab {
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
  constructor(private $scope: TabScrollComponent) {}

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
    <!--SHOULD NOT BE USED vvv-->
    <ng-template #tooltipLeftTemplate><div [innerHtml]="tooltipLeftHtml"></div></ng-template>
    <ng-template #tooltipRightTemplate><div [innerHtml]="tooltipRightHtml"></div></ng-template>
    <!--/SHOULD NOT BE USED ^^^-->
    <div class="ui-tabs-scrollable" [ngClass]="{'show-drop-down': !hideDropDown}">
      <button type="button" (mousedown)="scrollButtonDown('left', $event)" (mouseup)="scrollButtonUp()" [hidden]="hideButtons"
              [disabled]="disableLeft" class="btn nav-button left-nav-button" [placement]="tooltipLeftDirection"
              [ngbTooltip]="tooltipLeftTemplate"></button>
      <div class="spacer" ngClass="{'hidden-buttons': hideButtons}"><ng-content></ng-content></div>
      <button type="button" (mousedown)="scrollButtonDown('right', $event)" (mouseup)="scrollButtonUp()" [hidden]="hideButtons"
              [disabled]="disableRight" class="btn nav-button right-nav-button" [placement]="tooltipRightDirection"
              [ngbTooltip]="tooltipRightTemplate"></button>

      <div class="btn-group" [ngClass]="[dropDownClass]" ngbDropdown container="body" [hidden]="hideDropDown">
        <button type="button" class="btn" ngbDropdownToggle></button>
        <ul class="dropdown-menu" ngbDropdownMenu role="menu" [ngClass]="[dropDownMenuClass || 'dropdown-menu-right']">
          <li [ngClass]="dropDownHeaderClass"><ng-container [ngTemplateOutlet]="dropDownHeaderTemplate"></ng-container></li>
          <li role="menuitem" *ngFor="tab in dropdownTabs" [ngClass]="{'disabled': tab.disabled, 'active': tab.active}"
              (click)="activateTab(tab)">
            <a href><span class="dropDownTabActiveMark"
                          [ngStyle]="{'visibility': tab.active ? 'visible' : 'hidden'}"></span>{{tab.tabScrollTitle}}</a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: [
    './tab-scroll.scss',
    './tab-scroll-flat.scss'
  ]
})
export class TabScrollComponent implements OnInit, OnDestroy {

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
  @Input() dropDownHeaderTemplate: TemplateRef;

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

  private userShowDropDown: boolean;
  private userShowTooltips: boolean;
  private scrollByPixels: number;
  private leftScrollAdditionPixels: number;
  private mouseDownInterval: any;
  private isHolding = false;
  private winResizeTimeout: any;

  constructor(private config: TabScrollConfigService) {
    this.api = new TabScrollAPI(this);
    // @TODO may be incorrect!!! Use QueryL:ist of {View/Content}Children
    this.dropdownTabs = [];
    this.hideButtons = true;
    this.hideDropDown = true;
    // @TODO may be incorrect!!! Use QueryL:ist of {View/Content}Children
    this.tooltipRightHtml = '';
    // @TODO may be incorrect!!! Use QueryL:ist of {View/Content}Children
    this.tooltipLeftHtml = '';
    this.disableLeft = true;
    this.disableRight = true;
  }

  ngOnInit() {
    this.tooltipLeftDirection = this.tooltipLeftPlacement ? this.tooltipLeftPlacement : this.config.getConfig().tooltipLeftPlacement;
    this.tooltipRightDirection = this.tooltipRightPlacement ? this.tooltipRightPlacement : this.config.getConfig().tooltipRightPlacement;
    this.userShowDropDown = this.showDropDown !== undefined ? this.showDropDown === true : this.config.getConfig().showDropDown;
    this.userShowTooltips = this.showTooltips !== undefined ? this.showTooltips === true : this.config.getConfig().showTooltips === true;
    this.scrollByPixels = this.scrollBy ? this.scrollBy : this.config.getConfig().scrollBy;
    this.leftScrollAdditionPixels = this.leftScrollAddition ? this.leftScrollAddition : this.config.getConfig().leftScrollAddition;

    // // this is how we init for the first time.
    // $timeout(function(){
    //   $scope.init();
    // });
    //

    // WHAT IS '$window', '$interval', '$timeout','$sce', ?????
  }

  ngOnDestroy(): void {
    // // when scope destroyed
    // $scope.$on('$destroy', function () {
    //   angular.element($window).off('resize', $scope.onWindowResize);
    //   $scope.dropdownTabs = [];
    // });
  }

  init = function() {
    $scope.tabContainer = $el[0].querySelector('.spacer ul.nav-tabs');
    if(!$scope.tabContainer)return;

    var autoRecalc = $scope.autoRecalculate ? $scope.autoRecalculate === 'true' : scrollableTabsetConfig.autoRecalculate;
    if(autoRecalc) {
      var tabsetElement = angular.element($el[0].querySelector('.spacer div'));
      $scope.$watchCollection(
        function () {
          return tabsetElement.isolateScope() ? tabsetElement.isolateScope().tabs : false;
        },
        function () {
          $timeout(function () {
            $scope.reCalcAll()
          });
        }
      );
    }

    $scope.reCalcAll();

    // attaching event to window resize.
    angular.element($window).on('resize', $scope.onWindowResize);
  }

  scrollButtonDown(direction: string, event) {

  }

  scrollButtonUp() {

  }

  activateTab(tab: TabScrollTab) {

  }

  // re-calculate if the scroll buttons are needed, than call re-calculate for both buttons.
  reCalcAll = function() {
    if(!$scope.tabContainer)return;

    $scope.hideButtons = $scope.tabContainer.scrollWidth <= $scope.tabContainer.offsetWidth;
    $scope.hideDropDown = $scope.userShowDropDown ? $scope.hideButtons : true;
    $scope.isButtonsVisible = !$scope.hideButtons;

    if(!$scope.hideButtons) {

      if(!$scope.hideDropDown) {
        var allTabs = $scope.tabContainer.querySelectorAll('ul.nav-tabs > li');
        $scope.dropdownTabs = [];
        angular.forEach(allTabs, function (tab) {
          var ignore = tab.getAttribute("data-tabScrollIgnore");
          if(!ignore){
            var heading = tab.getAttribute("data-tabScrollHeading");
            var tabScope = angular.element(tab).isolateScope();
            //push new field to use as title in the drop down.
            tabScope.tabScrollTitle = heading ? heading : tab.textContent.trim();
            $scope.dropdownTabs.push(tabScope);
          }
        });
      } else {
        $scope.dropdownTabs = [];
      }

      $scope.reCalcSides();
    } else {
      $scope.dropdownTabs = [];
    }
  }

  scrollTabIntoView(arg) {

  }

  scrollTo(element, change, duration, callback, isLinear) {
    var start = element.scrollLeft;
    var increment = 20;
    var position = 0;

    var animateScroll = function (elapsedTime) {
      elapsedTime += increment;
      if (isLinear === true) {
        position = $scope.linearTween(elapsedTime, start, change, duration);
      } else {
        position = $scope.easeInOutQuad(elapsedTime, start, change, duration);
      }
      element.scrollLeft = position;
      if (elapsedTime < duration) {
        setTimeout(function () {
          animateScroll(elapsedTime);
        }, increment);
      } else {
        callback();
      }
    };

    animateScroll(0);
  }

  /**
   * @todo use angular animations ?
   * @param currentTime
   * @param start
   * @param change
   * @param duration
   */
  linearTween(currentTime, start, change, duration) {
    return change * currentTime / duration + start;
  }

  /**
   * @todo use angular animations ?
   * @param currentTime
   * @param start
   * @param change
   * @param duration
   */
  easeInOutQuad(currentTime, start, change, duration) {
    currentTime /= duration / 2;
    if (currentTime < 1) {
      return change / 2 * currentTime * currentTime + start;
    }
    currentTime--;
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  }

  onWindowResize() {
    // delay for a bit to avoid running lots of times.
    clearTimeout(this.winResizeTimeout);
    this.winResizeTimeout = setTimeout(function () {
      this.reCalcAll();
      this.scrollTabIntoView();
      this.$apply();
    }, 250);
  }

  /**
   * @TODO replace $interval with something from rxjs
   */
  cancelMouseDownInterval() {
    this.isHolding = false;

    if (this.mouseDownInterval) {
      $interval.cancel(this.mouseDownInterval);
      this.mouseDownInterval = null;
    }
  }

  /**
   * @TODO replace $timeout with something from rxjs
   * @TODO Check angular-ui-tab-scroll and check what tabContainer is
   * @param direction
   * @param event
   */
  scrollButtonDown(direction, event) {
    event.stopPropagation();
    this.isHolding = true;
    const realScroll = direction === 'left' ? 0 - this.scrollByPixels : this.scrollByPixels;
    this.scrollTo(this.tabContainer, realScroll, 150, function () {
      $timeout(function () {
        this.reCalcSides();
      });
    }, true)
  }

  initMouseDownInterval() {
    mouseDownInterval = $interval(function() {

      if($scope.isHolding) {
        $scope.scrollTo($scope.tabContainer, realScroll, 150, function(){
          $timeout(function(){
            $scope.reCalcSides();
          });
        }, true);

        if(event.target.disabled) {
          $scope.cancelMouseDownInterval();
        }
      }
    }, 100);
  }


  scrollButtonUp = function() {
    $scope.cancelMouseDownInterval();
  }

  activateTab = function(tab) {
    if(tab.disabled)return;
    tab.select();
    $timeout(function () {
      $scope.scrollTabIntoView();
    });
  }


  reCalcSides = function() {
    if(!$scope.tabContainer || $scope.hideButtons)return;
    $scope.disableRight = $scope.tabContainer.scrollLeft >= $scope.tabContainer.scrollWidth - $scope.tabContainer.offsetWidth;
    $scope.disableLeft = $scope.tabContainer.scrollLeft <= 0;

    if($scope.userShowTooltips){
      $scope.reCalcTooltips();
    }
  }

  reCalcTooltips = function(){
    if(!$scope.tabContainer || $scope.hideButtons)return;
    var rightTooltips = [];
    var leftTooltips = [];

    var allTabs = $scope.tabContainer.querySelectorAll('ul.nav-tabs > li');
    angular.forEach(allTabs, function(tab) {

      var rightPosition = parseInt(tab.getBoundingClientRect().left + tab.getBoundingClientRect().width - $scope.tabContainer.getBoundingClientRect().left);
      var leftPosition = tab.getBoundingClientRect().left - $scope.tabContainer.getBoundingClientRect().left;
      var heading = tab.getAttribute("data-tabScrollHeading");
      var ignore = tab.getAttribute("data-tabScrollIgnore");

      if(rightPosition > $scope.tabContainer.offsetWidth && !ignore ) {
        if(heading) {
          rightTooltips.push(heading)
        } else if (tab.textContent)rightTooltips.push(tab.textContent);
      }

      if (leftPosition < 0 && !ignore ) {
        if(heading) {
          leftTooltips.push(heading)
        } else if (tab.textContent)leftTooltips.push(tab.textContent);
      }

    });

    var rightTooltipsHtml = rightTooltips.join('<br>');
    $scope.tooltipRightHtml = $sce.trustAsHtml(rightTooltipsHtml);

    var leftTooltipsHtml = leftTooltips.join('<br>');
    $scope.tooltipLeftHtml = $sce.trustAsHtml(leftTooltipsHtml);
  }


  scrollTabIntoView = function(arg){
    if(!$scope.tabContainer || $scope.hideButtons)return;

    var argInt = parseInt(arg);
    var tabToScroll;

    // first we find the tab element.
    if(argInt) { // scroll tab index into view
      var allTabs = $scope.tabContainer.querySelectorAll('ul.nav-tabs > li');
      if(allTabs.length > argInt) { // only if its really exist
        tabToScroll = allTabs[argInt];
      }
    } else { // scroll selected tab into view
      var activeTab = $scope.tabContainer.querySelector('li.active');
      if(activeTab) {
        tabToScroll = activeTab;
      }
    }

    // now let's scroll it into view.
    if(tabToScroll) {
      var rightPosition = parseInt(tabToScroll.getBoundingClientRect().left + tabToScroll.getBoundingClientRect().width - $scope.tabContainer.getBoundingClientRect().left);
      var leftPosition = tabToScroll.getBoundingClientRect().left - $scope.tabContainer.getBoundingClientRect().left;
      if (leftPosition - $scope.leftScrollAdditionPixels < 0) {
        var dif = leftPosition - 20 - $scope.leftScrollAdditionPixels;
        $scope.scrollTo($scope.tabContainer, dif, 700, function(){
          $timeout(function(){
            $scope.reCalcSides();
          });
        });
      } else if(rightPosition > $scope.tabContainer.offsetWidth){
        var dif = rightPosition - $scope.tabContainer.offsetWidth + 20;
        $scope.scrollTo($scope.tabContainer, dif, 700, function(){
          $timeout(function(){
            $scope.reCalcSides();
          });
        });
      }
    }
  }

}

