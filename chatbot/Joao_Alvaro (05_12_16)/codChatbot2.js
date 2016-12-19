
		var accessToken = "1ef9be2566c947c5a75032342fb02840";
		var baseUrl = "https://api.api.ai/v1/";
		$(document).ready(function() {



			$("time.primeiroTime").html(pegarData());

			$("#input").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					
					send();
					
					var dados = $(".insertText").val();
	$('#response').append("<li class='self'>"+
        "<div class='avatar'><img src='https://scontent-gru2-1.xx.fbcdn.net/t31.0-8/s960x960/1399682_771496639533340_826937935_o.jpg' draggable='false'/></div>"+
      "<div class='msg'>"+
        "<p>"+dados+"</p>"+
        "<time>"+pegarData()+"</time>"+
      "</div>"+
    "</li>");
	document.getElementById('input').value = ' ';;
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
		});
		var recognition;
		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		}
	
		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}
		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}
		function setInput(text) {
			$("#input").val(text);
			send();
		}
		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Enviar");
		}
		function send() {
			var text = $("#input").val();
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
		['<li class="other"><div class="avatar"><img src="https://static.squarespace.com/static/51b3dc8ee4b051b96ceb10de/51ce6099e4b0d911b4489b79/51ce61ade4b0d911b449c9c0/1263934340007/1000w/Star%20Wars%203d.jpg" draggable="false"/></div><div class="msg"><p>','</p><time>','</time></div></li>'],
		['<li class="other"><div class="avatar"><img src="https://static.squarespace.com/static/51b3dc8ee4b051b96ceb10de/51ce6099e4b0d911b4489b79/51ce61ade4b0d911b449c9c0/1263934340007/1000w/Star%20Wars%203d.jpg" draggable="false"/></div><div class="msg"><img href="','"></img><p>','</p><a href="','">','</a><time>','</time></div></li>']
		];
		
		function respType0(stringJSON,time){
		$("ol#response").append(respTypes[0][0] + stringJSON.speech +respTypes[0][1] + pegarData() +respTypes[0][2]);
		scrollDown();
		}
		//type1 é o tipo de mensagem com imagem e texto
		function respType1(msg,time){
		
		$("ol#response li:last-child ol.carousel").append(respTypes[1][0]+msg.imageUrl+respTypes[1][1]+msg.title+respTypes[1][2]+msg.buttons.postback+respTypes[1][3]+msg.buttons.text+respTypes[1][4]+pegarData()+respTypes[1][5]);
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
	$("html, body").animate({
            scrollTop: 999999
        }, 600);
}