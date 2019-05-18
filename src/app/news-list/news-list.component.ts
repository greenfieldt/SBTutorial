import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NewsArticle } from '../shared/news-article';
import { tap, map, scan, filter, debounceTime, switchMap } from 'rxjs/operators';
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

    @Input() numFetch: number = 5;
    @Input() newsSourceName: string = "The New York Times";


    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new EventEmitter();

    page: number = 1;
    article$: Observable<NewsArticle[]>;
    sources$: Observable<NewsSource[]>;

    constructor(private newsService: NewsApiService) {


    }

    trackByIdx(i, newsArticle: NewsArticle) {
        return newsArticle.id;
    }

    ngOnInit() {
        console.log(this.newsSourceName);
        this.article$ = this.newsService.initSources().pipe(
            switchMap((sourceArray: NewsSource[]) => {
                const _source =
                    sourceArray.filter((source: NewsSource) => source.name === this.newsSourceName)[0];
                if (_source) {
                    return this.newsService
                        .initArticles(_source, this.numFetch).pipe(
                            scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], [])
                        );
                }
                else {
                    return of([]);
                }

            }),
        );


        this.sub.add(this.article$.pipe(tap(x => console.log(x))).subscribe());

        this.sub.add(this.scrollViewPort.scrolledIndexChange.pipe(
            debounceTime(100),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();
                if (end && end === total) {
                    this.page++;
                    this.newsService.getArticlesByPage(this.page, this.numFetch);
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
