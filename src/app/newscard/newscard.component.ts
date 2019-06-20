import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../shared/news-article';
import { Observable, of } from 'rxjs';
import { NewsActionEvent } from '../newscard-actions/newscard-actions.component';

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

    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsCardEvents> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onChanged($event) {
        this.onChanged.emit({ ...$event });
    }
    _onViewArticle($event) {
        this.onViewArticle.emit({ ...$event, id: this.newsArticle.id });
    }

}


