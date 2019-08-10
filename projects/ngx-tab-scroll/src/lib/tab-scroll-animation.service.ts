import { Injectable } from '@angular/core';

@Injectable()
export class TabScrollAnimationService {

  constructor() { }

  scrollTo(element: HTMLElement, change: number, duration: number, callback: () => void, isLinear?: boolean) {
    const start = element.scrollLeft;
    const increment = 20;
    let position = 0;
    const animateScroll = (elapsedTime) => {
      elapsedTime += increment;
      if (isLinear === true) {
        position = this.linearTween(elapsedTime, start, change, duration);
      } else {
        position = this.easeInOutQuad(elapsedTime, start, change, duration);
      }
      element.scrollLeft = position;
      if (elapsedTime < duration) {
        setTimeout(() => {
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
}
