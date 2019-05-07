import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { first, map, tap, scan, catchError } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';
import { NewsArticle } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import * as CryptoJS from 'crypto-js';

//greenfield@gmai.com key
//const apiKey = '768c2adc37a143cb8688e12c40382c9f';
//greenfit@mac.com key -- don't use 
const apiKey = '22d9615962774038a7fda97bb5b8ca2f';
//bane key
//const apiKey = '24db0625418841a79826649541c0f569';


@Injectable({
    providedIn: 'root'
})
export class NewsApiService implements OnDestroy {
    newsSource: NewsSource;

    page: number = 0;
    resultsPerPage: number = 20
    totalResults: number = -1;


    sourceStream: Subject<Object> = new Subject();
    resultStream: Subject<any[]> = new Subject();

    private cachedSources$;
    private cachedSourceSub: Subscription;

    constructor(private httpClient: HttpClient) {
        this.cachedSources$ = this.httpClient.get('https://newsapi.org/v2/sources?apiKey=' + apiKey);

    }

    ngOnDestroy() {
        this.cachedSourceSub.unsubscribe();
        this.sourceStream.complete();
        this.resultStream.complete();
    }


    initSources(): Observable<any> {
        this.cachedSourceSub = this.cachedSources$.pipe(
            map(data => data['sources'] as NewsSource),
        )
            .subscribe(x => {
                console.log("Publishing Sources Data");
                this.sourceStream.next(x);
            });

        return this.sourceStream.asObservable();
    }

    _initSources(): Observable<any> {
        //using the chachedSources variable 
        return this.cachedSources$.pipe(
            map(data => data['sources'] as NewsSource),
        );
    }



    initArticles(id: NewsSource, pagesize = 50): Observable<any> {
        this.newsSource = id;
        //news-api requires you to start pagination on page 1
        this.getArticlesByPage(1, pagesize);
        return this.resultStream.asObservable();
    }

    getArticlesByPage(page, pagesize = 50) {
        this.httpClient.get('https://newsapi.org/v2/everything?sources=' + this.newsSource.id + '&pageSize=' + pagesize + '&page=' + page + '&apiKey=' + apiKey).pipe(
            map(data => data['articles']),
            map(articles => {
                return articles.map((article) => {
                    //I need to verify that the NewsArticle is good somehow
                    let _na: NewsArticle = article as NewsArticle;
                    _na.id = CryptoJS.MD5(article.title + this.newsSource.name).toString();
                    _na.sourceImage = '../assets/images/' + this.newsSource.id + '.png';

                    _na.numLikes = 0;
                    _na.hasLiked = false;
                    _na.comments = [];
                    _na.isStared = false;
                    return _na;
                })
            }),
            scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], []),
            first(),
            catchError((error) => {
                console.log("Http error", error);
                return of(error);
            })
        ).subscribe((x) => {
            //console.log("articles by page publishing", x);
            this.resultStream.next(x);
        })
    }
}
