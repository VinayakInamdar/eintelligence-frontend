import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit {
  todolistform = new FormGroup({
    todo: new FormControl(undefined, [Validators.required]),
  })
  taskName: string = "";
  tasklist: any[]
  showTask: boolean = false;
  constructor() {
    this.tasklist = []
  }

  ngOnInit(): void {
  }

  // using to fetch form value
  submitForm(value) {
    if(value.todo != null) {
      this.tasklist.push({ taskName: value.todo })
    }
    else {
      for (let c in this.todolistform.controls) {
        this.todolistform.controls[c].markAsTouched();
    }
    }

  }

  // using  top open selected task 
  openSelectedTaskView(index) {
    this.tasklist.find((s, i) => {
      if (i == index) {
        this.taskName = s.taskName
        this.showTask = true;
      }
    })
  }

  // using to delete selected task
  deleteSelectedTaskView(index) {
    this.tasklist.splice(index, 1)
  }
}
