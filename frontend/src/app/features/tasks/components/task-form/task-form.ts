import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TodoTask } from '../../../../models/todo-task';
import { TasksFacade } from '../../../../core/facades/tasks-facade';
import { SidebarStateService } from '../../../../core/services/sidebar-state';
import { TaskPriority } from '../../../../models/task-priority';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {
  private readonly tasksFacade = inject(TasksFacade);
  private readonly sidebarState = inject(SidebarStateService);

  readonly selection = this.sidebarState.selection;
  readonly task = input<TodoTask | undefined>(undefined);
  readonly categories = this.tasksFacade.categories;

  readonly taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1000)]
    }),
    priority: new FormControl<TaskPriority>(1, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    categoryId: new FormControl<number | null>(null)
  });

  constructor() {
    effect(() => this.setUpForm());
  }

  closeSidebar(): void {
    this.tasksFacade.closeSidebar();
  }

  setUpForm(): void {
    const selection = this.selection();

    if (selection?.type !== 'task') {
      return;
    }

    if (selection.mode === 'create') {
      this.taskForm.reset({
        title: '',
        description: '',
        priority: 1,
        categoryId: null
      });
      return;
    }

    const task = this.task();

    if (!task) {
      return;
    }

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      categoryId: task.categoryId
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const selection = this.selection();

    if (selection?.type !== 'task') {
      return;
    }

    const dto = this.taskForm.getRawValue();

    if (selection.mode === 'create') {
      this.tasksFacade.createTask(dto);
      return;
    }

    this.tasksFacade.updateTask(selection.id, dto);
  }

  deleteSelected(): void {
    const selection = this.selection();

    if (selection?.type === 'task' && selection.mode === 'view') {
      this.tasksFacade.deleteTask(selection.id);
    }
  }
}
