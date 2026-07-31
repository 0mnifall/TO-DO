import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/paged-result';
import { TodoTask } from '../../models/todo-task';
import { TodoTaskPreview } from '../../models/todo-task-preview';
import { CreateTaskDto, UpdateTaskDto } from '../../models/task-dtos';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
    private readonly http = inject(HttpClient);

    createTask(dto: CreateTaskDto): Observable<void> {
      return this.http.post<void>('/api/tasks', dto);
    }
    
    getTasks(page: number, pageSize: number, search: string | null, isCompleted: boolean | null, categoryId: number | null): Observable<PagedResult<TodoTaskPreview>> {
      let params = new HttpParams()
        .set('Page', page)
        .set('PageSize', pageSize);

      if (search) {
        params = params.set('Search', search);
      }

      if (isCompleted !== null) {
        params = params.set('IsCompleted', isCompleted);
      }

      if (categoryId !== null) {
        params = params.set('CategoryId', categoryId);
      }

      return this.http.get<PagedResult<TodoTaskPreview>>('/api/tasks', { params });
  }

  getTaskForView(id: number): Observable<TodoTask> {
    return this.http.get<TodoTask>(`/api/tasks/${id}`);
  }

  updateTask(id: number, dto: UpdateTaskDto): Observable<void> {
    return this.http.put<void>(`/api/tasks/${id}`, dto);
  }

  clearCategory(id: number): Observable<void> {
    return this.http.post<void>( `/api/tasks/${id}/clearCategory`, null);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`);
  }

  completeTask(id: number): Observable<void> {
    return this.http.post<void>(`/api/tasks/${id}/complete`, null);
  }

  reopenTask(id: number): Observable<void> {
    return this.http.post<void>(`/api/tasks/${id}/reopen`, null);
  }
  
}
