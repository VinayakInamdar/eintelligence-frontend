import {Component, NgModule, OnInit} from '@angular/core';
import { ListInterface, List } from 'src/app/shared/model/kanban-board/list/list.model';
import { LocalService } from 'src/app/shared/services/kanban-board/local/local.service';
import { MovementIntf } from 'src/app/shared/model/kanban-board/card/movement';
import { BoardModel } from 'src/app/shared/model/kanban-board/board/board.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/shared/model/kanban-board/card/card.model';

export class Column {
  constructor(public name: string, public tasks: Lead[]) { }
}

export class Lead {
  constructor(public header: string, public leadSource: string, public createdDate: string) { }
}
export class Board {
  constructor(public name: string, public columns: Column[]) { }
}

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {


  lists: ListInterface[];

  newLead: Lead[] = [
    {
      header: "#1 - Prof. Hobart Reichert",
      leadSource: "Google Lead Value",
      createdDate: "2 hrs ago"
    },
    {
      header: "#2 - Prof. Saul Heller",
      leadSource: "Facebook Lead",
      createdDate: "2 hrs ago"
    },
    {
      header: "#3 - Arvilla Wisoky",
      leadSource: "Google Lead Value",
      createdDate: "2 hrs ago"
    }
  ];

  contactLead: Lead[] = [
    {
      header: "#11 - Ruthe Marvin",
      leadSource: "Google Lead Value",
      createdDate: "2 hrs ago"
    },
    {
      header: "#12 - Cecelia Hyatt",
      leadSource: "Facebook Lead",
      createdDate: "2 hrs ago"
    },
    {
      header: "#13 - Stefan Johns",
      leadSource: "Facebook Lead",
      createdDate: "2 hrs ago"
    }
  ];


  qualifiedLead: Lead[] = [
    {
      header: "#21 - Makenzie Williamson DVM",
      leadSource: "Google Lead Value",
      createdDate: "2 hrs ago"
    },
    {
      header: "#24 - Dominic Daugherty",
      leadSource: "Facebook Lead",
      createdDate: "2 hrs ago"
    },
    {
      header: "#25 - Nichole Hahn",
      leadSource: "Facebook Lead",
      createdDate: "2 hrs ago"
    }
  ];


  board: Board = new Board('Lead Board', [

    new Column('New', this.newLead),
    new Column('Contacted', this.contactLead),
    new Column('Qualified', this.qualifiedLead)
  ]);


  constructor(private localService: LocalService) { }

  ngOnInit() {

    const board = this.localService.getBoard();
    this.lists = board.lists || this.initKanboardList();

    // ideally retrive and initialize from some storage.

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  addList() {
    const newList: ListInterface = new List();
    newList.position = this.lists.length + 1;
    newList.name = `List #${newList.position}`;
    if (this.lists === undefined) {
      this.lists = [];
    }
    this.lists.push(newList);
  }

  moveCardAcrossList(movementInformation: MovementIntf) {
    const cardMoved = this.lists[movementInformation.fromListIdx].cards.splice(movementInformation.fromCardIdx, 1);
    this.lists[movementInformation.toListIdx].cards.splice(movementInformation.toCardIdx , 0 , ...cardMoved);
  }

  saveBoard() {
    const boardModel = new BoardModel();
    boardModel.lists = this.lists;
    this.localService.saveBoard(boardModel);
  }

  deleteList(listIndex: number){
      this.lists.splice(listIndex,1);
  }

  private initKanboardList(): ListInterface[] {
    const newList: ListInterface = new List();
    const inProgressList: ListInterface = new List();
    const doneList: ListInterface = new List();
    newList.name = 'New';
    newList.status = 1;
    inProgressList.name = 'In Progress';
    inProgressList.status = 2;
    doneList.name = 'Done';
    doneList.status = 3;
    return [newList, inProgressList, doneList];
  }
}

