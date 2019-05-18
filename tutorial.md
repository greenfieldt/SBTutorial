**Component Driven Development using StoryBook and Angular**
###### A short introduction to CDD using Storybook and Angular. In this tutorial we will make a small NewsReader app and explore Storybook's functionality ######

<div class="header-columns">
    <div class="header-name-date">

**Author:** *Timothy Greenfield*

**Date:** *5/XX/19*
</div>
<div class="header-author-image">

![The Author](https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/IncreateSoftware%2Ftim.jpg?alt=media&token=8a6dbaff-7b83-484f-9be5-b8436b737878 "The Author")
	</div>
</div>

---

![Storybook
Realtionship](https://www.learnstorybook.com/storybook-relationship.jpg
"Storybook Realtionship")

## What is Storybook? ##

> Storybook is an open source tool for developing UI components in
> isolation for React, Vue, and Angular. It makes building stunning UIs
> organized and efficient.


In this tutorial we will use Storybook to create an Angular App that
displays an infinite list of current news articles using
[Newsapi.org](https://newsapi.org/ "Newsapi.org") as our datasource.


#### The Tech: ####

  * StoryBook
  * Angular
  * NGXS
  * Angular Material

## Install Storybook ##
Our first step will be to start a new angular project.  For this
project we will not use angular routing and we will select SCSS as our
styling engine.  

#### Installing the typical Angular tooling


We'll be coming back to this in Step 3

#### Making a new project
Create a new angular project for this tutorial. No routing, SCSS.

```shell

ng new StoryBookTutorial
cd StoryBookTutorial
npm i @angular/material @angular/material @angular/animations
```

Make sure everything went fine execute `ng serve`

Open http://localhost:4200 and make sure you see the angular splash screen.

### Initialize Storybook ####

Storybook is installed as an npm package.  

`npx -p @storybook/cli sb init`


StoryBook has a QuickStart guide and a StorbyBook for Angular guide.
The quick start guide advises you to use install the storybook cli and
then use `sb init`.  This has had some problems in the past and the
safe way to go for existing projects is to follow the Angular guide
and set storybook up by hand.  It isn't too much effort and it is
guaranteed to work.


Let's see what changed


  * Storybook updated Package.JSON

	* It added a storybook script to start storybook on port 6006
	* It added a bild storybook script 
	* It added @babel/core, babel-loader,
	* @storybook/[angular|addon-notes|addon-actions|addon-links|addons]


  * Storybook created new directory called stories and addead a default
story to it (src/stories/index.stories.ts)

  * Storybook modified your tsconfig.app.json and added ##/#.stores.ts to
the excludes array


  * Storybook created a .storybook/config.js file that controls what
stories get loaded


  * Storybook created a .storybook/addons.js file that does something?


Test it out by `npm run storybook` and opening http://localhost:6006

StoryBook comes configured to read stories out of the src/stories
directory out of the box.  I would rater put my stories at the same
level as the component and the unit tests so I'm going to edit 
.storybook/config.js 

Option 1) look in src/stories
``` typescript
//Option 1: load from the src/stories folder
import { configure } from '@storybook/angular';

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Option 2) look in the src/**
``` typescript

//Option 2: automatically import all files ending in #.stories.ts
import { configure } from '@storybook/angular';

const req = require.context('../src/', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

### Adding Addons
Addons allow you to increase the capabilities of Storybook.  One of
the most popular addons is known as Knob and it allow you to fiddle
with the state that you pass into your components.  Another important
add on is called ViewPort and it will allow us to select mobile sized
view ports.

Installing an Addon is a two step semi-manual process:

`npm i --save-dev @storybook/addon-viewport`

edit .storybook/addons.js and add

`import '@storybook/addon-viewport/register';`

Test the Addon by stopping Storybook if it is still running from
before and restarting it. You should see a new icon
![Storybook with Viewport](https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/Storybook%2Fstorybook-viewport.png?alt=media&token=a1075f1b-3db4-4eb0-825b-1ed6d0c4f102 "Storybook with Viewport")

## News Data Model

With the addon working we are going to take a brief detour from
Storybook and define the data model we will be using for this
tutorial.

Our example task will be to make a news card using angular material
MatCard.  The card should be responsive
and display a news organization, a picture, a headline, some
interaction buttons (i.e., like
button) and allow you to click the picture to visit the originating
news site. Once we have a card we will make a component that display
an infinite lazy loaded list of such cards.


### Add a shared/service
We need to create a service that calls the newsapi.org service to
return news articles to us.


`ng g service shared/newsApi`


The  [NewsAPI.org](https://newsapi.org/ "NewsAPI.org") endpoint
provides a free (for limited noncommerical use) news scraping
service. If you are interested in
news aggregation you can also look at
[Newspaper3k](https://newspaper.readthedocs.io/en/latest/
"Newspaper3k") which seems to be what NewsAPI is running off of. 


We are going to use the everything end point and define the following
parameters 
	newssource (i.e., The New York Times) 
	page (i.e., 3, 4, whatever)
	pagesize (i.e, 10, 50, etc)
	API (you can get one from
	free at news org noncommerical pruposes).  

The heart of the service is an `httpclient.get` where we ask for data,
break it down, add some local state information, build it back up into
a single list and push it out in Subject that never closes.

```typescript

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { first, map, tap, scan, catchError } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';
import { NewsArticle } from '.news-article';
import { NewsSource } from '.news-source';

const apiKey = <YOUR API KEY HERE>;


@Injectable({
    providedIn: 'root'
})
export class NewsApiService implements OnDestroy {
    newsSource: NewsSource;

    page: number = 0;
    resultsPerPage: number = 20

    resultStream: Subject<NewsArticle[]> = new Subject();


    constructor(private httpClient: HttpClient) {
    }

    ngOnDestroy() {
        this.resultStream.complete();
    }

    initArticles(id: NewsSource, pagesize = 50): Observable<any> {
        this.newsSource = id;
        //news-api.org requires you to start pagination on page 1
        this.getArticlesByPage(1, pagesize);
        return this.resultStream.asObservable();
    }

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
                        _na.numLikes = 0;
                        _na.hasLiked = false;
                        _na.comments = [];
                        _na.isStared = false;
                        return _na;
                    });
                }),
                scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], []),
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
```

## Create Component

Ok, we have access to all the data we could ever need so let's get
back to StoryBook and try to create the situation we just talked about
in a Component Driven Development way.  We will start by creating our
NewsCardComponent.


`ng g component newscard`

Our NewsCard is starting life as a very simple thing.  It will take
one Input parameter which holds a NewsArticle and 4 Outputs that allow
it to emit the 4 events it will be capable of handling (star,like,view,comment)

```typescript

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../shared/news-article';

@Component({
    selector: 'newscard',
    templateUrl: './newscard.component.html',
    styleUrls: ['./newscard.component.scss']
})
export class NewscardComponent implements OnInit {

    @Input() newsArticle: NewsArticle;


    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onStar: EventEmitter<any> = new EventEmitter();
    @Output() onLiked: EventEmitter<any> = new EventEmitter();
    @Output() onComment: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onViewArticle() {
    }

    _onLikeArticle() {
    }

    _onStarArticle() {
    }

}
```

Next we will stub out the three basic section of a Mat-Card.  We are
working towards the following:


  * mat-card-image - The top image from the article

  * mat-card-header - Article title and subtitle

  * mat-card-content - Summary of article

  * mat-card-actions - 3 FontAwesome icons 
  
  We want to get rapid feedback and be able to share our progress with
  out team so we won't worry about styling until we can see our raw
  component in Storybook.
  
``` html

<mat-card>
  <img mat-card-image
       class="mat-card-image" src={{newsArticle.urlToImage}}
       alt="" (click)="_onViewArticle()">

  <div class="center">
    <mat-card-header class="hrader-top-to-bottom">
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


### Add a StoryBook story

Creating a story in storybook is, as of now, a manual process.  Create
a new file called news-card.stories.ts.  Paste our basic template code
into it.

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


### News Card Story ###

When running our components in Storybook the story will take the place
of our module in the sense that it is here were we will need to define
import array and inject any state we may need for our Component.
Storybook has the concept of a simple story and a Composite story.
Composite stories are built 

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
import { NewsCardComponent, NewsCardOrientation } from './newscard.component';
import { NewsArticle } from '../shared/model/news-article';

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
                FlexLayoutModule
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

