$("document").ready(function(){
	var url = '../chatBot/index.html';

	$(function() {
	  $.get(url, function(data) {
		console.log(data);
		$('.chatbot').html(data);
	  });
	});
});