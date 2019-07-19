import { ModuleWithProviders, NgModule } from '@angular/core';
import { TabScrollComponent } from './tab-scroll.component';
import { TabScrollConfig, TabScrollConfigInterface, TabScrollConfigService } from './tab-scroll-config';

@NgModule({
  declarations: [TabScrollComponent],
  imports: [
  ],
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
