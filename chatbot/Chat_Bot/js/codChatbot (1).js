
		var accessToken = "1ef9be2566c947c5a75032342fb02840";
		var baseUrl = "https://api.api.ai/v1/";
		$(document).ready(function() {



			$("time.primeiroTime").html(pegarData());

			$(".insertText").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();

					send();
/*					
					var dados = $(".insertText").val();
	$('ul.chat').append("<li class='self'>"+
        "<div class='avatar'><img src='https://scontent-gru2-1.xx.fbcdn.net/t31.0-8/s960x960/1399682_771496639533340_826937935_o.jpg' draggable='false'/></div>"+
      "<div class='msg'>"+
        "<p>"+dados+"</p>"+
        "<time>"+pegarData()+"</time>"+
      "</div>"+
    "</li>");
	document.getElementById('input.insertText').value = ' ';;*/
				}
			});
			
		});
		
		function setInput(text) {
			$(".insertText").val(text);
			send();
		}
		
		function send() {
			var text = $(".insertText").val();
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
				success: function(data) {
					 exibirJson(data);
					setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Carregando...");
		}
		function setResponse(val) {
			//$("#response").text(val);			
		}
		
		var respTypes = [
		['<li><img src="img/homem.png"><div class="message"><p>','</p></div></li>'],
		['<li><img src="img/homem.png"><div class="message"><img href="','"></img><p>','</p><a href="','">','</a></div></li>']
		];
		
		function respType0(stringJSON,time){
		$("ul.chat").append(respTypes[0][0] + stringJSON.speech +respTypes[0][1]);
		scrollDown();
		}
		//type1 é o tipo de mensagem com imagem e texto
		function respType1(msg,time){
		
		$("ul.chat li:last-child ul.carousel").append(respTypes[1][0]+msg.imageUrl+respTypes[1][1]+msg.title+respTypes[1][2]+msg.buttons.postback+respTypes[1][3]+msg.buttons.text+respTypes[1][4]);
		scrollDown();
		}
		
		function exibirJson(data){
			var aux = 0;
		for (var i = 0; i < data.result.fulfillment.messages.length; i++) {
		
			var msg = data.result.fulfillment.messages[i];
				if(msg.speech && !msg.title && !msg.imageURL && !msg.buttons){
			//elemento.innerHTML += " -- " + msg.speech;
			respType0(msg,data.timestamp);
			} else if(msg.imageUrl && msg.title && msg.buttons && !msg.speech){
			if(aux === 0){
			aux++;
			$("ol#response").append("<li><ol class='carousel'></ol></li>");
			}
			respType1(msg,data.timestamp);
			
			} else if(!msg.imageUrl && !msg.title && msg.buttons && !msg.speech){
			respType2(msg,data.timestamp);
			}
			
			}
		}	

function pegarData(){
var currentdate = new Date(); 
var datetime = currentdate.getHours() + ":" 
			 + currentdate.getMinutes(); 
return datetime;		
}

function scrollDown(){
	$("div#content").animate({
            scrollTop: 999999
        }, 600);
}