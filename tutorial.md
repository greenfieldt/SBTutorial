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

#### Final Product ####


  * [Storybook Project](https://storybook.increate.co/ "Storybook Project")

  * [Github Code](https://github.com/greenfieldt/SBTutorial "Github Code")

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
Addons allow you to increase the capabilities of Storybook.  Storybook
has notes, links, and actions installed by default.  I tend to add the following
five addons.


  * Knob - Interact with your stories
  > Storybook Addon Knobs allow you to edit React props dynamically
  >using the Storybook UI. You can also use Knobs as a dynamic variable
  >inside stories in Storybook.  
  * ViewPort - Emulate device viewports
  > Storybook Viewport Addon allows your stories to be displayed in different sizes and layouts in Storybook. This helps build responsive components inside of Storybook.
  * CSSResources - Turn on and off CSS snippets
  > Storybook Addon Cssresources to switch between css resources at runtime for your story Storybook.
  * A11y - Check for Accessibility problems
  >This storybook addon can be helpful to make your UI components more accessible.
  * Console
  >This addon helps you to get all console output in your storybook.
  
  
To install storybook addons you first do an npm install of the addon
and then import the register module to the addon.js file

`npm i --save-dev @storybook/addon-viewport @storybook/addon-console
@storybook/addon-a11y @storybook/addon-cssresources @storybook/addon-knobs`

edit .storybook/addons.js and add

```typescript
import '@storybook/addon-viewport/register';
import '@storybook/addon-console';
import '@storybook/addon-knobs/register';
import '@storybook/addon-a11y/register';
import '@storybook/addon-cssresources/register';
```

Test the Addon by stopping Storybook if it is still running from
before and restarting it. You should see a new icon for view port

Viewport button
![Storybook with Viewport](https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/Storybook%2Fstorybook-viewport.png?alt=media&token=a1075f1b-3db4-4eb0-825b-1ed6d0c4f102 "Storybook with Viewport")

Storybook Addons
![Storybook
Addons](https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/Storybook%2Fstorybook-addons.png?alt=media&token=68cf8d05-141a-4c7d-a5d0-778dc24706df
"Storybook Addons")

The console output will appear in the actions tab

#### Preview-Head ####
Storybook gives you a place to set anything you'd normally put in the
<head> tag.  

`touch .storybook/preview-head.html`

Edit the file and load our Material icons

`<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
rel="stylesheet">`

Edit src/styles.scss and import a theme
`@import '@angular/material/prebuilt-themes/deeppurple-amber.css';`


#### Work flow ####

  * Edit the story and declare your components and import your modules

  * Edit the story and pass the props to your component 

  * When you add new components or change global styles I've found it is
best to restart Storybook

  * If you don't see the addons shrink your window down to the point that
tabs show up on the bottom -> click sidebar -> click the three dots
button -> click show addons.




## Development Pattern ##
When using Storybook I like to develop in an up and down paradigm.
Given a visual design I start at the smallest component and build it
out to the largest component (typically the one where we inject state)
with minimal to no styling to validate the design pattern and data
model.  Afterwards, I got back down the chain adding the styling.

Our example task will be to make a news card using angular material
MatCard.  The card should be responsive
and display a news organization, a picture, a headline, some
interaction buttons (i.e., like
button) and allow you to click the picture to visit the originating
news site. Once we have a card we will make a component that display
an infinite lazy loaded list of such cards.

<Insert the design diagram>

#### news-article.api ####

`touch src/app/shared/news-article.ts`

edit the service and add our the following basic types 
```typescript
//defines a News Source -- i.e., The New York Times
export class Source {
    id: string = "";
    name: string = "";
}


//Defines the data returned from the NesAPI V2
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


//defines the props that NewscardActions will display and
//modify 
export class NewsActionsData {
    numComments: number = 0;
    numLikes: number = 0;
    hasLiked: boolean = false;
    stared: boolean = false;
}


//Extends the NewsAPI wtih data local to the current
//execution 
export class NewsArticle extends NewsArticle_NewsApiV2 {

    id: string = ""; 
    newsActionData: NewsActionsData;
}
```


#### news-api-service.ts ####
`ng g service shared/newAPI`

We aren't going to add anything to this file until we rough out the
first few components.


## Standard Storybook Story ##
For ever component you want to work with in Storybook you must make a
.stories file.  

Basic Storybook stories file
```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
//You may need to import other things from knobs
//like object, number, string etc
import { withKnobs } from '@storybook/addon-knobs';
import { withCssResources } from '@storybook/addon-cssresources';

//Make a action object so you can export it to components
//that include you
export const myActions = {

};

//Use '/' to make groups of stories 
storiesOf('Name displayed in Storybook', module)
    .addDecorator(withA11y)         //Accessibility
    .addDecorator(withKnobs)        //Prop manipulation
    .addDecorator(withCssResources) //CSS selection
    .addParameters({
        cssresources: [{
            id: `my style`,
            code: `<style></style>`,
            picked: false,
        },
        ],
    })
    .addDecorator(
        moduleMetadata({
            declarations: [
                //components we are using
            ],
            imports: [
             //modules needed
	       ],
        }),
    ).add('Test name displayed in stroybook', () => {
        return {
            template: `<my-component></my-component>`,
            props: {
			//whatever props your component needs
            },
        };
    });

```

All of these will start from the same basic
template. As I mentioned before I like to put my stories files at the
same level of my components so I end up with directories that look
like this.
```
~/Src/Angular/tutorials/storybook/src/app/newscard-actions $ ls -la
total 6
drwxr-xr-x   7 tim            staff     224 2019-05-19 11:04 .
drwxr-xr-x  11 tim            staff     352 2019-05-19 11:33 ..
-rw-r--r--   1 tim            staff    1518 2019-05-19 10:19 newscard-actions.component.html
-rw-r--r--   1 tim            staff      64 2019-05-19 10:24 newscard-actions.component.scss
-rw-r--r--   1 tim            staff     692 2019-05-18 07:52 newscard-actions.component.spec.ts
-rw-r--r--   1 tim            staff    1241 2019-05-19 10:50 newscard-actions.component.ts
-rw-r--r--   1 tim            staff    1935 2019-05-19 10:49 newscard-actions.stories.ts
~/Src/Angular/tutorials/storybook/src/app/newscard-actions $ 
```

## NewscardActions ##
This component will display three buttons that will allow the user to
initiate the like, comment, and star as well as reflect the results of
these actions. This is a "simple" component so it won't modify any
state it will only accept it's configuration and forward messages to it's parent.


`ng g component newscardActions`
`touch src/app/newscard-actions/newscard-actions.stories.ts`


#### news-article.api ####

```typescript
...
//defines the props that NewscardActions will display and
//modify 
export class NewsActionsData {
    numComments: number = 0;
    numLikes: number = 0;
    hasLiked: boolean = false;
    stared: boolean = false;
}
...
```

#### newscard-actions.component.ts ####

```typescript
...
    @Input() data: NewsActionsData = new NewsActionsData();
    @Output() onChanged: EventEmitter<NewsActionEvent> = new
	EventEmitter();
...
    _onComment() {
        const _data = { ...this.data, action: 'onComment' };
        _data.numComments++;
        this.onChanged.emit(_data);

    }
    _onLiked() {
        const _data = { ...this.data, action: 'onLiked' };

        if (_data.hasLiked) {
            _data.hasLiked = false;
            _data.numLikes--;
        }
        else {
            _data.hasLiked = true;
            _data.numLikes++;
        }

        this.onChanged.emit(_data);
    }
    _onStar() {
        const _data = { ...this.data, action: 'onStar' };
        _data.stared = !_data.stared;
        this.onChanged.emit(_data);
    }
...
```

#### newscard-actions.component.html ####

```html
<div class='actions'>
  <span *ngIf="data.numComments <= 0">
    <button mat-button color="primary" (click)="_onComment()">
      <mat-icon>comment</mat-icon>
    </button>
  </span>
  
  <span *ngIf="data.numComments > 0">
    <button mat-button color="primary" (click)="_onComment()">
      <mat-icon matBadge="{{data.numComments}}" matBadgePosition="above before"
		matBadgeOverlap="false" matBadgeColor="primary">comment</mat-icon>
    </button>
  </span>
  
  <span *ngIf="data.numLikes <= 0">
    <button mat-button color="primary" (click)="_onLiked()">
      <mat-icon>thumb_up_alt</mat-icon>
    </button>
  </span>
  
  <span *ngIf="!data.hasLiked && data.numLikes > 0">
    <button mat-button color="primary" (click)="_onLiked()">
      <mat-icon matBadge="{{data.numLikes}}" matBadgePosition="above before"
		matBadgeOverlap="false" matBadgeColor="primary">thumb_up_alt</mat-icon>
    </button>
  </span>
  
  <span *ngIf="data.hasLiked && data.numLikes > 0">
    <button mat-button color="primary" (click)="_onLiked()">
      <mat-icon matBadge="{{data.numLikes}}" matBadgePosition="above before"
		matBadgeOverlap="false" matBadgeColor="accent">thumb_up_alt</mat-icon>
    </button>
  </span>
  
  <span *ngIf="data.stared">
    <button mat-button color="primary" (click)="_onStar()">
      <mat-icon>star</mat-icon>
    </button>
  </span>
  
  <span *ngIf="!data.stared">
    <button mat-button color="primary" (click)="_onStar()">
      <mat-icon>star_outline</mat-icon>
    </button>
  </span>
</div>
```

#### NewscardActions.stories.ts ####


```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { object, withKnobs } from '@storybook/addon-knobs';
import { withCssResources } from '@storybook/addon-cssresources';

import {
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { NewscardActionsComponent } from './newscard-actions.component';
import { NewsActionsData } from '../shared/news-article';



export const newsActions = {
    onChanged: action('onChanged'),
};

const data_default = new NewsActionsData();
const data_liked = { ...data_default, numLikes: 5 };

storiesOf('News Card Actions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(withCssResources)
    .addParameters({
        cssresources: [{
            id: `actions:xoutline`,
            code: `<style>.actions { border: 1px solid black; }</style>`,
            picked: false,
        },
        ],
    })
    .addDecorator(
        moduleMetadata({
            declarations: [
                NewscardActionsComponent
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatBadgeModule,
            ],
        }),
    ).add('default', () => {
        return {
            template: `<newscard-actions 
[data]='data'
(onChanged)="onChanged($event)">
</newscard-actions>`,
            props: {
                data: object('data', data_default),
                onChanged: newsActions.onChanged,
            },
        };
    }).add('liked by others', () => {
        return {
            template: `<newscard-actions 
[data]='data'
(onChanged)="onChanged($event)">
</newscard-actions>`,
            props: {
                data: object('data', data_liked),
                onChanged: newsActions.onChanged,
            },
        };
    });
```

## Newscard ##
This component is responsible for displaying our news article,
intercepting any messages it gets from NewscardActions and appending
the "id" field, as well as sending the ViewArticle message.  This is a
"simple" component so it won't modify any state it will only accept
it's configuration and forward messages to it's parent.

`ng g component newscard`
`ng touch /src/app/newscard/newscard.stories.ts`

#### newscard.component.ts ####

```typescript
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
        this.onChanged.emit({ ...$event, id: this.newsArticle.id });
    }
    _onViewArticle($event) {
        this.onViewArticle.emit({ ...$event, id: this.newsArticle.id });
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

#### newscard.component.html ####

```html
<mat-card 
	  fxLayout='column' fxFlex="1 1 auto" class="mat-card">

  <img *ngIf="newsArticle.urlToImage" mat-card-image
       class="mat-card-image" src={{newsArticle.urlToImage}}
       alt="" (click)="_onViewArticle()">
  
  <img *ngIf="!newsArticle.urlToImage" mat-card-image
       class="mat-card-image" src="../../assets/errorImg/cantLoadImg.png" alt="">
  
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
  
  <mat-card-actions 
		    class="mat-action-content">
    <newscard-actions [data]='newsArticle.newsActionData'
		      (onChanged)='_onChanged($event)'>
    </newscard-actions>
  </mat-card-actions>
</mat-card>
```

#### newscard.stories.ts ####

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';

import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { withA11y } from '@storybook/addon-a11y';
import { object, withKnobs } from '@storybook/addon-knobs';


//Some data model bits and pieces
import { NewsArticle, NewsActionsData } from '../shared/news-article';
import { newsActions } from '../newscard-actions/newscard-actions.stories';
import { NewscardComponent } from './newscard.component';
import { NewscardActionsComponent } from '../newscard-actions/newscard-actions.component';
import { withCssResources } from '@storybook/addon-cssresources';


//Test Data
export const testNewsArticle: NewsArticle = {
    id: '12345657890987654321',
    author: 'SARA BONISTEEL',
    content: 'The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]',
    publishedAt: new Date('2019-03-22T16:33:58Z'),
    title: 'Wait, How Did You Get Into College?',
    source: { id: 'the-new-york-times', name: 'The New York Times' },
    description: 'How first-generation students learn about the myth of meritocracy.',
    urlToImage: 'https://pixel.nymag.com/imgs/daily/intelligencer/2019/03/26/26-robert-mueller.w700.h467.jpg',
    url: 'https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html',
    newsActionData: new NewsActionsData()
};

export const newsCardActions = {
    onViewArticle: action('onViewArticle'),
    ...newsActions
};


storiesOf('Composite/News Card', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(withCssResources)
    .addParameters({
        cssresources: [{
            id: `card:outline`,
            code: `<style>.mat-card { border: 1px solid black }</style>`,
            picked: false,
        },
        ],
    })
    .addDecorator(
        moduleMetadata({
            declarations: [
                NewscardComponent,
                NewscardActionsComponent
            ],
            imports: [
                MatButtonModule,
                MatCardModule,
                MatIconModule,
                MatBadgeModule,
                FlexLayoutModule
            ],
        }),
    ).add('default', () => {
        return {
            template: `<newscard 
[newsArticle]="testNewsArticle"
(onViewArticle)="onViewArticle($event)"
(onChanged)="onChanged($event)">
</newscard>`,
            props: {
                testNewsArticle: object('testNewsArticle', testNewsArticle),
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });
```


## News Data Model
Newscard was the last "simple" component we are going to use.  When we
implement NewscardList we will need a source of data.  Our next task
is to create a client that will return a stream of NewsArticles.


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

#### News-api.service.ts ####

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { first, map, tap, scan, catchError } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';
import { NewsArticle, NewsActionsData } from './news-article';
import { NewsSource } from './news-source';


const apiKey = 'Your API Key';


@Injectable({
    providedIn: 'root'
})
export class NewsApiService implements OnDestroy {
    newsSource: NewsSource;

    page: number = 0;

    resultStream: Subject<NewsArticle[]> = new Subject();
    private cachedSources$: Observable<any>;


    constructor(private httpClient: HttpClient) {
        this.cachedSources$ = this.httpClient
            .get('https://newsapi.org/v2/sources?apiKey=' + apiKey);
    }

    ngOnDestroy() {
        this.resultStream.complete();
    }

    initSources(): Observable<NewsSource[]> {
        return this.cachedSources$.pipe(
            map(data => data['sources'] as NewsSource[]));
    }

    initArticles(id: NewsSource, pagesize = 50): Observable<any> {
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
            + '&apiKey=' + apiKey).pipe(
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
```



## NewsList ##
The NewsList component is the first nonsimple component (i.e.,
this is one where we will inject our state)

#### News-list.component.html ####

We are going to use an experimental feature of CDK scolling called
autosize.  This will prevent us from need to style our cards so they
are exactly the same size but it will also stop some of the normal
scroll SCD features from working such as <TODO>.  

```html
<cdk-virtual-scroll-viewport autosize class="viewport">
    <span *cdkVirtualFor="let article of articles; trackBy:
			  trackByIdx" class="item"
	  >
      <newscard  [newsArticle]="article"
		 (onViewArticle)="_onViewArticle($event)"
		 (onChanged)="_onChanged($event)">

      </newscard>
    </span>
</cdk-virtual-scroll-viewport>
```

News-list.component.ts
```typescript
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
```
We implemented the the scrollDispatch here as a workaround for the
virtualSize directive side effect of disabling scrollIndexChanged.  If you have cards that are all
one size it is better to set that size explicitly with the "itemSize"
property and then use code such as the following to figure out when to
grab the next page of data

```typescript
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
```

#### news-list.stories.ts ####
```typescript
import { storiesOf, moduleMetadata, addDecorator } from '@storybook/angular';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';

import { Observable, of } from 'rxjs';
import { NewsListComponent } from './news-list.component';
import { NewscardComponent } from '../newscard/newscard.component';
import { NewscardActionsComponent } from '../newscard-actions/newscard-actions.component';


import { HttpClientModule } from '@angular/common/http';
import { newsCardActions } from '../newscard/newscard.stories';

import { withA11y } from '@storybook/addon-a11y';
import { text, number, withKnobs } from '@storybook/addon-knobs';




storiesOf('Composite/News Card List', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            declarations: [
                NewsListComponent,
                NewscardComponent,
                NewscardActionsComponent
            ],
            imports: [
                MatButtonModule,
                MatCardModule,
                MatIconModule,
                MatBadgeModule,
                FlexLayoutModule,
                ScrollingModule,
                ExperimentalScrollingModule,
                HttpClientModule

            ],
        }),
    )
    .add('default', () => {
        return {
            template: `<div class='theme-wrapper default-theme'> 
<news-list
[newsSourceName]="newsSource"
[numFetch]="numFetch"
(onViewArticle)="onViewArticle($event)"
(onChanged)="onChanged($event)">
</news-list> </div>`,
            props: {
                newsSource: text('newsSource', 'The New York Times'),
                numFetch: number('numFetch', 50),
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });
```

## Wrapping Up ##
