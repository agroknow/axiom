function getActivityStream(){
$.ajax({
       url: "http://as-ecloud.appspot.com/api/activities/jsonp",
       dataType: "jsonp",
       success: function(data)
       {
       		for(var item in data.items)
       		{
	       		$('#ticker-1').append(
	       		'<dt>'+data.items[item].actor.displayName+'</dt><dd> has '
	       		+data.items[item].verb+' '+data.items[item].object.displayName+'</dd>'
	       		);
       		}
       		

	   		/* ticker */
   			var _scroll = {
			delay: 1000,
			easing: 'linear',
			items: 1,
			duration: 0.07,
			timeoutDuration: 0,
			pauseOnHover: 'immediate'
			};
			$('#ticker-1').carouFredSel({
				width: 1000,
				align: false,
				items: {
					width: 'variable',
					height: 35,
					visible: 1
				},
				scroll: _scroll
			});

			//	set carousels to be 100% wide
			$('.caroufredsel_wrapper').css('width', '100%');

       }
    })
    
}