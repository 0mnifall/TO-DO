import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskList } from './task-list';

describe('Tasks', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    fixture.componentRef.setInput('tasks', []);
    fixture.componentRef.setInput('selectedId', undefined);
    fixture.componentRef.setInput('isAuthenticated', false);
    fixture.componentRef.setInput('filtered', false);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
