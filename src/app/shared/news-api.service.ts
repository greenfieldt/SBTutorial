import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { first, map, tap, scan, catchError } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';
import { NewsArticle } from './news-article';
import { NewsSource } from './news-source';


const apiKey = '22d9615962774038a7fda97bb5b8ca2f';


@Injectable({
    providedIn: 'root'
})
export class NewsApiService implements OnDestroy {
    newsSource: NewsSource;

    page: number = 0;

    resultStream: Subject<NewsArticle> = new Subject();
    private cachedSources$: Observable<any>;


    constructor(private httpClient: HttpClient) {
        this.cachedSources$ = this.httpClient
            .get('https://newsapi.org/v2/sources?apiKey=' + apiKey);
    }

    ngOnDestroy() {
        this.resultStream.complete();
    }

    initSources(): Observable<any> {
        return this.cachedSources$.pipe(
            map(data => data['sources'] as NewsSource));
    }

    initArticles(id: NewsSource, pagesize = 50): Observable<any> {
        this.newsSource = id;
        //news-api.org requires you to start pagination on page 1
        this.getArticlesByPage(1, pagesize);
        return this.resultStream.asObservable();
    }


    static _id = 1;
    getArticlesByPage(page, pagesize = 50) {
        this.httpClient.get('https://newsapi.org/v2/everything?sources='
            + this.newsSource.id
            + '&pageSize=' + pagesize
            + '&page=' + page
            + '&apiKey=' + apiKey).pipe(
                map(data => data['articles']),
                map(articles => {
                    return articles.map((article) => {
                        let _na: NewsArticle = article as NewsArticle;
                        _na.id = (NewsApiService._id++).toString();
                        _na.numLikes = 0;
                        _na.hasLiked = false;
                        _na.comments = [];
                        _na.isStared = false;
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
