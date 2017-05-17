/**
 * Created by alena on 01/12/16.
 */

$(document).ready(function(){

    var app = new questionnaire();
    $('#startTest').on('click', function(){
        yaCounter41372429.reachGoal('start-test');
        ga('send', 'event', 'startest', 'startest1');
        app.init();
    });


});

var questionnaire = function(){

    var t = this;
    t.main = $('.js-enter');
    t.quest = $('.js-quest');
    t.container = $('.js-test-container');

    t.questionsData = null;
    t.questionsList = null;
    t.userAnswer = 0;

    t.templates = [];
    t.templates.answer = $("<div class='ans'><label><input type='radio' name='a0'><i></i><span></span></label></div>");

    t.getQuestionsCounter = function(){
        return Object.keys(t.questionsList).length-1;
    };


    t.init = function(){

        $.getJSON('js/test/questions-v3.json', function(data) {
            // console.log(data);
            t.questionsData = data;
            t.questionsList = t.questionsData['questions'];
            t.questionsData['current'] = 0;

            t.drawBlock();
            t.radioCheckbox();
        });

        t.main.addClass('hidden');
        t.quest.removeClass('hidden');
        t.container.removeClass('main');
        t.container.closest('.main-slide').addClass('test-current');
    }


    t.drawBlock = function(){
        var currentIndex = t.questionsData['current'];

        if(!t.questionsList['showed']){

            t.quest.find('.ans-all').html( t.getQuestionsCounter );
            t.quest.find('.ans-cur').html(currentIndex);


            var $button = t.quest.find('.btn');
            $button.addClass('disabled');

            t.quest.find('.question').html(t.questionsList[currentIndex]['question'][0]);

            t.quest.find('.ans-cur');

            if( t.questionsList[currentIndex]['answers'] != undefined ){

                var ans = t.quest.find('.js-answers').empty();
                $.each(t.questionsList[currentIndex]['answers'], function(){
                    t.templates.answer.find('input').attr({
                        'name': 'a_'+currentIndex,
                        'value': this['value']
                    });
                    t.templates.answer.find('span').html(this['label']);

                    t.templates.answer.find('label').on('click', function () {
                        $button.removeClass('disabled');
                    });

                    ans.append(t.templates.answer.clone());
                });
            }



            $button.on('click', function(event){
                event.preventDefault();
                if( $(this).hasClass('disabled') ) { return; }
                t.nextList(currentIndex);
            });



        }
    }

    t.nextList = function (currentIndex) {

        if(currentIndex != t.questionsData['current']) return;

        if(t.questionsData['current'] == t.getQuestionsCounter()){
            t.drowRes();
        }
        else {
            t.quest.find('.btn').addClass('disabled');
            t.questionsData['current'] = (++currentIndex);
            t.drawBlock(t.questionsData['current']);
        }
        t.radioCheckbox();
    }

    t.radioCheckbox = function(){
        var $elements = $('input[type=radio]');
        var $button = t.quest.find('.js-btn');
        var quest = t.questionsList[t.questionsData['current']];

        $.each($elements, function(){
            var $element = $(this);

            $element.on('click', function(){


                quest.userAnswer = $element.val();
                //если задан ответ - проверяем, если не задан - все ответы верны
                if(quest.rightAnswer != undefined){
                    if(quest.rightAnswer == $element.val()){
                        $(this).addClass('true');
                    }else{
                        $(this).addClass('false');
                        $(t.quest.find('input[type="radio"]')[quest.rightAnswer]).next('i').addClass('response');
                    }
                }
                else{$(this).addClass('true');}

                //если есть комментарии к ответам - открываем
                $.each(t.quest.find('span.hidden'), function(){
                    $(this).removeClass('hidden').addClass('comment');
                });

                //блокируем выбор
                $.each(t.quest.find('input[type="radio"]'), function(){
                    $(this).attr('disabled',true);
                });

                // console.log(t.quest.find('#ans-comment'), t.quest.find('#ans-comment').length);

                //выводим ответ
                if(t.quest.find('#ans-comment').length == 0){
                    var comment = '';
                    $.each(quest.comment, function(){

                        if(this.value == undefined){
                            comment += this;
                        }else if(this.value != undefined && this.value == quest.userAnswer){
                            comment += this.text;
                        }
                    });

                    t.quest.find('.js-answers').append("<div id='ans-comment' class='comment'>"+comment+"</div>");
                }

                $button.removeClass('disabled');
            });
        });
    }

    t.drowRes = function () {

        var trueResult = 0;
        var descrResult = '';
        var i=0;

        yaCounter41372429.reachGoal('end-test');
        ga('send', 'event', 'endtest', 'endtest1');

        $.each(t.questionsList, function () {

            var quest = this;

            descrResult += "<p>" + (i++) + ".) " + this.question+"<br>" +
                "<i>ответ("+(quest.userAnswer == quest.rightAnswer)+")</i>: ";
            $.each(this.answers, function () {
                if(this.value == quest.userAnswer){
                    descrResult += this.label;
                }
            });
            descrResult += "</p>";

            if(this.userAnswer == this.rightAnswer){
                trueResult++;
            }
        });

        var commentAns='';

        // console.log('trueResult', trueResult, trueResult == 7);

        if(trueResult < 5){
            commentAns = t.questionsData['results'][0];
        }else if(trueResult == 7){
            commentAns = t.questionsData['results'][2];
        }
        else if(5 <= trueResult < 7){
            commentAns = t.questionsData['results'][1];
        }

        // console.log('commentAns', commentAns);

        var $templete =
            "<div class='test-result'>"+
                "<p class='num'> Результат </p>"+
                "<div class='content row'>"+
                    "<div class='col-sm-6'>"+
                        "<p class='trueAns'>  Правильных ответов: " + trueResult + "</p>"+
                        commentAns+
                    "</div>"+
                    "<div class='col-sm-6'>"+
                        "<p class='trueAns'>  Бесплатная консультация </p>"+
                        "<form  id='form-test'  class='feedbackForm' >"+
                            "<input name='name' data-name='Имя' type='text' value='' required='required' placeholder='Как Вас зовут?'>"+
                            "<textarea  name='description' class='inputDescription' style='display: none'>" +
                                "<p><b>Тест.</b></p>" +
                                "<p> Верных ответов - "+trueResult+"</p>" + descrResult+
                            "</textarea>"+
                            "<input name='contact' data-name='Ваш номер телефона' type='text' value='' required='required' class='input-phone' placeholder='Ваш номер телефона'>"+
                            "<label class='confidentiality'> <input type='checkbox' name='confidentiality' checked> Я согласен на обработку персональных данных</label>"+
                            "<input type='submit' class='btn btn-color' onclick='sendForm($(this).parent()); return false;' value='Отправить'/>"+
                        "</form>"+
                        "<div class='results-form text-center'></div>"+
                    "</div>"+
                "</div>"+
                "<div class='hr'></div>"+
           " </div>";
        
        t.container.find('.js-shared').fadeIn(500);

        $(t.quest).empty();
        $(t.quest).append($templete);
        $(t.quest).find(".input-phone").mask("+7 (999) 999-99-99");


    }
    
    // $('label')

    // console.log(t.questionsData['current']);

}

