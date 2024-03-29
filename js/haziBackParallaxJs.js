"use strict";
/**
* Name: HaziJs Parallax
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/

var $hJsBackParallax = {
    init: function(  $selector, $settings = '' ){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                $v.setAttribute('hjs-backparallax', 'hjsparallax-'+ $k);
                if( $settings != ''){
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }

                // set Settings
                let $sett = $hJsBackParallax.getSettings( $v );
                var $ratio = ($sett.ratio) ? $sett.ratio : 0;
                var $type = ($sett.type) ? $sett.type : 'background';
                var $direction = ($sett.direction) ? $sett.direction : 'vertical';
                var $offset = ($sett.offset) ? $sett.offset : 0;

                var $winHeight = window.outerHeight;
                var $winWidth = window.outerWidth;
                var $top = $v.offsetTop;
                var $left = $v.offsetLeft;
                var $width = $v.offsetWidth;
                var $height = $v.offsetHeight;

                var $bgY = Math.round($top * $ratio);
                var $transform = Math.round( ( $top - ( $winHeight / 2 ) ) * $ratio - $offset );
                if( $type === 'background'){
                    if($direction === 'vertical'){
                        $v.style.backgroundPosition = 'center ' + $bgY + 'px';
                    } else {
                        $v.style.backgroundPosition = $bgY + 'px center';
                    }
                } else {
                    if($direction === 'vertical'){
                        $v.style.transform = 'translateY(' + $transform + 'px)';
                        $v.style.position = 'absolute';
                        $v.style.left = '0';
                        $v.style.right = '0';
                    } else {
                        $v.style.transform = 'translateX(' + $transform + 'px)';
                    }
                }
               
            });
            window.addEventListener('scroll', $hJsBackParallax.onScroll);
        }
    },
    getSettings: function( $el ){
        if( !$el ){
            return;
        }
        let $default = {
            ratio: .1,
            type: 'background', //foreground
            direction: 'vertical', //horizontal
            offset: 0
        };
        if( $el.getAttribute('hjs-ratio') ){
            $default.ratio = $el.getAttribute('hjs-ratio');
        }
        if( $el.getAttribute('hjs-type') ){
            $default.type = $el.getAttribute('hjs-type');
        }
        if( $el.getAttribute('hjs-direction') ){
            $default.direction = $el.getAttribute('hjs-direction');
        }
        if( $el.getAttribute('hjs-offset') ){
            $default.offset = $el.getAttribute('hjs-offset');
        }
        
        let $settings = $el.getAttribute('hjs-settings');
        if( !$settings ){
            $el.setAttribute('hjs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        $neSettings.ratio = ($settings.ratio) ? $settings.ratio : $default.ratio;
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.offset = ($settings.offset) ? $settings.offset : $default.offset;
        $neSettings.direction = ($settings.direction) ? $settings.direction : $default.direction;
        return $neSettings;
    },
    onScroll: function(e){
        e.preventDefault();
        let $this = this;
       
        document.querySelectorAll('[hjs-backparallax]').forEach(function($v){
            if($v){
                // set Settings
                let $sett = $hJsBackParallax.getSettings( $v );
                var $ratio = ($sett.ratio) ? $sett.ratio : 0;
                var $type = ($sett.type) ? $sett.type : 'background';
                var $direction = ($sett.direction) ? $sett.direction : 'vertical';
                var $offset = ($sett.offset) ? $sett.offset : 0;

                var $scrolling = document.documentElement.scrollTop;
                var $winHeight = window.outerHeight;
                var $winWidth = window.outerWidth;
                var $top = $v.offsetTop;
                var $left = $v.offsetLeft;
                var $width = $v.offsetWidth;
                var $height = $v.offsetHeight;
                var $bgY = Math.round(($top - $scrolling) * $ratio);
                var $transform = Math.round(( (( $top - ( $winHeight / 2 )) - $scrolling) * $ratio) - $offset );

                if( $type === 'background'){
                    if($direction === 'vertical'){
                        $v.style.backgroundPosition = 'center ' + $bgY + 'px';
                    } else {
                        $v.style.backgroundPosition = $bgY + 'px center';
                    }
                } else {
                    if($direction === 'vertical'){
                        $v.style.transform = 'translateY(' + $transform + 'px)';
                        $v.style.position = 'absolute';
                        $v.style.left = '0';
                        $v.style.right = '0';
                    } else {
                        $v.style.transform = 'translateX(' + $transform + 'px)';
                    }
                }
            }
        });

        
    }
};

// Background Parallax calling
$hJsBackParallax.init('.dl-backparalax-section');