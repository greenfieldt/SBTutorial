import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../shared/news-article';
import { Observable, of } from 'rxjs';
import { NewsActionsData, NewsActionEvent } from '../newscard-actions/newscard-actions.component';
import { switchMap } from 'rxjs/operators';

export interface NewsCardEvents extends NewsActionEvent {
    id: string;
}

@Component({
    selector: 'newscard',
    templateUrl: './newscard.component.html',
    styleUrls: ['./newscard.component.scss']
})
export class NewscardComponent implements OnInit {

    @Input() newsArticle: NewsArticle;
    newsActionData: NewsActionsData;

    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsCardEvents> = new EventEmitter();

    itemSize = 300;

    constructor() { }

    ngOnInit() {
        if (this.newsArticle) {
            this.newsActionData = {
                numLikes: this.newsArticle.numLikes,
                hasLiked: false,
                stared: this.newsArticle.isStared,
                numComments: this.newsArticle.comments.length
            };
        }
    }

    _onChanged($event) {
        this.onChanged.emit({ ...$event, id: this.newsArticle.id });
    }
    _onViewArticle($event) {
        this.onViewArticle.emit({ ...$event, id: this.newsArticle.id });
    }

}


