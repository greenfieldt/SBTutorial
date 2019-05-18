import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NewsArticle } from '../shared/news-article';
import { tap, scan, debounceTime } from 'rxjs/operators';
import { NewsApiService } from '../shared/news-api.service';
import { NewsSource } from '../shared/news-source';
import { NewsActionsData, NewsActionEvent } from '../newscard-actions/newscard-actions.component';

@Component({
    selector: 'news-list',
    templateUrl: './news-list.component.html',
    styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;
    sub: Subscription = new Subscription();

    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();

    page: number = 1;
    article$: Observable<NewsArticle[]>;

    constructor(private newsService: NewsApiService) {
        const newsSource: NewsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };

        this.article$ = this.newsService.initArticles(newsSource, 5).pipe(
            scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], [])
        );

        this.article$.pipe(tap(x => console.log(x))).subscribe();
    }

    trackByIdx(i, newsArticle: NewsArticle) {
        return newsArticle.id;
    }

    ngOnInit() {
        this.sub.add(this.scrollViewPort.scrolledIndexChange.pipe(
            debounceTime(100),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();
                if (end && end === total) {
                    this.page++;
                    console.log(this.page);
                    this.newsService.getArticlesByPage(this.page, 5);
                }
            })
        ).subscribe());

    }

    ngOnDestory() {
        this.sub.unsubscribe();
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
