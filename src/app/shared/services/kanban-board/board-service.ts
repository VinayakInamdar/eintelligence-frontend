import {Injectable} from '@angular/core';
import { BoardModel } from '../../model/kanban-board/board/board.model';


export abstract class BoardService {
  public abstract saveBoard(board: BoardModel );

  public abstract getBoard(): BoardModel;
}
