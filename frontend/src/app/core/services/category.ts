import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryPreview } from '../../models/category-preview';
import { Category } from '../../models/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);

    createCategory(name: string): Observable<void> {
        const params = new HttpParams().set('name', name);
        return this.http.post<void>("/api/categories", null, { params });
    }

    getCategories(): Observable<CategoryPreview[]> {
        return this.http.get<CategoryPreview[]>('/api/categories');
    }

    getCategoryForView(id: number): Observable<Category> {
        return this.http.get<Category>(`/api/categories/${id}`);
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`/api/categories/${id}`);
    }
}
