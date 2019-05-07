/*
export class NewsArticle {
    sourceImage: string = "";
    title: string = "";
    subTitle: string = "";
    description: string = "";
    articleImage: string = "";
    articleURL: string = "";

}
*/

export class Source {
    id: string = "";
    name: string = "";
}

export class NewsMetaInformation {
    id: string = '';
    hasLiked: boolean = false;
    comments: string[] = [];
    isStared: boolean = false;
    numLikes: number = 0;

}

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

export class NewsArticle extends NewsArticle_NewsApiV2 {

    id: string = "";
    sourceImage: string = "";
}

export class DisplayArticle extends NewsArticle {
    meta: NewsMetaInformation = new NewsMetaInformation
}

/*
example newsapi v2 data structure
author: "SARA BONISTEEL"
content: "The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt.↵Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]"
description: "How the Nanaimo bar, a three-layer no-bake treat from British Columbia, conquered a nation’s palate."
publishedAt: "2019-03-22T16:33:58Z"
source:
id: "the-new-york-times"
name: "The New York Times"
__proto__: Object
title: "A Bite-Size Square of Canada’s History, Culture and Craving"
url: "https://www.nytimes.com/2019/03/22/dining/nanaimo-bars.html"
urlToImage:  "https://static01.nyt.com/images/2019/03/27/dining/22nanaimo1/22nanaimo1-facebookJumbo.jpg"
*/
