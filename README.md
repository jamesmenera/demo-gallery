#jQuery Demo Gallery
This is a small example of a jQuery Gallery hooked up to Google API.


###Step 1:
If you have GIT and want to clone this repo.

git clone git@github.com:jamesmenera/demo-gallery.git

or

Download the zip

###Step 2:
Get you own API ID by going to [http://code.google.com/apis/console](http://code.google.com/apis/console) and sign in using your gmail account

Copy and paste a broswer api key into the "apiKey" variable.


###Step 3:
Also set up a Custom Search Engine @ [https://www.google.com/cse/all](https://www.google.com/cse/all) 

When asked "Sites to Search" type www.google.com/*

Then click "Control Panel"

Turn "Image Search"

Refresh your browser

Click "Search Engine ID" and copy and paste into the "cx" variable.

###Step 4:
Change the size of the default pictures you want to receive from Google API in the "size" variable.

Using this as a reference [ https://developers.google.com/custom-search/v1/using_rest#imgSize]( https://developers.google.com/custom-search/v1/using_rest#imgSize)

####Note:
As of now only the first 10 photos will show up.

###enjoy!

