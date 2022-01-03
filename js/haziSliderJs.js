'use strict';
var $hzslider = {
    init: function( $selector, $settings = '' ){
        let $slider = document.querySelectorAll($selector);
        if( $slider ){
            $slider.forEach(function($v, $k){
                // id
                if( !$v.getAttribute('id')){
                    let $id = Math.random().toString(36).substring(2,15);
                    $v.setAttribute('id', $id);
                }
                $v.setAttribute('hjs-slider', 'hjsslider-'+ $k);
                if( $settings != ''){
                    $settings.idSlide = $v.getAttribute('id');
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }
               
                // class
                $v.classList.add('hzslider-wrapper-'+ $k);

                let $parentEl = $v.parentElement;
                $parentEl.style.overflow = 'hidden';
                $parentEl.style.position = 'relative';

                // render slider
                $hzslider.renderSlider( $v );

            });
            return $slider;
        }
        return false;
    },
    renderSlider: function( $v ){
        if( !$v ){
            return;
        }

        let $parentEl = $v.parentElement;
        // set Settings
        let $offset = $parentEl.getBoundingClientRect(),
            $width = $offset.width,
            $height = $offset.height;

        let $sett = $hzslider.getSettings( $v );
       
        var $type = ($sett.type) ? $sett.type : 'none',
            $idSlide = ($sett.idSlide) ? $sett.idSlide : '',
            $slidesPerView = ($sett.slidesPerView) ? $sett.slidesPerView : 1,
            $spaceBetween = ($sett.spaceBetween) ? $sett.spaceBetween : 10,
            $defaultSlide = ($sett.defaultSlide) ? $sett.defaultSlide : 1,
            $loop = ($sett.loop) ? $sett.loop : false,
            $step = ($sett.step) ? $sett.step : false,
            $speed = ($sett.speed) ? $sett.speed : 1000,
            $duration = ($sett.duration) ? $sett.duration : 300,
            $autoplay = ($sett.autoplay) ? $sett.autoplay : {},
            $direction = ($sett.direction) ? $sett.direction : 'horizontal',
            $item = ($sett.itemSelector) ? $sett.itemSelector : '.hzslider-slide',
            $itemsEl = ($sett.itemsEl) ? $sett.itemsEl : $v.querySelectorAll($item),
            $itemsTotal = $itemsEl.length;
        if( $loop ){
            
        }
        $parentEl.classList.add('hzmode-' + $direction);
        if( $type != 'none'){
            $parentEl.classList.add('hztype-' + $type);
        }

        $v.style.display = 'flex';
        $v.style.transitionDuration = $duration + 'ms';
        $v.style.transitionProperty = 'transform';
        
        if( $itemsTotal > 0){
            $hzslider.resetClass($itemsEl);

            $defaultSlide = Math.abs($defaultSlide);
            var $space = ($spaceBetween != 0) ? $spaceBetween : 1;
            var $iwidth = Math.floor( $width / Number($slidesPerView) );
            var $pointer = (($defaultSlide - 1) * ($iwidth + $spaceBetween) );
            var $iheight = 0;
            if( $direction == 'vertical'){
                $v.style.flexDirection = 'column';

                $iwidth = 0;
                $iheight = Math.floor( $height / Number($slidesPerView) );
                $pointer = (($defaultSlide - 1) * ($iheight + $spaceBetween));

                $v.style.height = Math.floor( ($iheight + $spaceBetween) * $itemsTotal) + 'px';
                $v.style.transform = "translate3d(0px, -" + $pointer + "px, 0px)";
            } else {
                $v.style.width = Math.floor( ($iwidth + $spaceBetween) * $itemsTotal ) + 'px';
                $v.style.transform = "translate3d(-" + $pointer + "px, 0px, 0px)";
            }
            $v.setAttribute('hjs-start', $defaultSlide);

            let $index = 1;
            $itemsEl.forEach( $v1 => {

                if( $direction == 'vertical'){
                    $v1.style.height = $iheight + 'px';
                }else{
                    $v1.style.width = $iwidth + 'px';
                }
                
                $v1.classList.add('hzslider-slide');
                $v1.setAttribute('hjs-index', $index);
                $v1.setAttribute('aria-label', $index + ' / ' + $itemsTotal);
                if( $index === $defaultSlide){
                    $hzslider.setPrev($itemsEl, $index);
                    $v1.classList.add('hzslide-active');
                    $hzslider.setNext($itemsEl, $index);
                }
                if( $direction == 'vertical'){
                    $v1.style.marginBottom = $spaceBetween + 'px';
                }else{
                    $v1.style.marginRight = $spaceBetween + 'px';
                }
                $index++;
            });

            // autoplay start
            if( $autoplay.enable ){
                setInterval(() => {
                    
                    $hzslider.resetClass($itemsEl);
                    let $setIndex = Number($v.getAttribute('hjs-start')) + Math.abs($step);
                    $setIndex = ( $itemsTotal < $setIndex) ? 1 : $setIndex;

                    var $pointer = (($setIndex - 1) * ($iwidth + $spaceBetween) );
                    if( $direction == 'vertical'){
                        $pointer = (($setIndex - 1) * ($iheight + $spaceBetween));
                        $v.style.transform = "translate3d(0px, -" + $pointer + "px, 0px)";
                    }else{
                        $v.style.transform = "translate3d(-" + $pointer + "px, 0px, 0px)";
                    }
                    $v.setAttribute('hjs-start', $setIndex);

                    $hzslider.setPrev($itemsEl, $setIndex);
                    if( $itemsEl[ $setIndex ]){
                        $itemsEl[ $setIndex ].classList.add('hzslide-active');
                    }
                    $hzslider.setNext($itemsEl, $setIndex);

                }, $speed);
            }
            // end autoplay

        }
        

    },
    resetClass: function( $el ){
        $el.forEach( $v1 => {
            $v1.classList.remove('hzslide-prev');
            $v1.classList.remove('hzslide-next');
            $v1.classList.remove('hzslide-active');
        });
    },
    setPrev: function( $itemsEl, $index ){
        let $preItem = ($itemsEl[ $index - 1]) ? $itemsEl[ $index - 1] : false;
        if( $preItem ){
            $preItem.classList.add('hzslide-prev');
        }
        return true;
    },
    setNext: function( $itemsEl, $index ){
        let $nextItem = ($itemsEl[ $index + 1]) ? $itemsEl[ $index + 1] : false;
        if( $nextItem ){
            $nextItem.classList.add('hzslide-next');
        }
        return true;
    },
    slideContinue: function($itemsEl, $index){

    },
    getSettings: function( $el ){

        let $default = {
            slidesPerView: 1,
            spaceBetween: 10,
            defaultSlide: 1,
            loop: false, // true, false 
            speed: 1000,  // set time
            duration: 300,  // 300ms
            step: 1,  
            autoplay: {
                enable: true, // false, true
                delay: 500,
            },  
            direction: 'horizontal', // vertical
            sliderSelector : '.hzslider-wrapper',
            itemSelector : '.hzslider-slide',
            navigation : {
                nextEl: ".hzslider-button-next",
                prevEl: ".hzslider-button-prev",
            },
            pagination : {
                el: ".hzslider-pagination",
                clickable: true,
            },
            type : 'none', // progressbar, fraction
        };

        let $settings = $el.getAttribute('hjs-settings');
        if( !$settings ){
            $el.setAttribute('hjs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        $neSettings.slidesPerView = ($settings.slidesPerView) ? $settings.slidesPerView : $default.slidesPerView;
        $neSettings.spaceBetween = ($settings.spaceBetween) ? $settings.spaceBetween : $default.spaceBetween;
        $neSettings.defaultSlide = ($settings.defaultSlide) ? $settings.defaultSlide : $default.defaultSlide;
        $neSettings.loop = ($settings.loop) ? $settings.loop : $default.loop;
        $neSettings.speed = ($settings.speed) ? $settings.speed : $default.speed;
        $neSettings.duration = ($settings.duration) ? $settings.duration : $default.duration;
        $neSettings.step = ($settings.step) ? $settings.step : $default.step;
        $neSettings.autoplay = ($settings.autoplay) ? $settings.autoplay : $default.autoplay;
        $neSettings.direction = ($settings.direction) ? $settings.direction : $default.direction;
        $neSettings.sliderSelector = ($settings.sliderSelector) ? $settings.sliderSelector : $default.sliderSelector;
        $neSettings.itemSelector = ($settings.itemSelector) ? $settings.itemSelector : $default.itemSelector;
        $neSettings.itemsEl = ($settings.itemsEl) ? $settings.itemsEl : $el.querySelectorAll($neSettings.itemSelector);
        $neSettings.navigation = ($settings.navigation) ? $settings.navigation : $default.navigation;
        $neSettings.pagination = ($settings.pagination) ? $settings.pagination : $default.pagination;
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.idSlide = ($settings.idSlide) ? $settings.idSlide : $el.getAttribute('id');
       
        return $neSettings;
    }

};

