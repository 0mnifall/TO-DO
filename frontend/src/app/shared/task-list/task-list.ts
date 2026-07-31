import { Component, input, output } from '@angular/core';
import { TodoTaskPreview } from '../../models/todo-task-preview';
import { Task } from '../task/task';

@Component({
  selector: 'app-task-list',
  imports: [Task],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  tasks = input.required<TodoTaskPreview[]>();
  selectedId = input<number | undefined>();
  selected = output<number | undefined>();
  statusChanged = output<number>();
  addTask = output<void>();
  isAuthenticated = input<boolean>();
  filtered = input<boolean>();
}
