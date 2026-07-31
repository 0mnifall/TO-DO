import { TodoTaskPreview } from "./todo-task-preview";

export interface Category {
    name: string;
    tasks: TodoTaskPreview[]
}