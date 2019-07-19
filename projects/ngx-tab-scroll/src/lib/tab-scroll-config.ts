import { Injectable } from '@angular/core';

export interface TabScrollConfigInterface {
  showDropDown: boolean;
  showTooltips: boolean;
  tooltipLeftPlacement: string;
  tooltipRightPlacement: string;
  scrollBy: number;
  autoRecalculate: boolean;
  leftScrollAddition: number;
}

export class TabScrollConfigService {
  CONFIG_OPTIONS: TabScrollConfigInterface;

  constructor(moduleConfig?: TabScrollConfigInterface) {
    this.CONFIG_OPTIONS = {
      ...new TabScrollConfig(),
      ...moduleConfig
    };
  }

  getConfig(): TabScrollConfigInterface {
    return this.CONFIG_OPTIONS;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TabScrollConfig {
  showDropDown: true;
  showTooltips: true;
  tooltipLeftPlacement: 'right';
  tooltipRightPlacement: 'left';
  scrollBy: 50;
  autoRecalculate: false;
  leftScrollAddition: 0;
}
