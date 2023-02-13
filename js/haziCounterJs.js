"use strict";
/**
* Name: HaziJs Counter Js
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/

var $hzCounter = {
    init: function( $el, $settings = ''){
        let $timer = document.querySelectorAll($el);
        if( $timer.length > 0 ){
            $timer.forEach(function($v, $k){
                
                // id
                if( !$v.getAttribute('id')){
                    let $id = Math.random().toString(36).substring(2,15);
                    $v.setAttribute('id', $id);
                }
                $v.setAttribute('hjs-counter', 'hjscounter-'+ $k);
                if( $settings != ''){
                    $settings.idCounter = $v.getAttribute('id');
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }

                $v.classList.add('hzcounter-wrap');

                let $sett = $hzCounter.getSettings( $v ),
                $start = ($sett.start) ? $sett.start: 1,
                $speed = ($sett.speed) ? $sett.speed: 100,
                $refresh = ($sett.refresh) ? $sett.refresh: 100,
                $inline = ($sett.inline) ? $sett.inline: true;

                let $loops = Math.ceil( Number($speed) / Number($refresh));

                $hzCounter.renderData($v, $start);

                $hzCounter.counterNumber($v);
            });

        }
        
    },
    counterNumber: function( $v ){
        let $sett = $hzCounter.getSettings( $v ),
        $value = ($sett.value) ? $sett.value: 100,
        $start = ($sett.start) ? $sett.start: 1,
        $speed = ($sett.speed) ? $sett.speed: 100,
        $step = ($sett.step) ? $sett.step: 1,
        $inline = ($sett.inline) ? $sett.inline: true;

        let $startValue = Number($start);
        let $speedValue = Number($speed);
        let $stepValue = Number($step);
        let $totalValue = Number($value);
       
        if($totalValue > $startValue){
            
            $startValue += $stepValue;
            $sett.start = Number($startValue);
            
            $v.setAttribute('hjs-settings', JSON.stringify($sett)); 

            setTimeout($hzCounter.counterNumber, $speedValue, $v);
        }
        $startValue  = ($startValue > $totalValue) ? $totalValue : $startValue;
        $hzCounter.renderData($v, $startValue);
    },

    renderData: function($v, $start ){
        $v.innerHTML = '';

        let $sett = $hzCounter.getSettings( $v ),
        $value = ($sett.value) ? $sett.value: 100,
        $tag = ($sett.tag) ? $sett.tag: 'h2',
        $step = ($sett.step) ? $sett.step: 1,
        $speed = ($sett.speed) ? $sett.speed: 100,
        $class = ($sett.class) ? $sett.class: '',
        $extra = ($sett.extra) ? $sett.extra: '',
        $extratag = ($sett.extratag) ? $sett.extratag: 'span',
        $direction = ($sett.direction) ? $sett.direction: 'after',
        $refresh = ($sett.refresh) ? $sett.refresh: 100,
        $format = ($sett.format) ? $sett.format: 'en-IN',
        $id = ($sett.idCounter) ? $sett.idCounter: 'fun' + $value,
        $inline = ($sett.inline) ? $sett.inline: true;

        let $counter = document.createElement( $tag );
        $counter.setAttribute('id', 'hztimer-id-' + $id);
        
        let $html = $start;
        if( $format != ''){
            $html = Number($start).toLocaleString($format);
        }

        if( $direction == 'after'){
            $counter.innerHTML += $html;
        }

        if( $extra != '' && $extratag != ''){
            let $extrEl = document.createElement($extratag);
            $extrEl.innerHTML = $extra;
            $counter.appendChild($extrEl);
        }
        
        if( $direction == 'before'){
            $counter.innerHTML += $html;
        }
        
        $v.appendChild($counter);
    },
    getSettings: function( $el ){

        let $default = {
            'value' : $el.getAttribute('data-value') ? $el.getAttribute('data-value') : 100,
            'start' : $el.getAttribute('data-start') ? $el.getAttribute('data-start') : 1,
            'tag' : $el.getAttribute('data-tag') ? $el.getAttribute('data-tag') : 'h2',
            'step' : $el.getAttribute('data-step') ? $el.getAttribute('data-step') : 1,
            'speed' : $el.getAttribute('data-speed') ? $el.getAttribute('data-speed') : 100,
            'extra' : $el.getAttribute('data-extra') ? $el.getAttribute('data-extra') : '',
            'extratag' : $el.getAttribute('data-extratag') ? $el.getAttribute('data-extratag') : 'span',
            'direction' : $el.getAttribute('data-direction') ? $el.getAttribute('data-direction') : 'after',
            'refresh' : $el.getAttribute('data-refresh') ? $el.getAttribute('data-refresh') : 100,
            'format' : $el.getAttribute('data-format') ? $el.getAttribute('data-format') : 'en-IN',
            'class' : $el.getAttribute('data-class') ? $el.getAttribute('data-class') : '',
            'inline' : $el.getAttribute('data-inline') ? $el.getAttribute('data-inline') : ''
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
        $neSettings.idCounter = ($settings.idCounter) ? $settings.idCounter : $el.getAttribute('id');
       
        return $neSettings;
    },
};



let $settingsJs = {
   /* 'value' : 1500,
    'start' : 4,
    'step' : 80,
    'speed' : 100,
    'tag' : 'h2',
    'extra' : '+',
    'extratag' : 'span',
    'direction' : 'after',
    'refresh' : 100,
    'format' : 'en-IN'*/
};
$hzCounter.init('.counter', $settingsJs);