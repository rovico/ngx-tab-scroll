#0.0.1-alpha.3

* Added ability to use NOT ONLY ngb-tabset. For this purpose i added TabsetLikeInterface. Since that you may implement this interface in your component, add there tabst-like html template and use it inside <ngx-tab-scroll with `#customTabset` anchor-tag:

    Your possible implementation:
    
    ```typescript
    @Component({
      selector: 'app-tabset-like',
      template: `
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item" [class.active]="tab.active" *ngFor="let tab of tabs">
            <a href [id]="tab.id" class="nav-link" [class.active]="tab.active" (click)="select(tab.id); $event.preventDefault()">
              <span class="uib-tab-heading">{{tab.name}}</span>
            </a>
          </li>
        </ul>
      `
    })
    export class TabsetLikeComponent implements OnInit, TabsetLikeInterface {
      // imlpementation
    }
    ```
    
    In your `.scss` file (from "flatten" style):
    
    ```scss
    .ui-tabs-scrollable {
      position: relative;
    
      > .spacer {
        &.hidden-buttons app-tabset-like > .nav-tabs {
          > li:last-child {
            > a {
              border-right-color: $border-color;
              &.active {
                border-right-color: $active-border-color;
              }
            }
          }
        }
        app-tabset-like {
          > .nav-tabs {
            display: block;
            flex-wrap: nowrap;
            white-space: nowrap;
            overflow: hidden;
            border: none;
            > li {
              float: none;
              display: table-cell;
              margin: 0;
              > a {
                line-height: $header-height;
                height: $header-height;
                font-size: 12px;
                overflow: hidden;
                background-color: $not-active-background-color;
                border: 1px solid $border-color;
                border-right-color: transparent;
                border-radius: 0;
                padding: 0 15px;
                margin: 0;
                color: $not-active-text-color;
    
                &.active {
                  border-radius: $active-border-radius $active-border-radius 0 0;
                  border-color: $active-border-color;
                  border-bottom-color: transparent;
                  background-color: $active-background-color;
                  color: $active-text-color;
                }
    
                &:not(.active) {
                  border-bottom-color: $active-border-color;
                  &:hover {
                    background-color: $not-active-hover-color;
                  }
                }
              }
              &.disabled > a:not(.active) {
                color: #9d9d9d;
                &:hover {
                  background-color: $not-active-background-color;
                }
              }
    
            }
          }
          > .tab-content {
            margin-top: -1px;
            border-top: 1px solid $active-border-color;
          }
        }
      }
    }
    
    /*make the tabs content be height 100%*/
    .ui-tabs-scrollable > .spacer {
      app-tabset-like {
        display: block;
        height: 100%;
        > .tab-content {
          height: 100%;
          > .active {
            height: 100%;
            overflow: auto;
          }
        }
      }
    }
    ```
    
    And in your wrapper component template:
    
    ```html
    <ngx-tab-scroll tooltipLeftPlacement="top">
      <app-tabset-like #customTabset></app-tabset-like>
    </ngx-tab-scroll>
    ```

* Fixed SCSS styles for icons
* ng-packagr updated
