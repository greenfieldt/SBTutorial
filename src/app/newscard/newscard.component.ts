import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../shared/news-article';
import { Observable, of } from 'rxjs';
import { NewsActionsData, NewsActionEvent } from '../newscard-actions/newscard-actions.component';
import { switchMap } from 'rxjs/operators';


@Component({
    selector: 'newscard',
    templateUrl: './newscard.component.html',
    styleUrls: ['./newscard.component.scss']
})
export class NewscardComponent implements OnInit {

    @Input() newsArticle: NewsArticle;
    newsActionData: NewsActionsData;

    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();

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
        //do something
        this.onChanged.emit($event);
    }
    _onViewArticle($event) {
        //do something
        this.onViewArticle.emit($event);
    }

}


