import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { MatTableDataSource } from '@angular/material/table';
import { indexOf } from 'lodash';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.sass']
})
export class EventsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() events: MatTableDataSource<IEvent>;
  @Output() filterEvents = new EventEmitter<{ sort: string; direction: string }>();
  @Output() goToDay = new EventEmitter<{ day: { date: Date } }>();
  @Output() editEvent = new EventEmitter<IEvent>();
  @Output() deleteEvent = new EventEmitter<IEvent>();

  selectedEvents: IEvent[] = [];
  columnNames: string[] = ['select', 'nr_crt', 'subactivity', 'activity', 'date', 'start', '-', 'end', 'hours', 'edit', 'delete'];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sort.sortChange.pipe(tap(() => this.executeFilterEvents())).subscribe();

    this.events.sort = this.sort;

    const sortState: Sort = { active: 'date', direction: 'desc' };
    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit(sortState);
  }

  executeFilterEvents(): void {
    const params = {
      sort: this.sort.active,
      direction: this.sort.direction.toString()
    };

    this.filterEvents.emit(params);
  }

  checkAll(checked: boolean): void {
    if (checked) {
      this.events.data.forEach((course) => {
        if (!this.selectedEvents.includes(course)) {
          this.selectedEvents.push(course);
        }
      });
    } else {
      this.selectedEvents = [];
    }
  }

  checkEvent(checked: boolean, event: IEvent): void {
    if (checked) {
      this.selectedEvents.push(event);
    } else {
      const index = indexOf(this.selectedEvents, event);
      if (index !== -1) {
        this.selectedEvents.splice(index, 1);
      }
    }
  }

  isEventChecked(event: IEvent): boolean {
    const index = indexOf(this.selectedEvents, event);
    return index !== -1;
  }

  executeGoToDay(event: IEvent): void {
    this.goToDay.emit({ day: { date: event.start } });
  }

  executeEditEvent(event: IEvent): void {
    this.editEvent.emit(event);
  }

  executeDeleteEvent(event: IEvent): void {
    this.deleteEvent.emit(event);
  }
}
