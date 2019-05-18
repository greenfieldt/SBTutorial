import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'newscard-actions',
    templateUrl: './newscard-actions.component.html',
    styleUrls: ['./newscard-actions.component.scss']
})
export class NewscardActionsComponent implements OnInit {

    constructor() { }
    @Input() numComments: number = 0;
    @Input() numLikes: number = 0;
    @Input() hasLiked: boolean = false;
    @Input() stared: boolean = false;

    @Output() onComment: EventEmitter<any> = new EventEmitter();
    @Output() onLiked: EventEmitter<any> = new EventEmitter();
    @Output() onStar: EventEmitter<any> = new EventEmitter();

    _onComment() {
        this.numComments++;
        this.onComment.emit();
    }
    _onLiked() {
        if (this.hasLiked) {
            this.hasLiked = false;
            this.numLikes--;
        }
        else {
            this.hasLiked = true;
            this.numLikes++;
        }

        this.onLiked.emit();
    }
    _onStar() {
        this.stared = !this.stared;
        this.onStar.emit();
    }

    ngOnInit() {
    }

}
