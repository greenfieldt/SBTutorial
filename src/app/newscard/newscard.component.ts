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

    @Input() newsArticle$: Observable<NewsArticle>;
    newsActionData$: Observable<NewsActionsData>;

    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();

    constructor() { }

    ngOnInit() {
        this.newsActionData$ = this.newsArticle$.pipe(
            switchMap((article: NewsArticle) => {
                return of({
                    numLikes: article.numLikes,
                    hasLiked: false,
                    stared: article.isStared,
                    numComments: article.comments.length
                });

            }));
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


