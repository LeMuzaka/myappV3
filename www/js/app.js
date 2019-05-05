$(document).ready(function(){
    
    // loop over array and use elements to change src attribute of img tag
    var images = ["quote/quote7.png", "quote/quote3.jpg", "quote/quote4.JPG","quote/quote5.png", "quote/quote2.jpg", "quote/quote8.jpg","quote/quote6.jpg"];
    // carousel will start at image at index 0;
    index = 0;
    // Set the src attribute value using element at index 0 of images
    $("#carousel").attr("src", images[index]);

    // run this code every 3000 ms ( 3 seconds )
    setInterval(function(){
        // When slide out, use 0 means no slide out animation (no animation
        // delay as per docs ).
        $("#carousel").slideToggle(0);

        // Go to next item in array
        index += 1;

        // If array end reached, go back to index 0, i.e first element in array
        if( index > images.length - 1 )
        {
            index = 0;
        }
        // Set new value for src attribute
        $("#carousel").attr("src", images[index]);
        // Slide new image in, value parameter will display the slide in
        // animation
        $("#carousel").slideToggle();

    }, 25000);
});
