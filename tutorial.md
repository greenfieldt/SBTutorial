** Component Driven Development using StoryBook and Angular **
=====================================
**Author:** *Timothy Greenfield*

**Date:** *5/11/19*

---

In this tutorial we will make a simple Angular App that downloads an
infinite list of News Articles from the NewsAPI.org website and
displays them as a lazyloaded infinite list in Angular.  We will use
StoryBook to develop this App in a CDD methodology.


Technologies (StoryBook, Angular, NGXS, Angular Material)

## Step 1 -- Create a New Angular Project
Our first step will be to start a new angular project.  For this
project we will not use angular routing and we will select SCSS as our
styling engine.  

### Installing tooling
We are going to assume you've already done this

### Making a new project
 - ng new storybook
  (do not enable angular routing)
  (select SCSS)

### Testing the install by using 
- ng serve
  (navigate to localhost:4200)


## Step 2 -- Install Storybook
Our second step is to install StoryBook.  StoryBook has a QuickStart
guide and a StorbyBook for Angular guide.  The quick start guide
advises you to use install the storybook cli and then use sb init.
Many people people have had problems with that when installing
storybook on ongoing problems.  But let's just give it a try since our
project is brand new

(a little aside on npx -- it allows you to run commands that you don't
use very much with out install the softare)

### Installing Storybook
- npx -p @storybook/cli sb init
  we can see that sb init was able to detect we are using Angular

Let's see what changed

Storybook updated Package.JSON
It added a storybook script to start storybook on port 6006
It added a bild storybook script 
It added @babel/core, babel-loader,
@storybook/[angular|addon-notes|addon-actions|addon-links|addons]

Storybook created new directory called stories and addead a default
story to it (src/stories/index.stories.ts)

Storybook modified your tsconfig.app.json and added ##/#.stores.ts to
the excludes array

Storybook created a .storybook/config.js file that controls what
stories get loaded

Storybook created a .storybook/addons.js file that does something?

### Running Storybook
- npm run storybook  (kind of slow at the best of times)

## Step 3 -- What's an Addon?
Addons allow you to increase the capabilities of Storybook.  One of
the most popular addons is known as Knob and it allow you to fiddle
with the state that you pass into (mainly react components).  I
haven't used that one so much but I do use the ViewPort addon so I can
be "mobile first"

- npm i --save-dev @storybook/addon-viewport

- edit .storybook/addons.js and add
  import '@storybook/addon-viewport/register';

### Test the Addon
 Run StoryBook and you will see a new icon

## Step 4 -- Define our Data Model
We are going to make a News Card --  This card should be responsive
and display a news organization, a picture, a headline, and a like
button.  If the you click in the picture then you should be taken to
the news article and we are going to make a News List -- This will be an infinite list
of such cards reading from the News API web service.

I'm going to give a super high level review of the data model so we
have some understanding of what is happening

### Add shared/service
- Add news-api-service.ts
Brief Explanation - This service creates a Subject that pushes News
Articles it receives by querying the newsapi.com api
```typescript
        this.httpClient.get('https://newsapi.org/v2/everything?sources=' 
	+ this.newsSource.id + '&pageSize=' + pagesize + '&page=' + page 
	+ '&apiKey=' + apiKey).pipe(
            map(data => data['articles']),
            map(articles => {
                return articles.map((article) => {
                    let _na: NewsArticle = article as NewsArticle;
		    ... //add some more information
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
            this.resultStream.next(x);
        })
```
### Add shared/state
- Add news.state (NGXS state file)
- Add news.actions (NGXS action definitions)

Brief explanation - news.state is the controller of the system.  
It exposes a NGXS state object 

``` typescript
@State<NewsStateModel>({
    name: 'news',
    defaults: {
        loading: true,
        newsFeed: [],
	...
    }
})
```


``` typescript
export class InitArticles {
    static readonly type = '[News] Initialize a stream of articles from server';
    constructor(public payload: NewsSource) { }
}

export class GetMoreArticles {
    static readonly type = '[News] Get more articles from server';
    constructor() { }
}
```


newsFeed contains an infinite array of newsArticles obtained from
newsapi.com 


### Add shared/model
- add news-article.ts
Brief Explanation -- news-article types the news-api data structure 

``` typescript
export class NewsArticle_NewsApiV2 {
    author: string = "";
    content: string = "";
    description: string = "";
    publishedAt: Date;
    source: Source;
    title: string = "";
    url: string = "";
    urlToImage: string = ""
}
```

### Use of the model
In a component that lists news articles (with a selector like: news-card-list)
``` typescript
    //observable of the data source
    @Select(NewsState.newsFeed) articles$: Observable<NewsArticle[]>;

    //do something with the data and ....

    //call get more actions when you need more data (like in a scrollviewport)
        this.SICSubscription = this.scrollViewPort.scrolledIndexChange.pipe(
            debounceTime(100),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();
                if (end && end === total) {
                    this.store.dispatch(new GetMoreArticles());
                }
            })
        ).subscribe();

```


And at the end of the day you use it like this in a sample application
``` typescript

import { Component } from '@angular/core';
import { Store } from '@ngxs/store';


import {
    GetSources,
    InitArticles,
} from './shared/state/news.actions';

import { NewsSource } from './shared/model/news-source';


@Component({
    selector: 'news-app',
    templateUrl: '<news-card-list></news-card-list>',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'news-app';

    constructor(private store: Store) {}

    ngOnInit() {
        const newsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };

        this.store.dispatch(new GetSources());
        this.store.dispatch(new InitArticles(newsSource));
    }
}

```


## Step 5 - News Card Component

Ok, we have access to all the data we could ever need so let's get
back to StoryBook and try to create the situation we just talked about
in a Component Driven Development way.

### Create a new news card component 
- ng g component newscard

### Add a StoryBook story for this new component
Before we can add a new story we have to make a decision.  StoryBook
doesn't come configured to read stories dynamically <check this: the
docs say it doesn't come configured but that appears to have changed>.  As they state in
their documentation this gets old fast.  Let's add some code to
auto-load all the stories in one of two ways:  You can either
put your stories at the same level as your components or in the
src/stories folder.


``` typescript
//Option 1: load from the src/stories folder
import { configure } from '@storybook/angular';

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

``` typescript

//Option 2: automatically import all files ending in #.stories.ts
import { configure } from '@storybook/angular';

const req = require.context('../src/', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

I'm going to choose to put my stories at the same level of my
components (Option 2).

- Create a file called news-card.stories.ts

Here is our basic template

``` typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { NewscardComponent } from './newscard.component';

export const newsCardActions = {
};


storiesOf('Composite/News Card', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewscardComponent],
            imports: [],
        }),
    )
    .add('default', () => {
        return {
            template: `<newscard></newscard>`,
            props: {},
        };
    });
```

now if we go back to Storybook we can see there is a new section
called composite with a new subsection called NewsCard and when click
on it we see the Angular default text "newscard works!"


## Step 6 - Create a basic News Card
### Newscard.component.html

``` html
<mat-card fxLayout='column' fxFlex="1 1 auto" class="mat-card">
  <img #ngIf="newsArticle.urlToImage" mat-card-image
       class="mat-card-image" src={{newsArticle.urlToImage}}
       alt="" (click)="_onViewArticle()">

  <img #ngIf="!newsArticle.urlToImage" mat-card-image
       class="mat-card-image" src="../../assets/errorImg/cantLoadImg.png" alt="">

  <div class="center">
    <mat-card-header class="hrader-top-to-bottom">
      <div mat-card-avatar [ngStyle]="{'background-image':
				      'url(' + newsArticle.sourceImage
				      + ')'}"
	   class="header-image">
      </div>
      <mat-card-title class="title">
	{{newsArticle.title}}
      </mat-card-title>
      
      <mat-card-subtitle class="subtitle" >
	{{newsArticle.source.name}}
      </mat-card-subtitle>
  </mat-card-header>

  <mat-card-content class="mat-card-content">
    <p>
      {{newsArticle.description}}
    </p>

  </mat-card-content>

  <mat-card-actions class="mat-action-content">

  </mat-card-actions>
  </div>

</mat-card>

```

Let's add some roughed out placeholders for our news card.  When we
recompile and check story book we will find chrome complaining that
mat-card-title is not a known element.  The reason for this is that
the storybook story is taking the place of your app module.  So we
have to load all of our dependencies in the story itself and since we
are using Angular Material -- nothing is working.

- npm i @angular/material

``` typescript
//add the following modules to our newscard.stories.ts decleration array
[MatButtonModule,
MatCardModule,
MatMenuModule,
MatToolbarModule,
MatIconModule,
MatSidenavModule,
MatListModule,
MatFormFieldModule,
MatAutocompleteModule,
MatBadgeModule,
FlexLayoutModule]

```


``` typescript

import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

//All of our Material Design stuff
import {
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'

//Some data model bits and pieces
import { NewsCardComponent, NewsCardOrientation } from './news-card.component';
import { NewsArticle } from '../shared/model/news-article';

//The data store
import { NgxsModule } from '@ngxs/store';


//Test Data
export const testNewsArticle: NewsArticle = {
    id: '12345657890987654321',
    sourceImage: 'http://www.nytimes.com/services/mobile/img/android-newsreader-icon.png',
    author: 'SARA BONISTEEL',
    content: 'The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]',
    publishedAt: new Date('2019-03-22T16:33:58Z'),
    title: 'Wait, How Did You Get Into Collee?',
    source: { id: 'the-new-york-times', name: 'The New York Times' },
    description: 'How first-generation students learn about the myth of meritocracy.',
    urlToImage: 'https://pixel.nymag.com/imgs/daily/intelligencer/2019/03/26/26-robert-mueller.w700.h467.jpg',
    url: 'https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html',
    numLikes: 1,
    hasLiked: false,
    comments: ['Comment One', 'Comment Two', 'Comment Three'],
    isStared: false,
}

export const newsCardActions = {
    onViewArticle: action('onViewArticle'),
};


storiesOf('Composite/News Card', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsCardComponent,
            ],
            imports: [
                MatButtonModule,
                MatCardModule,
                MatMenuModule,
                MatToolbarModule,
                MatIconModule,
                MatSidenavModule,
                MatListModule,
                MatFormFieldModule,
                MatAutocompleteModule,
                MatBadgeModule,
                FlexLayoutModule,
                NgxsModule.forRoot()
            ],
        }),
    )
    .add('default', () => {
        return {
            template: 
	    `<news-card [newsArticle]="testNewsArticle"
	               (onLiked)="onLiked($event)"
	               (onViewArticle)="onViewArticle($event)"
	               (onStar)="onStar($event)"
	               (onComment)="onComment($event)"
	               [newsCardOrientation]="cardOrientation"
	    ></news-card>`,
            props: {
                testNewsArticle,
                cardOrientation: NewsCardOrientation.topToBottom,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })

```

