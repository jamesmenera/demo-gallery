//This is a shorthand version of the jQuery's $(document).ready() function.
$(function(){
  //ApiKey = You can get your own API ID by going to http://code.google.com/apis/console and sign in using your gmail account copy and paste a broswer api key into this variable
  var apiKey = "AIzaSyC1dXS5gGrJ2mhTk1QFWQqQCLxdN9qWmwE",
      //cx = Also set up a Custom Search Engine https://www.google.com/cse/all when asked "Sites to Search" type www.google.com/*, then click "Control Panel", Turn "Image Search", refresh your browser, click "Search Engine ID" and copy and paste in this variable
      cx = '004740881112459665936:uw1suk2hy_s',
      //you can set the size of the expected images
      //reference https://developers.google.com/custom-search/v1/using_rest#imgSize
      size = 'large';
      
      //This makes the search box go hit Google API
      //Note I pass in 'e' into the function, this stands for the actual click event
      $('#go').click(function(e){
        //I prevent the default from happening which would be submitting the form to the page
        //Instead I want to send it to Google via an AJAX call
        e.preventDefault();
        //Get the value from the "search" text box to tell it what to search for
        var query = $('#query').val(),
            //This is the google custom search url and will fill in the values from your varaibles above
            url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cx + '&searchType=image&imgType=photo&imgSize=' + size + '&q=' + query;
        
        //Clear the search sesults if there were any
        $('.thumbnail').remove();
        //I hide the gallery at first until the search results are back.
        //I could have used .show() if I had needed display: block;, but I needed inline-block so
        //I had to be specific and use .css()
        $('#gallery').css('display', 'inline-block');
        
        //Now that we have the URL built we can search Google.
        //It will make a GET http call to Google and Google will return us result in JSON
        //When the call is finished it will run the function below.
        //Pass what Google sends back to the function as the argument "data" in the parameters so 
        //we can use it to create our thumbnails.
        $.get(url, function(data) {
          
          //Using the $.when() function will wait for the $.each loop to finish before initiating the .done() function below
          $.when( 
            //Loop through the data.items aka the image data in the JSON and Parse out what you want.
            $.each(data.items, function(){
              //create an image and wrap it in html to make it look and act right on the page
              //notice we can use "this" because in this context it loops through them one at a time.
              //So using this.something will give me the value of whatever I am trying to get in the object
              //We will store some extra data in the data="" attribute on the <a> or anchor tag to use if clicked
              var image = "<li><a class='thumbnail' href='#' title='" + this.title + "' data-photo='{ \"link\": \"" + this.link + "\", \"width\": \"" + this.image.width + "px\", \"height\": \"" + this.image.height + "px\", \"caption\": \"" + this.title + "\"}'><img src='" + this.image.thumbnailLink + "' alt='" + this.title + "'/></a></li>";
              //Finally we built out new image thumbnail lets add it or .append() it to our list of $('#thumbnails)
              $('#thumbnails').append(image);
            })
          //.done() is what's called a promise. It will wait till the $.when() function says it finished
          ).done(function(){
            //Let's find the first image that google returned and make it show up in the viewer using :first which is jQuery special selector
            var firstImg = $('.thumbnail:first'),
                //We are getting the info we stored on in the data-photo="" attribute using the jQuery's .data()
                data = firstImg.data('photo'),
                //We take the link data by using the '.' notation of objects
                link = data.link,
                //Same except the height 
                height = data.height,
                //Sames except the width
                width = data.width,
                //Same except the caption
                caption = data.caption;
                
                //Let's get the viewer <img> and set the src to our new link variable with jQuery's .attr()
                $('#view img').attr('src', link);
                //Let's do the same thing with the <p> and change the text with jQuery's .text()
                $('#caption').text(caption);
                //To make our next and prev buttons work I need to know which thumbnail is curently
                //showing in our viewer. So let's mark it with extra class="" of active with jQuery's .addClass()
                $('.thumbnail:first').addClass('active');
          });
          
        });
      });
      
      //We need to use .on() because the thumbnails were not there when the page first loaded.
      //They were put there by the AJAX call -> $.get() after the page first loaded.
      //So we can get around this by binding to a higher element that was on the page when the page first loaded like <body>.
      $('body').on('click', '.thumbnail', function(){
         //data = Let's get back the data we saved on the data="" attribute
        var data = $(this).data('photo'),
            //link = Now that we have the data again we can say data.link to get the URL of the large size of the photo
            link = data.link,
            //height = Same thing data.height will give us a height
            height = data.height,
            //width = Same thing data.width will give us a width
            width = data.width
            //width = Same thing data.caption will give us a caption
            caption = data.caption;
            
        //Remove the active class from all the thumbnails so you don't have two "active" thumbnails.
        $('.thumbnail').removeClass('active');
        //Add the active class to the clicked thumbnail, represented by $(this)
        $(this).addClass('active');
        
        //Let's get the viewer <img> and set the src to our new link variable with jQuery's .attr()
        $('#view img').attr('src', link);
        //Let's do the same thing with the <p> and change the text with jQuery's .text()
        $('#caption').text(caption);
        //This is telling the broswer to ignore the normal behavior for <a> wanting to go the href="" attribute.
        return false;
      });
      
      //These actions on prev and next are so similar that they can share a function
      //So we can do this by sperating the selectors with a ","
      //jQuery will watch both of these for a click and execute the function
      $('.prev, .next').click(function(){
        //Let's figure out what was clicked exactly using the $(this).
        //But we really only care if the class was "next" or "prev"
        //We can use jQuery's .attr() by only passing it only one argument to the parameters,
        //it will return the class, instead of setting it. "class" is a reserved word in JS so we
        //are going to spell it wrong.
        var klass = $(this).attr('class'),
            //We are going to need to know what thumbnail was either before or after the "active" one depending
            //on whether the "prev" or "next" was clicked. So we will just grab both of them right now and figure it afterwards
            prev = $('.active').parent().prev('li').find('.thumbnail'),
            next = $('.active').parent().next('li').find('.thumbnail'),
            //We are going to need these variables but can assign them values yet because we don't know
            //whether it's "prev" or "next". So we are going to just instantiate them.
            data,
            link,
            height,
            width,
            caption;
            
        //Let's clear the "active" class from the $('.thumbnail') with jQuery's .removeClass()
        $('.thumbnail').removeClass('active');
        
        //Alright let's figure out if this was a "prev" or "next" button.
        //We can compare the klass name to what we expect the button to do.
        if (klass === 'prev'){
          //So if it passed the first test it is "prev"
          //So let's add the "active" class to the thumbnail before it
          prev.addClass('active');
          //We know which thumbnail it is now and can set the data variable now and get the info later
          //So we set the data variable using jQuery's .data()
          data = prev.data('photo');
          
        //So it failed the last test if it's this far, so it must be "next" button
        } else if (klass === 'next'){
          //So if it failed the first test it is "next"
          //So let's add the "active" class to the thumbnail after it
          next.addClass('active');
           //We know which thumbnail it is now and can set the data variable now and get the info later
          //So we set the data variable using jQuery's .data()
          data = next.data('photo');
        }
        //Now that we set the variable data to the right thumbnail we can start taking info from the data variable
        //which we got off the data="" attribute using jQuery's data(). We can now declare the values of the 
        //variables that we created in the  above "var" statement.
        
        //We take the link data by using the '.' notation of objects
        link = data.link;
        //Same but the height
        height = data.height;
        //Same but the width
        width = data.width;
        //Same but the caption
        caption = data.caption;
        
        //So know we know what thumbnail is "active" so we can have the image viewer display it
        //So we set the src="" attribute of the <img> using jQuery's .attr() property by passing a
        //second argument to set it.
        $('#view img').attr('src', link);
        //Let's do the same thing with the <p> and change the text with jQuery's .text()
        $('#caption').text(caption);
        //Should always return something in a function, so pass it false. But really it would 
        //have worked without because the element is a <span> and has no default behavior.
        return false;
      });
});
