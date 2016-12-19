    // First route to show
    var GLOBALSTATE = {
        route: '.list-chat'
    };

    // Set first Route
    setRoute(GLOBALSTATE.route);
    $('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');

    //dirtiest, ugliest, hackiest ripple effect solution ever... but they work xD
    $('.floater').on('click', function(event) {
        var $ripple = $('<div class="ripple tiny bright"></div>');
        var x = event.offsetX;
        var y = event.offsetY;
        var $me = $(this);

        $ripple.css({
            top: y,
            left: x
        });
        $(this).append($ripple);

        setTimeout(function() {
            $me.find('.ripple').remove();
        }, 530)

    });

    // Have to Delegate ripple due to dom manipulation (add)
    $('ul.mat-ripple').on('click', 'li', function(event) {
        if ($(this).parent().hasClass('tiny')) {
            var $ripple = $('<div class="ripple tiny"></div>');
        } else {
            var $ripple = $('<div class="ripple"></div>');
        }
        var x = event.offsetX;
        var y = event.offsetY;

        var $me = $(this);

        $ripple.css({
            top: y,
            left: x
        });

        $(this).append($ripple);

        setTimeout(function() {
            $me.find('.ripple').remove();
        }, 530)
    });

    // Set Name
    setName(localStorage.getItem('username'));

    // Dyncolor ftw
    if (localStorage.getItem('color') !== null) {
        var colorarray = JSON.parse(localStorage.getItem('color'));
        stylechange(colorarray);
    } else {
        var colorarray = [15, 157, 88]; // 15 157 88 = #0f9d58
        localStorage.setItem('color', JSON.stringify(colorarray));
        stylechange(colorarray);
    }

    // Helpers
    function setName(name) {
        $.trim(name) === '' || $.trim(name) === null ? name = 'ChatBot' : name = name;
        $('h1').text(name);
        localStorage.setItem('username', name);
        $('#username').val(name).addClass('used');
        $('.card.menu > .header > h3').text(name);
    }

    // Stylechanger
    function stylechange(arr) {
        var x = 'rgba(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',1)';
        $('#dynamic-styles').text('.dialog h3 {color: ' + x + '} .i-group input:focus ~ label,.i-group input.used ~ label {color: ' + x + ';} .bar:before,.bar:after {background:' + x + '} .i-group label {color: ' + x + ';} ul.nav > li.active {color:' + x + '} .style-tx {color: ' + x + ';}.style-bg {background:' + x + ';color: white;}@keyframes navgrow {100% {width: 100%;background-color: ' + x + ';}} ul.list li.context {background-color: ' + x + '}');
    }

    function closeModal() {
        $('#new-user').val('');
        $('.overlay').removeClass('add');
        $('.floater').removeClass('active');
        $('#contact-modal').fadeOut();

        $('#contact-modal').off('click', '.btn.save');

    }

    function setModal(mode, $ctx) {
        var $mod = $('#contact-modal');
        switch (mode) {
            case 'add':
                $mod.find('h3').text('Add Contact');
                break;

            case 'edit':
                $mod.find('h3').text('Edit Contact');
                $mod.find('#new-user').val($ctx.text()).addClass('used');
                break;
        }

        $mod.fadeIn();
        $('.overlay').addClass('add');
        $mod.find('#new-user').focus();
    }

    // Set Routes - set floater
    function setRoute(route) {
        GLOBALSTATE.route = route;
        $(route).addClass('shown');

        if (route !== '.list-account') {
            $('#add-contact-floater').addClass('hidden');
        } else {
            $('#add-contact-floater').removeClass('hidden');
        }

        if (route !== '.list-text') {
            $('#chat-floater').addClass('hidden');
        } else {
            $('#chat-floater').removeClass('hidden');
        }

        if (route === '.list-chat') {
            $('.mdi-menu').hide();
            $('.mdi-arrow-left').show();
            $('#content').addClass('chat');
        } else {
            $('#content').removeClass('chat');
            $('.mdi-menu').show();
            $('.mdi-arrow-left').hide();
        }
    }

    // Colorpicker
    var cv = document.getElementById('colorpick');
    var ctx = cv.getContext('2d');
    var img = new Image();


    img.onload = function() {
        ctx.drawImage(img, 0, 0, img.width, img.height);
    };


    //todo optimize
    $('#username').on('blur', function() {
        setName($(this).val());

        $('.card.menu > .header > img').addClass('excite');
        setTimeout(function() {
            $('.card.menu > .header > img').removeClass('excite');
        }, 800);

    });

    // Dirty Colorpicker
    $('#colorpick').on('mousedown', function(eventDown) {
        var x = eventDown.offsetX;
        var y = eventDown.offsetY;

        if (eventDown.button === 0) {
            $('.card.menu > .header > img').addClass('excite');
            setTimeout(function() {
                $('.card.menu > .header > img').removeClass('excite');
            }, 800);

            var imgData = ctx.getImageData(x, y, 1, 1).data;
            localStorage.setItem('color', JSON.stringify(imgData));
            stylechange(imgData);
        }
    });


    //add message click
    $('.mdi-send').on('click', function() {
        var $chatmessage = '<p>' + $('.chat-input').val() + '</p>';
        
        var test = $("ul.chat li:last-children div").hasClass("current");
	
	if($("ul li:last-child div").hasClass("current")){
		$('ul li:last-child div').append($chatmessage)
		$('ul li>last-child').append("<time>"+pegarData()+"</time>")
	}else {
		$("ul.chat").append("<li><img src='img/homem.png'><div class='message current'><p>"+$chatmessage+"</p></div></li>");
	}
	 
        $('.chat-input').val('');
    });
//add nessage enter
    $('.chat-input').on('keyup', function(event) {
        event.preventDefault();
        if (event.which === 13) {
            $('.mdi-send').trigger('click');
        }
    });

    $('.list-text > ul > li').on('click', function() {
        $('ul.chat > li').eq(1).html('<img src="' + $(this).find('img').prop('src') + '"><div class="message"><p>' + $(this).find('.txt').text() + '</p></div>');

        // timeout just for eyecandy...
        setTimeout(function() {
            $('.shown').removeClass('shown');

            $('.list-chat').addClass('shown');
            setRoute('.list-chat');
            $('.chat-input').focus();
        }, 300);
    });

    // List context
    // Delegating for dom manipulated list elements
    $('.list-account > .list').on('click', 'li', function() {
        $(this).parent().children().removeClass('active');
        $(this).parent().find('.context').remove();
        $(this).addClass('active');
        var $TARGET = $(this);
        if (!$(this).next().hasClass('context')) {
            var $ctx = $('<li class="context"><i class="mdi mdi-pencil"></i><i class="mdi mdi-delete"></i></li>');

            $ctx.on('click', '.mdi-pencil', function() {
                setModal('edit', $TARGET);

                $('#contact-modal').one('click', '.btn.save', function() {
                    $TARGET.find('.name').text($('#new-user').val());
                    closeModal();
                });
            });

            $ctx.on('click', '.mdi-delete', function() {
                $TARGET.remove();
            });


            $(this).after($ctx);
        }
    });

    // viewtoggle > 1000
    $('#head .mdi-chevron-down').on('click', function() {
        if ($('#hangout').hasClass('collapsed')) {
            $(this).removeClass('mdi-comment-text-outline').addClass('mdi-chevron-down');
            $('#hangout').removeClass('collapsed');
        } else {
            $(this).removeClass('mdi-chevron-down').addClass('mdi-comment-text-outline');
            $('#hangout').addClass('collapsed');
        }

    });

    // Filter
    $('.search-filter').on('keyup', function() {
        var filter = $(this).val();
        $(GLOBALSTATE.route + ' .list > li').filter(function() {
            var regex = new RegExp(filter, 'ig');

            if (regex.test($(this).text())) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // killit
    $('#contact-modal').on('click', '.btn.cancel', function() {
        closeModal();
    });

    $('#new-user').on('keydown', function(event) {
        switch (event.which) {
            case 13:
                event.preventDefault();
                $('.btn.save').trigger('click');
                break;

            case 27:
                event.preventDefault();
                $('.btn.cancel').trigger('click');
                break;
        }

    });

    $('#add-contact-floater').on('click', function() {
        if ($(this).hasClass('active')) {
            	closeModal();
            $(this).removeClass('active');

        } else {

            $(this).addClass('active');
            setModal('add');
            $('#contact-modal').one('click', '.btn.save', function() {
                $('.list-account > .list').prepend('<li><img src="http://lorempixel.com/100/100/people/1/"><span class="name">' + $('#new-user').val() + '</span><i class="mdi mdi-menu-down"></i></li>');
                closeModal();
            });
        }
    });

    $("document").ready(function(){
        $("#head h1").html("Santander");
    });