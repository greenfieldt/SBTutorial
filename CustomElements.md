**Turning Our Storybook Component into a Custom Element**
=====================================
<div class="header-columns">
    <div class="header-name-date">

**Author:** *Timothy Greenfield* 

**Date:** *??/??/??*
	</div>
	<div class="header-author-image">

![The Author](https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/IncreateSoftware%2Ftim.jpg?alt=media&token=8a6dbaff-7b83-484f-9be5-b8436b737878 "The Author")
	</div>
</div>

---

In this tutorial we are going to take the component we developed in
our Storybook tutorial using component driven development principals
into a custom element.  And then to show it can be used anywhere we
will embedded it into this page!
    
Custom Elements are a great solution for large organizations that have
      made a big investment in legacy code and can't change their
      tooling every six months but still would like to take advantage
      of the most advanced tools and methodologies.
	  
View the source of this page to see the custom element tag.
      Behind the scenes I'm lazy loading the javascript
      bundle. One thing to keep in mind is that  angular custom
      elements can be a little bit large (this one is).

If you select a new newsource or bring up the settings dialog you will
see there is one issue with the Overlay Component.  This is an open
bug we are discussing. 

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
<link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">


<script
src='https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/IncreateSoftware%2Fnews-app-696119f1e6af3575acfc.js?alt=media&token=375e81ab-5631-471d-b929-05321e0905d8'
type="text/javascript'>

</script>

<div class="news-app">

<news-source> </news-source>

</div>
