import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'storybook';

    newsAPIKey = '22d9615962774038a7fda97bb5b8ca2f';
    newsSource = 'The New York Times';
    numFetch = 5;
    onViewArticle($event) {
        console.log($event);
    }

    onChanged($event) {
        console.log($event);
    }

}
