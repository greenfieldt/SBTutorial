import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../shared/news-article';


export enum NewsCardOrientation {
    leftToRight = 1,
    topToBottom,
    topToBottomSmall

}

export enum NewsCardSize {
    extraBig = 1,
    big,
    small
}



@Component({
    selector: 'newscard',
    templateUrl: './newscard.component.html',
    styleUrls: ['./newscard.component.scss']
})
export class NewscardComponent implements OnInit {

    public NewsCardOrientation = NewsCardOrientation;
    public NewsCardSizeEnum = NewsCardSize;
    @Input() public newsCardOrientation: NewsCardOrientation
        = NewsCardOrientation.topToBottom;
    @Input() public newsCardSize: NewsCardSize = NewsCardSize.big;
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


