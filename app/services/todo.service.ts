import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';

import { Indexes } from '../models/indexes';
import { ToDo } from '../models/todo';

import { AppState } from '../reducers';
import { TodoActions } from '../actions';
import { TodoSelector} from '../selectors';
import { database } from 'firebase';

@Injectable()
export class TodoService {
    constructor(
        private todoActions: TodoActions,
        private store: Store<AppState>
    ) { }

    getData(): Observable<ToDo[]> {
        return this.store.let(TodoSelector.getToDos());
    }

    initialise(): void {
    }

    firebaseLoad() {
        this.store.dispatch(
            this.todoActions.firebaseLoad());
    }

    isLoaded(): Observable<boolean> {
        return this.store.let(TodoSelector.getLoaded());
    }

    isLoading(): Observable<boolean> {
        return this.store.let(TodoSelector.getLoading());
    }

    reorderItems(indexes: Indexes) {
        this.store.dispatch(
            this.todoActions.itemsReorder(indexes));
    }

    delete(todo: ToDo) {
        this.store.dispatch(
            this.todoActions.itemDelete(todo.$key));
    }

    save(todo: ToDo) {
        if (todo.$key === '') {
            todo.$key = database().ref().push().key;

            this.store.dispatch(
                this.todoActions.itemCreate(todo));
        } else {
            this.store.dispatch(
                this.todoActions.itemUpdate(todo));
        }
    }
}
