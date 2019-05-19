import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { NewsArticle, NewsActionsData } from '../shared/news-article';
import { tap, map, scan, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { NewsApiService } from '../shared/news-api.service';
import { NewsSource } from '../shared/news-source';
import { NewsActionEvent } from '../newscard-actions/newscard-actions.component';
import { NewsCardEvents } from '../newscard/newscard.component';

@Component({
    selector: 'news-list',
    templateUrl: './news-list.component.html',
    styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;
    sub: Subscription = new Subscription();

    @Input() numFetch: number = 25;
    @Input() newsSourceName: string = "The New York Times";


    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();

    page: number = 1;
    cachedSize: number = 0;

    articles: NewsArticle[] = [];
    sources$: Observable<NewsSource[]>;

    constructor(private newsService: NewsApiService,
        private changeDet: ChangeDetectorRef,
        private scrollDispatcher: ScrollDispatcher) {
    }

    trackByIdx(i, newsArticle: NewsArticle) {
        return newsArticle.id;
    }

    ngOnInit() {
        console.log(this.newsSourceName);

        this.sub.add(this.newsService.initSources().pipe(
            switchMap((sourceArray: NewsSource[]) => {
                const _source =
                    sourceArray.filter((source: NewsSource) => source.name === this.newsSourceName)[0];
                if (_source) {
                    this.cachedSize = this.numFetch;
                    return this.newsService
                        .initArticles(_source, this.numFetch).pipe(
                            tap(x => {
                                console.log("Fetching more articles");
                                this.cachedSize = this.cachedSize + this.numFetch;
                                this.articles = [...this.articles, ...x];
                            }));
                } else { return of([]); }
            })).subscribe());

        this.sub.add(this.scrollDispatcher.scrolled().pipe(
            filter(event => this.scrollViewPort.getRenderedRange().end
                >= (this.cachedSize - this.numFetch)),
        ).subscribe(event => {
            this.page++;
            this.newsService.getArticlesByPage(this.page, this.numFetch);
        }));

    }

    ngOnDestory() {
        this.sub.unsubscribe();
    }

    _onChanged($event: NewsCardEvents) {
        const idx = this.articles.findIndex(x => x.id === $event.id);
        this.articles[idx].newsActionData = ($event as NewsActionsData);
        this.onChanged.emit($event);
    }
    _onViewArticle($event) {
        this.onViewArticle.emit($event);
    }

}
