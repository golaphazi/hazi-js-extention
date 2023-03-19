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
                $start = ($sett.start) ? $sett.start: 1,
                $title = ($sett.title) ? $sett.title: '',
                $tag = ($sett.tag) ? $sett.tag: 'h3',
                $label = ($sett.tag) ? $sett.label: '%',
                $bg = ($sett.bgcolor) ? $sett.bgcolor: 'rgb(205 199 199)',
                $bgbar = ($sett.barcolor) ? $sett.barcolor: '#ef4848',
                $inline = ($sett.inline) ? $sett.inline: true;

                $v.style.backgroundColor = $bg;

                if (null == $value || $value == ''){
                    $value = 90;
                }
                if($value > 100){
                    $value = 100;
                }

                if (null == $speed || $speed == ''){
                    $speed = 100;
                }

                let $titleEl = $v.querySelector('.hzprogress-title');
                if( $title != ''){

                    if( !$titleEl ){
                        $titleEl = document.createElement($tag);
                        $titleEl.setAttribute('class', 'hzprogress-title');
                        $v.appendChild($titleEl);
                        $titleEl = $v.querySelector('.hzprogress-title');
                    }
                    
                    $titleEl.innerHTML = $title;
                }
                let $bar = $v.querySelector('.hzprogress-bar');
                if( !$bar ){
                    $bar = document.createElement('div');
                    $bar.setAttribute('class', 'hzprogress-bar');

                    $v.appendChild($bar);
                    $bar = $v.querySelector('.hzprogress-bar');
                }
                $bar.setAttribute('style', 'width: '+$start+'%;');
                
                let $span = $bar.querySelector('.hzprogress-label');
                if( !$span ){
                    $span = document.createElement('span');
                    $span.setAttribute('class', 'hzprogress-label');
                    $bar.appendChild($span);

                    $span = $bar.querySelector('.hzprogress-label');
                }
                
                let $number = $bar.querySelector('.hzprogress-number');
                if( !$number ){
                    $number = document.createElement('span');
                    $number.setAttribute('class', 'hzprogress-number');

                    $span.appendChild($number);
                    
                    $number = $bar.querySelector('.hzprogress-number');
                }
                
                $span.innerHTML += $label;

                if( typeof $bgbar === 'object' && $bgbar !== null ){
                    let $bars_wrap = $v.querySelector('.hzprogress-bars');
                    if( !$bars_wrap ){
                        let $bars_wrap1 = document.createElement('div');
                        $bars_wrap1.setAttribute('class', 'hzprogress-bars');
                        $bars_wrap1.setAttribute('style', 'height: 100%;width: 100%; position: absolute; left: 0px; top: 0px;display: block;');

                        $bar.appendChild($bars_wrap1);
                        $bars_wrap = $v.querySelector('.hzprogress-bars');
                    }
                    
                    let $bars_arry = Object.entries($bgbar);
                    let $bar_length = $bars_arry.length;
                    let $min = 0, $m = 0, $max = Number($bar_length) - 1;

                    for (const [$kat, $vat] of Object.entries($bgbar)) {
                        let $bars_item = document.createElement('div');
                        $bars_item.setAttribute('class', 'hzprogress-bars-items hzprogress-bars-items-' + $kat);
                        $bars_item.setAttribute('style', 'height: 100%;');
                        $bars_item.style.position = 'absolute';
                        

                        let $zindex = 0, $checkindex = Number($kat);
                        if( $checkindex > $value){
                            $checkindex = $value;
                        }

                        $bars_item.setAttribute('title', $checkindex + '%');
                        $bars_item.style.width = $checkindex + '%';

                        $zindex = Number($value) - $checkindex;

                        $bars_item.style.zIndex = $zindex;
                        if( $m == $min){
                            $bars_item.classList.add('first-item');
                        }
                        if( $m == $max){
                            $bars_item.classList.add('last-item');
                        }
                        $bars_wrap.appendChild($bars_item);

                        $m++;
                    }
                }
                
                let $color = '#ef4848',
                $index = 0,
                $i = Number($start),
                $bars = $bar,
                $u = setInterval(function () {
                    
                    if( $i >= $value ){
                        clearInterval($u);
                    }

                    $bar.style.width = $i + "%";
                    $bar.style.backgroundColor = $bgbar;
                    $bar.setAttribute('title', $value + '%');

                    if( typeof $bgbar === 'object' && $bgbar !== null ){
                        for (const [$kat, $vat] of Object.entries($bgbar)) {
                            if( $kat == $i){
                                $index = $kat;
                                $color = $vat;
                                $bars = $bar.querySelector('.hzprogress-bars-items-' + $kat);
                                
                            }
                        }
                        let $width = $i;
                        if( $width >= $value){
                            $width = $value;
                        }
                        //$bars.setAttribute('title', $width + '%');
                        //$bars.style.width = $width + '%';
                        $bars.style.backgroundColor = $color;
                    }
                    
                    let $numberEl = $bar.querySelector('span.hzprogress-number');
                    if( $numberEl ){
                        $numberEl.innerHTML = $i;
                    }
                    $i++;
                }, $speed);

                
            });

        }
        
    },
    getSettings: function( $el ){

        let $default = {
            'value' : $el.getAttribute('data-value') ? $el.getAttribute('data-value') : 90,
            'speed' : $el.getAttribute('data-speed') ? $el.getAttribute('data-speed') : 100,
            'start' : $el.getAttribute('data-start') ? $el.getAttribute('data-start') : 1,
            'title' : $el.getAttribute('data-title') ? $el.getAttribute('data-title') : '',
            'tag' : $el.getAttribute('data-tag') ? $el.getAttribute('data-tag') : 'h3',
            'label' : $el.getAttribute('data-label') ? $el.getAttribute('data-label') : '%',
            'bgcolor' : $el.getAttribute('data-bgcolor') ? $el.getAttribute('data-bgcolor') : 'rgb(205 199 199)',
            'barcolor' : $el.getAttribute('data-barcolor') ? $el.getAttribute('data-barcolor') : '#ef4848',
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
    'bgcolor' : 'rgb(205 199 199)',
    'barcolor' : '#ef4848',*/
    'start' : 40,
    'barcolor' : {
        '30' : '#ef4848',
        '50' : '#3754b8',
        '70' : '#a5b837',
        '90' : 'rgb(134 55 184)',
        '100' : '',
    },
    
};
$hzProgress.init('.progress-bar', $settingsPJs);