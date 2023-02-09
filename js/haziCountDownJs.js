"use strict";
/**
* Name: HaziJs CountDown Js
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/

var $hzCountDown = {
    init: function( $el, $settings = ''){
        let $timer = document.querySelectorAll($el);
        if( $timer.length > 0 ){
            $timer.forEach(function($v, $k){
                
                // id
                if( !$v.getAttribute('id')){
                    let $id = Math.random().toString(36).substring(2,15);
                    $v.setAttribute('id', $id);
                }
                $v.setAttribute('hjs-timer', 'hjstimer-'+ $k);
                if( $settings != ''){
                    $settings.idCountDown = $v.getAttribute('id');
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }

                $v.classList.add('hztimer-wrap');

                let $sett = $hzCountDown.getSettings( $v ),
                $format = ($sett.format) ? $sett.format: {},
                $params = ($sett.params) ? $sett.params: [],
                $default_tag = ($sett.default_tag) ? $sett.default_tag: 'p',
                $default_value = ($sett.default_value) ? $sett.default_value: '',
                $start_date = ($sett.start_date) ? $sett.start_date: '',
                $start_addition_txt = ($sett.start_addition_txt) ? $sett.start_addition_txt: '',
                $target_date = ($sett.target_date) ? $sett.target_date: '',
                $class = ($sett.class) ? $sett.class: '',
                $expired_msg = ($sett.expired_msg) ? $sett.expired_msg: '',
                $divider = ($sett.divider) ? $sett.divider: '',
                $item_inline = ($sett.item_inline) ? $sett.item_inline: false,
                $inline = ($sett.inline) ? $sett.inline: true;

                if( $inline == true){
                    $v.classList.add('hzinline');
                }

                if( $class != ''){
                    $v.classList.add($class);
                }
               
                
                let $len = Object.entries($format).length;
                if( $len > 0 ){
                    let $i = 1;
                    for (const [$k1, $v1] of Object.entries($format)) {
                        
                        if( !$params.includes( $k1 ) ){
                            continue;
                        }

                        let $tag = ($v1.tag) ? $v1.tag : $default_tag;
                        $default_tag = ( $tag != '') ? $tag : $default_tag;

                        let $title = ($v1.title) ? $v1.title : '';
                        let $value = ($v1.value) ? $v1.value : $default_value;
                        $default_value = ( $value != '') ? $value : $default_value;

                        let $div = document.createElement( 'div' );
                        $div.setAttribute('class', 'hztimer hz-'+ $k1);
                        if( $item_inline ){
                            $div.classList.add('hzitem-inline');
                        }
                        let $time = document.createElement( $default_tag );
                        $time.setAttribute('class', 'hzitem-time hzitem-time-'+ $k1);
                        $time.setAttribute('id', 'hzitem-time-'+ $k1 + '-' + $v.getAttribute('id'));
                        $time.innerText = $default_value;
                        $div.appendChild( $time );

                        if($title != ''){
                            let $titleEl = document.createElement( 'p' );
                            $titleEl.setAttribute('class', 'hzitem-title hzitem-title-'+ $k1);
                            $titleEl.innerHTML = $title;
                            $div.appendChild( $titleEl );
                        }

                        $v.appendChild( $div );
                        if( $divider != '' && $len > $i){
                            let $div1 = document.createElement( 'div' );
                            $div1.setAttribute('class', 'hztimer-divider hz-divider-'+ $k1);
                            $div1.innerHTML = $divider;
                            $v.appendChild( $div1 );
                        }

                        $i++;
                    }
                }

                // set time
                let $timeSet = setInterval(function() {
                    let $dateTarget = $target_date;
                    let $pointer = '';
                    let $nowTime = new Date().getTime();

                    if( $start_date != ''){
                        $dateTarget = $start_date;
                        $pointer = $start_addition_txt;
                    }

                    let $dateTime = new Date($dateTarget).getTime();
                    if($dateTarget == 'today'){
                        const d = new Date();
                        let year = d.getFullYear();
                        let day = d.getDay();
                        let months = d.getMonth();
                        $dateTime = new Date( year + '-' + months + '-' + day + ' 23:59:59').getTime();
                    }
                    
                    var distance = Number($dateTime - $nowTime);
                    
                    var years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    let $yearEl = $v.querySelector('.hzitem-time-years');
                    if( years >= 0 && $yearEl){
                        $yearEl.innerText = $pointer + years;
                    }

                    let $daysEl = $v.querySelector('.hzitem-time-days');
                    if( days >= 0 && $daysEl){
                        $daysEl.innerText = $pointer + days;
                    }

                    let $hoursEl = $v.querySelector('.hzitem-time-hours');
                    if( hours >= 0 && $hoursEl){
                        $hoursEl.innerText = $pointer + hours;
                    }

                    let $minutesEl = $v.querySelector('.hzitem-time-minutes');
                    if( minutes >= 0 && $minutesEl){
                        $minutesEl.innerText = $pointer + minutes;
                    }

                    let $secondsEl = $v.querySelector('.hzitem-time-seconds');
                    if( seconds >= 0 && $secondsEl){
                        $secondsEl.innerText = $pointer + seconds;
                    }

                    if (distance < 0) {
                        clearInterval($timeSet);

                        if( $expired_msg != ''){
                            $v.innerHTML = '';
                            var expriedDiv = document.createElement('p');
                            expriedDiv.setAttribute('class', 'hz-expired-message');
                            expriedDiv.innerHTML = $expired_msg ;
                            $v.appendChild(expriedDiv);
                        }
                        
                    }

                }, 100);

            });
        }
    },

    getSettings: function( $el ){

        let $default = {
            format: {
                'days' : {
                    'title' : 'DAYS',
                    'tag' : 'h2',
                    'value': '00'
                },
                'hours' : {
                    'title' : 'HRS',
                    'tag' : 'h2',
                    'value': '00'
                },
                'minutes' : {
                    'title' : 'MIN',
                    'tag' : 'h2',
                    'value': '00'
                },
                'seconds' : {
                    'title' : 'SEC',
                    'tag' : 'h2',
                    'value': '00'
                }
            },
            'params' : $el.getAttribute('data-params') ? $el.getAttribute('data-params').split('-') : ['years', 'days', 'hours', 'minutes', 'seconds'],
            'default_tag' : $el.getAttribute('data-default-tag') ? $el.getAttribute('data-default-tag') : 'h2',
            'default_value' : $el.getAttribute('data-default-value') ? $el.getAttribute('data-default-value') : '00',
            'start_date' : $el.getAttribute('data-start-date') ? $el.getAttribute('data-start-date') : '',
            'start_addition_txt' : $el.getAttribute('data-start-addition-txt') ? $el.getAttribute('data-start-addition-txt') : '-',
            'target_date' : $el.getAttribute('data-target-date') ? $el.getAttribute('data-target-date') : 'today',
            'expired_msg' : $el.getAttribute('data-expired-msg') ? $el.getAttribute('data-expired-msg') : '',
            'class' : $el.getAttribute('data-class') ? $el.getAttribute('data-class') : '',
            'inline' : $el.getAttribute('data-inline') ? $el.getAttribute('data-inline') : '',
            'item_inline' : $el.getAttribute('data-item-inline') ? $el.getAttribute('data-item-inline') : '',
            'divider' : $el.getAttribute('data-divider') ? $el.getAttribute('data-divider') : '',
        };

        let $settings = $el.getAttribute('hjs-settings');
        if( !$settings ){
            $el.setAttribute('hjs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        if( Object.entries($default) ){ 
            for (const [$k, $v] of Object.entries($default)) {
                $neSettings[$k] = ($settings[$k]) ? $settings[$k] : $default[$k];
            }
        }
        $neSettings.idCountDown = ($settings.idCountDown) ? $settings.idCountDown : $el.getAttribute('id');
       
        return $neSettings;
    },
};


let $settings = {
    //'start_date' : '2022/09/03 17:25:00',
    'expired_msg' : 'end campaign',
    'divider' : ':',
};
$hzCountDown.init('.countdodun', $settings);