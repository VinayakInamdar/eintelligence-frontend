import { Card } from 'src/app/shared/model/kanban-board/card/card.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cardFilter',
    pure: false
})
export class CardFilterPipe implements PipeTransform {
    transform(items: Card[], status: number): any {
        if (!items || !status) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.status === status);
    }
}