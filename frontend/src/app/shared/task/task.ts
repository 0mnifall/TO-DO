import { Component, input, output } from '@angular/core';
import { TodoTaskPreview } from '../../models/todo-task-preview';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [ DatePipe ],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  task = input.required<TodoTaskPreview>();
  statusChanged = output<number>();

  isSelected = input(false);

  taskSelected = output<number>();
}