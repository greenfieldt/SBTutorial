import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface NewsActionsData {
    numComments: number;
    numLikes: number;
    hasLiked: boolean;
    stared: boolean;
}

export const newsActionDataDefault: NewsActionsData = {
    numComments: 0,
    numLikes: 0,
    hasLiked: false,
    stared: false
};

export interface NewsActionEvent extends NewsActionsData {
    action: string;
}




@Component({
    selector: 'newscard-actions',
    templateUrl: './newscard-actions.component.html',
    styleUrls: ['./newscard-actions.component.scss']
})
export class NewscardActionsComponent implements OnInit {

    constructor() { }
    ngOnInit() { }

    @Input() data: NewsActionsData = newsActionDataDefault;
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();


    _onComment() {
        this.data.numComments++;
        this.onChanged.emit({ ...this.data, action: 'onComment' });

    }
    _onLiked() {
        if (this.data.hasLiked) {
            this.data.hasLiked = false;
            this.data.numLikes--;
        }
        else {
            this.data.hasLiked = true;
            this.data.numLikes++;
        }

        this.onChanged.emit({ ...this.data, action: 'onLiked' });
    }
    _onStar() {
        this.data.stared = !this.data.stared;
        this.onChanged.emit({ ...this.data, action: 'onStar' });
    }


}
