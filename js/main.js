$(document).ready(function(){

    var menu = $("#menu");

    $(window).scroll(function(){
        var height = menu.height();
        if ( $(this).scrollTop() > height ){
            menu.addClass('bgcolor');
        }else if( $(this).scrollTop() < height ){
            menu.removeClass('bgcolor');
        }
    });

    //плавная прокрутка до якоря
    $('a.soft[href^="#"]').click(function (event) {
        event.preventDefault();
        var el = $(this).attr('href');
        $('body').animate({ scrollTop: $(el).offset().top-100}, 500); //offset to menu
    
        $('.navbar-collapse').removeClass('in');//hide menu
        $('.navbar-toggle').addClass('collapsed');//view icon
    
        // return false;
    });

    $(".input-phone").mask("+7 (999) 999-99-99");

    // всплывающие блоки
    $(".shows").on('click', function () {
        id = $(this).data('show');
        // console.log(id);
        if($('#'+id).css('display') == 'none'){
            $('#'+id).show(300);
            $(this).children('.glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            $(this).children('.icons-arrow-gray').addClass('top');
        }else{
            $('#'+id).hide(300);
            $(this).children('.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            $(this).children('.icons-arrow-gray').removeClass('top');
        }
    });

    // скрывать выпадающие блоки после прорисовки графика
    // для адаптивного отображения ширины
    // иначе получаются неверные размеры
    setInterval(function() {
        $('.hides').hide().removeClass('hides');
    }, 300);

    //меню для мобильной версии
    $('.navbar-toggle').click(function(){
        $(this).toggleClass('collapsed');
        $('.navbar-collapse').toggleClass('xs-opened');
        $(this).next('.collapse').toggle();
    });

    // contactModal
    $('.modalopen').click(function () {
        $('#contactModal').show();
        if($(this).data('text')=='iis'){
            $('#contactModal').find('form').attr("id", "modal");
            $('#myModalDescription').empty();
            $('#myModalLabel').html('Связаться с финансовым советником');
        }
        else if($(this).data('text')=='question'){
            $('#contactModal').find('form').attr("id", "modal");
            $('#myModalDescription').empty();
            $('#myModalLabel').css('display', 'block').html('Задать вопрос специалисту');
        }
        else if($(this).data('text')=='additional-iis'){
            $('#contactModal').find('form').attr("id", "additional-13");

            $('#myModalLabel').css('display', 'none');

            $('#myModalDescription').empty()
                .append('<p>*Любое из данных предложений Вы можете использовать в рамках Индивидуального инвестиционного счёта (ИИС) и уже через год получить налоговый вычет в размере 13% от суммы инвестиций.</p>')
                .append('<p class="titles"><i>Подробнее про ИИС Вы можете узнать у нашего финансового советника. <br> Оставьте свои контакты и мы Вам перезвоним. </i></p>');
        }
        return false;
    });
    $('.modalclose').click(function () {
        $('#contactModal').hide();
    });

        //slider
    
    $('.js-short-block .show-slider').click(function (event) {
        event.preventDefault();
        checkSlider($(this).data('link'));
        
    });
    $('.js-long-block .tab-link').click(function (event) {
        event.preventDefault();
        if($(this).hasClass('active')) return;
        checkSlider($(this).data('link'));
    });
    $('.js-long-block .js-close-slider').click(function (event) {
        $('.js-long-block').fadeOut(500);
        $('.js-short-block').fadeIn(500);
    });

    var checkSlider = function (linkBlock) {

        var long = $('.js-long-block'),
            short = $('.js-short-block');
        var strategy = [];
        strategy['max-protection'] = '«Максимальная защита»';
        strategy['gold-ratio'] = '«Золотое сечение»';
        strategy['my-safe'] = '«Мой сейф»';
        strategy['state-guarantee'] = '«Гарантия государства»';

        short.hide();

        $.each(long.find('.navigation .tab-link'), function () {
            $(this).removeClass('active');
        });

        long.find('.navigation .' + linkBlock).addClass('active');
        long.find('.speciality .js-slide').hide();
        long.find('input[name="description"]').val("Выбранная стратегия: "+strategy[linkBlock]);
        long.find('form').attr("id", linkBlock);


        long.find('.speciality .' + linkBlock).fadeIn(500);
        long.fadeIn(500);
    }

    // ajax отправка письма

    $(".feedbackForm").submit(function(event){
        event.preventDefault();
        var form = $(this);
        sendForm(form);
        return false;
    });

    $('input[name="confidentiality"]').change(function () {
        if($(this).prop("checked") == false){
            $(this).closest('form').find('.btn').addClass('disabled');
        }
        if($(this).prop("checked") == true){
            $(this).closest('form').find('.btn').removeClass('disabled');
        }
    })

    //стилизация гугл карты
    function initializeMap()
    {
        var latlng = new google.maps.LatLng(55.7469862, 37.5392672);
        var settings = {
            zoom: 15,
            center: latlng,
            mapTypeControl: true,
            mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
            navigationControl: true,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };

        var map = new google.maps.Map(document.getElementById("map"),  settings);
        var companyPos = new google.maps.LatLng(55.7469862, 37.5392672);
            var companyMarker = new google.maps.Marker({
            position: companyPos,
            map: map,
            title:"Some title"
        });
        var styles = {
            silver: [
                {
                    elementType: 'geometry',
                    stylers: [{color: '#f5f5f5'}]
                },
                // {
                //     elementType: 'labels.icon',
                //     stylers: [{visibility: 'off'}]
                // },
                // {
                //     elementType: 'labels.text.fill',
                //     stylers: [{color: '#616161'}]
                // },
                {
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#f5f5f5'}]
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#bdbdbd'}]
                },
                // {
                //     featureType: 'poi',
                //     elementType: 'geometry',
                //     stylers: [{color: '#eeeeee'}]
                // },
                // {
                //     featureType: 'poi',
                //     elementType: 'labels.text.fill',
                //     stylers: [{color: '#757575'}]
                // },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{color: '#e5e5e5'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#9e9e9e'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#ffffff'}]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#757575'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#dadada'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#616161'}]
                },
                {
                    featureType: 'road.local',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#9e9e9e'}]
                },
                {
                    featureType: 'transit.line',
                    elementType: 'geometry',
                    stylers: [{color: '#e5e5e5'}]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'geometry',
                    stylers: [{color: '#eeeeee'}]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#c9c9c9'}]
                },
                // {
                //     featureType: 'water',
                //     elementType: 'labels.text.fill',
                //     stylers: [{color: '#9e9e9e'}]
                // }
            ]
        };
        map.setOptions({styles: styles['silver']});
    }
    initializeMap();

});

var sendForm = function(form){

    var error = false;
    form.find('input[name="contact"]').each( function(){
        if ($(this).val() == '') {
            form.next('.results-form').html('Зaпoлнитe пoлe "'+$(this).data('name')+'"!');
            error = true;
        }
    });

    if(!form.find('input[name="confidentiality"]').prop("checked")){
        console.log(this);
        form.find('.confidentiality').css('color', 'red');
        error = true;
    }
    if (!error) {
        var data = form.serializeArray();
        data.push({name: 'link', value: window.location.href});
        $.ajax({
            type: 'POST',
            url: 'send.php',
            data: data,
            beforeSend: function(data) {
                form.find('input[type="submit"]').attr('disabled', 'disabled');
            },
            success:function (data) {
                if(data !='success') { return;}

                form.next('.results-form').html('<h3>Заявка отправлена!</h3>');
                form.hide(500);
                yaCounter41372429.reachGoal('send-'+form.attr('id'));
                yaCounter41372429.reachGoal('formSend');
                ga('send', 'event', 'formsend', 'formsend1');
                // console.log('send-'+form.attr('id'))

            },
            complete: function(data) {
                // form.find('input[type="submit"]').prop('disabled', false);
            }

        });
    }
}

