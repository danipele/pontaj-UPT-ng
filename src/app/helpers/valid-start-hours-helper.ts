import { Injectable } from '@angular/core';
import { IEvent } from '../models/event.model';

export interface Hour {
  displayValue: string;
  value: number;
}

export const HOURS: Hour[] = [
  { displayValue: '0:00', value: 0 },
  { displayValue: '1:00', value: 1 },
  { displayValue: '2:00', value: 2 },
  { displayValue: '3:00', value: 3 },
  { displayValue: '4:00', value: 4 },
  { displayValue: '5:00', value: 5 },
  { displayValue: '6:00', value: 6 },
  { displayValue: '7:00', value: 7 },
  { displayValue: '8:00', value: 8 },
  { displayValue: '9:00', value: 9 },
  { displayValue: '10:00', value: 10 },
  { displayValue: '11:00', value: 11 },
  { displayValue: '12:00', value: 12 },
  { displayValue: '13:00', value: 13 },
  { displayValue: '14:00', value: 14 },
  { displayValue: '15:00', value: 15 },
  { displayValue: '16:00', value: 16 },
  { displayValue: '17:00', value: 17 },
  { displayValue: '18:00', value: 18 },
  { displayValue: '19:00', value: 19 },
  { displayValue: '20:00', value: 20 },
  { displayValue: '21:00', value: 21 },
  { displayValue: '22:00', value: 22 },
  { displayValue: '23:00', value: 23 },
  { displayValue: '24:00', value: 24 }
];

@Injectable()
export class ValidStartHoursHelper {
  setStartHours(
    events: IEvent[],
    projectRestrictedStartHour?: number,
    projectRestrictedEndHour?: number,
    eventLength?: number,
    editEvent?: IEvent
  ): Hour[] {
    const hours = this.setAllHours(eventLength, projectRestrictedStartHour, projectRestrictedEndHour);

    events.forEach((event) => {
      if (!editEvent || event.start.getHours() !== editEvent.start.getHours()) {
        const nrOfHours = (event.end.getHours() === 0 ? 24 : event.end.getHours()) - event.start.getHours();
        let startHour = event.start.getHours();
        this.removeHours(startHour, nrOfHours, hours);
        if (eventLength) {
          for (let i = 0; i < eventLength - 1; i++) {
            startHour -= 1;
            this.removeHours(startHour, 1, hours);
          }
        }
      }
    });
    return hours;
  }

  removeHours(startHour: number, nrOfHours: number, hours: Hour[]): void {
    let startHourIndex = -1;
    let index = 0;
    for (const hour of hours) {
      if (hour.value === startHour) {
        startHourIndex = index;
        break;
      }
      index += 1;
    }
    if (startHourIndex !== -1) {
      hours.splice(startHourIndex, nrOfHours);
    }
  }

  removeOutOfRestrictedHours(hours: Hour[], startHour?: number, endHour?: number): Hour[] {
    if (startHour) {
      while (hours[0].value < startHour) {
        hours = hours.splice(1);
      }
    }

    if (endHour) {
      while (hours[hours.length - 1].value > endHour - 1) {
        hours = hours.splice(0, hours.length - 1);
      }
    }
    return hours;
  }

  setAllHours(eventLength?: number, projectRestrictedStartHour?: number, projectRestrictedEndHour?: number): Hour[] {
    let hours: Hour[] = [];
    HOURS.slice(0, HOURS.length - 1).forEach((hour) => hours.push(hour));
    if (eventLength) {
      hours = hours.slice(0, hours.length - eventLength + 1);
    }
    hours = this.removeOutOfRestrictedHours(hours, projectRestrictedStartHour, projectRestrictedEndHour);

    return hours;
  }
}
