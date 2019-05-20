import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { first, map, tap, scan, catchError } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';
import { NewsArticle, NewsActionsData } from './news-article';
import { NewsSource } from './news-source';




@Injectable({
    providedIn: 'root'
})
export class NewsApiService implements OnDestroy {
    newsSource: NewsSource;
    apiKey: string = '';

    page: number = 0;

    resultStream: Subject<NewsArticle[]> = new Subject();
    private cachedSources$: Observable<any>;


    constructor(private httpClient: HttpClient) {
    }

    ngOnDestroy() {
        this.resultStream.complete();
    }

    setAPIKey(_apiKey: string) {
        this.apiKey = _apiKey;
    }

    initSources(): Observable<NewsSource[]> {
        if (this.apiKey === '') {
            throw new Error("You must provide a News API Key");
        }

        if (!this.cachedSources$) {
            this.cachedSources$ = this.httpClient
                .get('https://newsapi.org/v2/sources?apiKey=' + this.apiKey);
        }
        return this.cachedSources$.pipe(
            map(data => data['sources'] as NewsSource[]));
    }

    initArticles(id: NewsSource, pagesize = 50): Observable<any> {
        if (this.apiKey === '') {
            throw new Error("You must provide a News API Key");
        }

        this.newsSource = id;
        //news-api.org requires you to start pagination on page 1
        this.getArticlesByPage(1, pagesize);
        return this.resultStream.asObservable();
    }


    _id = 1;
    getArticlesByPage(page, pagesize = 50) {
        this.httpClient.get('https://newsapi.org/v2/everything?sources='
            + this.newsSource.id
            + '&pageSize=' + pagesize
            + '&page=' + page
            + '&apiKey=' + this.apiKey).pipe(
                map(data => data['articles']),
                map(articles => {
                    return articles.map((article) => {
                        let _na: NewsArticle = article as NewsArticle;
                        _na.id = (this._id++).toString();
                        _na.newsActionData = new NewsActionsData();
                        return _na;
                    });
                }),
                first(), //there is only going to be one of these
                catchError((error) => {
                    console.log("Http error", error);
                    return of(error);
                })
            ).subscribe((x) => {
                this.resultStream.next(x);
            });
    }
}
