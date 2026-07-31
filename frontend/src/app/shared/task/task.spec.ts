import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Task } from './task';

describe('Task', () => {
  let component: Task;
  let fixture: ComponentFixture<Task>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task],
    }).compileComponents();

    fixture = TestBed.createComponent(Task);
    fixture.componentRef.setInput('task', {
      id: 1,
      title: 'Test task',
      category: null,
      displayedDate: '2026-07-30T00:00:00',
      isCompleted: false,
      priority: 1
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
