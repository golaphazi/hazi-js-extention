"use strict";
/**
* Name: HaziJs Progress Js
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/

var $hzProgress = {
    init: function( $el, $settings = ''){
        let $timer = document.querySelectorAll($el);
        if( $timer.length > 0 ){
            $timer.forEach(function($v, $k){
                
                // id
                if( !$v.getAttribute('id')){
                    let $id = Math.random().toString(36).substring(2,15);
                    $v.setAttribute('id', $id);
                }
                $v.setAttribute('hjs-progress', 'hjsprogress-'+ $k);
                if( $settings != ''){
                    $settings.idProgress = $v.getAttribute('id');
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }

                $v.classList.add('hzprogress-wrap');

                let $sett = $hzProgress.getSettings( $v ),
                $value = ($sett.value) ? $sett.value: 90,
                $speed = ($sett.speed) ? $sett.speed: 100,
                $start = ($sett.start) ? $sett.start: 0,
                $title = ($sett.title) ? $sett.title: '',
                $tag = ($sett.tag) ? $sett.tag: 'h3',
                $label = ($sett.tag) ? $sett.label: '%',
                $inline = ($sett.inline) ? $sett.inline: true;

                if (null == $value || $value == ''){
                    $value = 90;
                }
                if($value > 100){
                    $value = 100;
                }

                if (null == $speed || $speed == ''){
                    $speed = 100;
                }

                if( $title != ''){
                    let $titleEl = document.createElement($tag);
                    $titleEl.setAttribute('class', 'hzprogress-title');
                    $titleEl.innerHTML = $title;
                    $v.appendChild($titleEl);
                }

                let $bar = document.createElement('div');
                $bar.setAttribute('class', 'hzprogress-bar');
                $bar.setAttribute('style', 'width: '+$start+'%;');
                
                let $span = document.createElement('span');
                $span.setAttribute('class', 'hzprogress-label');

                let $number = document.createElement('span');
                $number.setAttribute('class', 'hzprogress-number');

                $span.appendChild($number);
                $span.innerHTML += $label;

                $bar.appendChild($span);

                let $i = 1,
                $u = setInterval(function () {
                    
                    if( $i >= $value ){
                        clearInterval($u);
                    }
                    
                    $bar.style.width = $i + "%";

                    let $numberEl = $bar.querySelector('span.hzprogress-number');
                    if( $numberEl ){
                        $numberEl.innerHTML = $i;
                    }
                    $i++;
                }, $speed);

                $v.appendChild($bar);
            });

        }
        
    },
    getSettings: function( $el ){

        let $default = {
            'value' : $el.getAttribute('data-value') ? $el.getAttribute('data-value') : 90,
            'speed' : $el.getAttribute('data-speed') ? $el.getAttribute('data-speed') : 100,
            'title' : $el.getAttribute('data-title') ? $el.getAttribute('data-title') : '',
            'tag' : $el.getAttribute('data-tag') ? $el.getAttribute('data-tag') : 'h3',
            'label' : $el.getAttribute('data-label') ? $el.getAttribute('data-label') : '%',
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
        $neSettings.idProgress = ($settings.idProgress) ? $settings.idProgress : $el.getAttribute('id');
       
        return $neSettings;
    },
};



let $settingsPJs = {
   /* 'value' : 1500,
    'speed' : 100,
    'start' : 0,
    'title' : 'WordPress',
    'tag' : 'h3',
    'label' : '%',
    */
};
$hzProgress.init('.progress-bar', $settingsPJs);