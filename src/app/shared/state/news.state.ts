import { State, Action, Selector, StateContext, Store } from '@ngxs/store';

import { tap, first } from 'rxjs/operators';
import { pipe, Observable, of, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { produce } from 'immer'

import { NewsArticle } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import {
    InitArticles,
    GetMoreArticles,
    GetSources,
    StarArticle,
    ArticlesLoaded,
    LikeArticle,
    ShowArticle,
    ChangeNewsSource
} from './news.actions';
import { NewsApiService } from '../service/news-api.service';


export class NewsStateModel {
    public newsFeed: NewsArticle[];
    public loading: boolean;
    public newsSources: NewsSource[];
    public sourcesLoaded: boolean;
}

@State<NewsStateModel>({
    name: 'news',
    defaults: {
        loading: true,
        newsFeed: [],
        newsSources: [],
        sourcesLoaded: false
    }
})
export class NewsState implements OnDestroy {

    _pageNumber: number = 1;
    private _currentInfiniteNewsFeed: Observable<NewsArticle[]> = of([]);
    private _sub: Subscription;
    private _fssub: Subscription;

    @Selector()
    public static loading(state: NewsStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static newsFeed(state: NewsStateModel): NewsArticle[] {

        return produce(state.newsFeed, (x) => {
            x.sort((a, b) => {
                if (a.isStared && !b.isStared)
                    return -1;
                else if (!a.isStared && b.isStared)
                    return 1;
                else {
                    return a.publishedAt < b.publishedAt ? 1 : -1;
                }

            })
        });
    }

    @Selector()
    public static interestedFeed(state: NewsStateModel): NewsArticle[] {

        return produce(state.newsFeed, (x) => {
            return x.filter((a) => {
                return a.isStared || a.comments.length > 0 || a.numLikes > 0;
            })
        });
    }

    @Selector()
    public static newsSources(state: NewsStateModel): NewsSource[] {
        return state.newsSources;
    }

    constructor(private newsService: NewsApiService, private store: Store) {
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe()
        }
        if (this._fssub) {
            this._fssub.unsubscribe();
        }

    }

    @Action(ChangeNewsSource)
    async changeNewsSource(ctx: StateContext<NewsStateModel>,
        action: ChangeNewsSource) {

        //simple strategy to unsubscribe from the old news source and subscribe
        //to the new one

        if (this._sub)
            this._sub.unsubscribe();

        this._currentInfiniteNewsFeed = this.newsService.initArticles(action.payload, 50)
            .pipe(
                tap(articles => {
                    let _newsFeed: NewsArticle[] = ctx.getState().newsFeed;
                    let mergedArray: NewsArticle[] = this.mergeNewsArticlesArrays(_newsFeed, articles);
                    ctx.patchState({ newsFeed: mergedArray, loading: false });
                    ctx.dispatch(new ArticlesLoaded());

                }
                )
            );
        this._sub = this._currentInfiniteNewsFeed.subscribe();
    }

    @Action(InitArticles)
    async initArticles(ctx: StateContext<NewsStateModel>,
        action: InitArticles) {
        let newsSource = action.payload;
        //I'm going to try and load 10 news stories and then 50 at a time to see
        //if that is a good compromise between fast load time and performance
        this._currentInfiniteNewsFeed = this.newsService.initArticles(newsSource, 10)
            .pipe(
                tap(articles => {
                    let _newsFeed: NewsArticle[] = ctx.getState().newsFeed;
                    let mergedArray: NewsArticle[] = this.mergeNewsArticlesArrays(_newsFeed, articles);
                    ctx.patchState({ newsFeed: mergedArray, loading: false });
                    ctx.dispatch(new ArticlesLoaded());

                }
                )
            );
        this._sub = this._currentInfiniteNewsFeed.subscribe();


    }


    @Action(GetMoreArticles)
    getMoreArticles(ctx: StateContext<NewsStateModel>, action: NewsStateModel) {
        this._pageNumber++;
        let cacheSize = 50;
        ctx.patchState({ loading: true })
        this.newsService.getArticlesByPage(this._pageNumber, cacheSize);
    }

    @Action(GetSources)
    getSources(ctx: StateContext<NewsStateModel>) {
        this.newsService._initSources().pipe(
            tap(sources => {
                ctx.patchState({ newsSources: sources, sourcesLoaded: true })
            }),
            first()
        ).subscribe();
    }


    @Action(ShowArticle)
    showArticle(ctx: StateContext<NewsStateModel>, action: ShowArticle) {
        window.open(action.payload.url, "_blank");

    }


    @Action(StarArticle)
    starArticle(ctx: StateContext<NewsStateModel>, action: StarArticle) {
        let newsArticles: NewsArticle[] = ctx.getState().newsFeed;

        ctx.patchState({
            newsFeed: produce(newsArticles, (x) => {
                x.map((y) => {
                    if (y.id == action.payload.id)
                        y.isStared = !y.isStared;
                })
            })
        });
    }

    @Action(LikeArticle)
    likeArticle(ctx: StateContext<NewsStateModel>, action: LikeArticle) {
        let newsArticle: NewsArticle = action.payload;
        let newsArticles: NewsArticle[] = ctx.getState().newsFeed;
        let updatedState = produce(newsArticles, (x) => {
            x.map((x) => {
                if (x.id === newsArticle.id) {
                    if (x.hasLiked == false) {
                        x.numLikes++;
                        x.hasLiked = true;
                    }
                    else {
                        x.numLikes--;
                        x.hasLiked = false;
                    }

                }
                return x
            });
        })

        ctx.patchState({ newsFeed: updatedState });
    }



    private mergeNewsArticlesArrays(ourArray: NewsArticle[], theirArray: NewsArticle[]) {
        var hash = {};
        var ret = [];


        if (!ourArray)
            return theirArray;

        if (!theirArray)
            return ourArray;

        let ii = 0;

        for (var i = 0; i < ourArray.length; i++) {
            var e = ourArray[i];
            if (!(e.id in hash)) {
                hash[e.id] = i;
                ii++
                ret.push(e);
            }
        }

        for (var i = 0; i < theirArray.length; i++) {
            var e = theirArray[i];
            if (!(e.id in hash)) {
                hash[e.id] = ii;
                ii++;
                ret.push(e);
            }
        }

        return ret;
    }



}

