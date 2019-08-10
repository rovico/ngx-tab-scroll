import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabScrollComponent } from './tab-scroll.component';
import { TabScrollConfig, TabScrollConfigInterface, TabScrollConfigService } from './tab-scroll-config';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TabScrollComponent],
  imports: [CommonModule, NgbTooltipModule, NgbDropdownModule],
  exports: [TabScrollComponent]
})
export class TabScrollModule {
  static forRoot(moduleConfig: TabScrollConfigInterface): ModuleWithProviders {
    return {
      ngModule: TabScrollModule,
      providers: [
        {provide: TabScrollConfig, useValue: moduleConfig},
        {
          provide: TabScrollConfigService,
          useClass: TabScrollConfigService,
          deps: [TabScrollConfig]
        }
      ]
    };
  }
  static forChild(moduleConfig: TabScrollConfigInterface): ModuleWithProviders {
    return {
      ngModule: TabScrollModule,
      providers: [
        {provide: TabScrollConfig, useValue: moduleConfig}
      ]
    };
  }
}
