import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsActionsData } from '../shared/news-article';


export class NewsActionEvent extends NewsActionsData {
    action: string;
}




@Component({
    selector: 'newscard-actions',
    templateUrl: './newscard-actions.component.html',
    styleUrls: ['./newscard-actions.component.scss']
})
export class NewscardActionsComponent implements OnInit {
    @Input() data: NewsActionsData = new NewsActionsData();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();

    constructor() { }
    ngOnInit() { }



    _onComment() {
        const _data = { ...this.data, action: 'onComment' };
        _data.numComments++;
        this.onChanged.emit(_data);

    }
    _onLiked() {
        const _data = { ...this.data, action: 'onLiked' };

        if (_data.hasLiked) {
            _data.hasLiked = false;
            _data.numLikes--;
        }
        else {
            _data.hasLiked = true;
            _data.numLikes++;
        }

        this.onChanged.emit(_data);
    }
    _onStar() {
        const _data = { ...this.data, action: 'onStar' };
        _data.stared = !_data.stared;
        this.onChanged.emit(_data);
    }


}
