$(function(){
  var apiKey = "AIzaSyC1dXS5gGrJ2mhTk1QFWQqQCLxdN9qWmwE",
      cx = '004740881112459665936:uw1suk2hy_s',
      size = 'large';
      
      $('#go').click(function(e){
        e.preventDefault();

        var query = $('#query').val(),
            url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cx + '&searchType=image&imgType=photo&imgSize=' + size + '&q=' + query;
            
        $('.thumbnail').remove();
        $('#gallery').css('display', 'inline-block');
        
        $.get(url, function(data) {
          
          $.when( 
            $.each(data.items, function(){
              var image = "<li><a class='thumbnail' href='#' title='" + this.title + "' data-photo='{ \"link\": \"" + this.link + "\", \"width\": \"" + this.image.width + "px\", \"height\": \"" + this.image.height + "px\", \"caption\": \"" + this.title + "\"}'><img src='" + this.image.thumbnailLink + "' alt='" + this.title + "'/></a></li>";

              $('#thumbnails').append(image);
            })
          ).done(function(){
            var firstImg = $('.thumbnail:first'),

                data = firstImg.data('photo'),
                link = data.link,
                height = data.height,
                width = data.width,
                caption = data.caption;
                
                $('#view img').attr('src', link);
                $('#caption').text(caption);
                $('.thumbnail:first').addClass('active');
          });
          
        });
      });
      
      $('body').on('click', '.thumbnail', function(){
        var data = $(this).data('photo'),
            link = data.link,
            height = data.height,
            width = data.width
            caption = data.caption;
            
        $('.thumbnail').removeClass('active');
        $(this).addClass('active');
        
        $('#view img').attr('src', link);
        $('#caption').text(caption);

        return false;
      });
      
      $('.prev, .next').click(function(){
        var klass = $(this).attr('class'),
            prev = $('.active').parent().prev('li').find('.thumbnail'),
            next = $('.active').parent().next('li').find('.thumbnail'),
            data,
            link,
            height,
            width,
            caption;
            
        $('.thumbnail').removeClass('active');
        
        if (klass === 'prev'){
          prev.addClass('active');
          data = prev.data('photo');
          
        } else if (klass === 'next'){
          next.addClass('active');
          data = next.data('photo');
        }
        
        link = data.link;
        height = data.height;
        width = data.width;
        caption = data.caption;
        
        $('#view img').attr('src', link);
        $('#caption').text(caption);

        return false;
      });
});
