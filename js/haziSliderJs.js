'use strict';
/**
* Name: HaziJs Slider
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/
var $hzslider = {
    isDraged: 0,
    isSlider: false,
    isPosition: 0,
    options: {
        'pixelOffset' : 0,
        'startClientY' : 0,
        'startClientX' : 0,
        'startPixelOffset' : 0,
        'currentSlide' : 0,
        'slideCount' : 0,
    },
    objData: [],
    init: function( $selector, $settings = '' ){
        let $slider = document.querySelectorAll($selector);
        if( $slider.length > 0 ){
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
                $v.classList.add('hzslider-ready', 'hzslider-wrapper-'+ $k);
               

                let $parentEl = $v.parentElement;
                $parentEl.style.overflow = 'hidden';
                $parentEl.style.position = 'relative';
                $parentEl.setAttribute('data-id', $v.getAttribute('id'));
                
                // responsive
                $hzslider.getContents($parentEl);


            });
            window.addEventListener('resize', $hzslider.resizeMedia);

            return $slider;
        }
        return $hzslider;
    },
    resizeMedia: function( e ){
        document.querySelectorAll('.hzslider').forEach(function($v){
            $hzslider.getContents($v);
        });
    },
    getContents: function( $el ){
        if( !$el ){
            return;
        }
        let $client = $el.getBoundingClientRect();
        let $id = $el.getAttribute('data-id');

        var w = window.outerWidth;
        var h = window.outerHeight;

        let $this = document.getElementById($id);
        if( !$this ){
            return;
        }
        let $sett = $hzslider.getSettings( $this );
        let $responzive = ($sett.responsive) ? $sett.responsive : {};
        
        let $last = {};
        for (var key in $responzive) {
            if ($responzive.hasOwnProperty(key)) {
                if( w <= Number(key.replace(/[^\d.-]/g, '')) ){
                    $last = ($responzive[key]) ? $responzive[key] : {};
                }
            }
        }
        if( Object.keys($last).length > 0 ){
            for (const [$k, $v] of Object.entries($last)) {
                if ($sett.hasOwnProperty($k)) {
                    $sett[$k] = ($last[$k]) ? $last[$k] : $sett[$k];
                }
            }
        }
        
        let $offset = $el.parentElement.getBoundingClientRect();
        w = ($offset.width && w > $offset.width) ? $offset.width : w;
        h = ($offset.width && h > $offset.height) ? $offset.height : h;
        $sett.auto_width = w;
        $sett.auto_height = h;
       
        $hzslider.objData[$id] = $sett;
        // render slider
        $hzslider.renderSlider( $this, $sett);
    },
    
    renderSlider: function( $v, $sett){
        if( !$v ){
            return;
        }
        // mause event
        $v.removeEventListener("mousedown", $hzslider.slideStart);
        $v.addEventListener("mousedown", $hzslider.slideStart);
        $v.removeEventListener("touchstart", $hzslider.slideStart);
        $v.addEventListener("touchstart", $hzslider.slideStart);

        $v.removeEventListener("mouseup", $hzslider.slideEnd);
        $v.addEventListener("mouseup", $hzslider.slideEnd);
        $v.removeEventListener("touchend", $hzslider.slideEnd);
        $v.addEventListener("touchend", $hzslider.slideEnd);

        $v.removeEventListener("mousemove", $hzslider.slideMove);
        $v.addEventListener("mousemove", $hzslider.slideMove);
        $v.removeEventListener("touchmove", $hzslider.slideMove);
        $v.addEventListener("touchmove", $hzslider.slideMove);

        let $parentEl = $v.parentElement;
        // set Settings
        let $offset = $parentEl.getBoundingClientRect(),
            $width = ($sett.auto_width) ? $sett.auto_width : $offset.width,
            $height = ($sett.auto_height) ? $sett.auto_height : $offset.height;
            $parentEl.style.width = $width + 'px';
            $parentEl.style.height = $height + 'px';

        if( Object.keys($sett).length == 0 ){
            $sett = $hzslider.getSettings( $v );
        }

        let $opt = $hzslider.options;
        $opt.cursorWidth = $width;
        $opt.cursorHeight = $height;
       
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
            $navigation = ($sett.navigation) ? $sett.navigation : { container : true },
            $pagination = ($sett.pagination) ? $sett.pagination : { container : true },
            $direction = ($sett.direction) ? $sett.direction : 'horizontal',
            $item = ($sett.itemSelector) ? $sett.itemSelector : '.hzslider-slide',
            $itemsEl = ($sett.itemsEl) ? $sett.itemsEl : $v.querySelectorAll($item),
            $itemsTotal = $itemsEl.length;
        if( $loop ){
            
        }
        $parentEl.classList.add('hzslider', 'hzmode-' + $direction);
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
                $v.style.webkitTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
                $v.style.mozTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
                $v.style.msTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
                $v.style.oTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
                $v.style.transform = "translate3d(0px, -" + $pointer + "px, 0px)";
            } else {
                $v.style.width = Math.floor( ($iwidth + $spaceBetween) * $itemsTotal ) + 'px';
                $v.style.webkitTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
                $v.style.mozTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
                $v.style.msTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
                $v.style.oTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
                $v.style.transform = "translate3d(-" + $pointer + "px, 0px, 0px)";
            }
            $v.setAttribute('hjs-start', $defaultSlide);

            $hzslider.isPosition = $pointer;

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
                var $autoInterval = setInterval(() => {
                    $hzslider.slideContinue( $v, 'next');
                }, $speed);
            }
            // end autoplay
            // start navigation code
            let $conner = ($navigation.container) ? $navigation.container : true;
            if( $navigation.nextEl ){
                let $nxbtn = document.querySelector( $navigation.nextEl );
                if( $conner ){
                    $nxbtn = $parentEl.querySelector( $navigation.nextEl );
                }
                if( $nxbtn ){
                    if( !$nxbtn.getAttribute('hjs-index')){
                        $nxbtn.setAttribute('aria-label', 'Next Slide');
                        $nxbtn.setAttribute('hjs-control', $idSlide);
                        $nxbtn.setAttribute('hjs-index', 'next');
                        $nxbtn.addEventListener('click', function( $e ){
                            $hzslider.slideContinue( $v, 'next');
                            if( $autoplay.enable ){
                                clearInterval( $autoInterval );
                            }
                        });
                    }
                }
            }

            if( $navigation.prevEl ){
                let $prebtn = document.querySelector( $navigation.prevEl );
                if( $conner ){
                    $prebtn = $parentEl.querySelector( $navigation.prevEl );
                }
                if( $prebtn ){
                    if( !$prebtn.getAttribute('hjs-index')){
                        $prebtn.setAttribute('aria-label', 'Previous slide');
                        $prebtn.setAttribute('hjs-control', $idSlide);
                        $prebtn.setAttribute('hjs-index', 'prev');
                        $prebtn.addEventListener('click', function( $e ){
                            $hzslider.slideContinue( $v, 'prev');
                            if( $autoplay.enable ){
                                clearInterval( $autoInterval );
                            }
                        });
                    }
                }
            }

            // pagination
            let $paginaCon = ($pagination.container) ? $pagination.container : true;
            let $clickable = ($pagination.clickable) ? $pagination.clickable : true;
            if( $pagination.el ){
                let $pagi = document.querySelector( $pagination.el );
                if( $paginaCon ){
                    $pagi = $parentEl.querySelector( $pagination.el );
                }

                if( $pagi ){
                    $pagi.innerHTML = '';
                    let $mode = ($pagination.mode) ? $pagination.mode : 'horizontal';
                    $pagi.classList.add('hzslider-pagination-bullets', 'hzslider-pagination-' + $mode);
                    if( !$pagi.querySelector( '*')){
                        let $i = 1;
                        for(; $i <= $itemsTotal; $i+= $step ){
                            let $span = document.createElement('span');
                            $span.setAttribute('class', 'hzslider-pagination-bullet hzbullet-' + $i);
                            $span.setAttribute('hjs-control', $idSlide);
                            $span.setAttribute('hjs-index', $i);
                            $span.setAttribute('aria-label', $i + ' / ' + $itemsTotal);
                            
                            if( $clickable ){
                                $span.classList.add('hzbullet-clickable');
                                $span.addEventListener('click', function( $e ){
                                    let $this = this;

                                    $hzslider.resetClassBullet( $pagi.querySelectorAll('*') );
                                    $this.classList.add('hzslider-pagination-active');
                                    $hzslider.slideContinue( $v, $this.getAttribute('hjs-index'));
                                    if( $autoplay.enable ){
                                        clearInterval( $autoInterval );
                                    }
                                });
                            }
                            $pagi.appendChild($span);
                        }
                    }else{
                        let $child = $pagi.children;
                        let $i = 1;
                        Array.from($child).forEach($span => {
                            if( $i <= $itemsTotal ){
                                $span.setAttribute('class', 'hzslider-pagination-custom hzbullet-' + $i);
                                $span.setAttribute('hjs-control', $idSlide);
                                $span.setAttribute('hjs-index', $i);
                                $span.setAttribute('aria-label', $i + ' / ' + $itemsTotal);
                                if( $clickable ){
                                    $span.classList.add('hzbullet-clickable');
                                    $span.addEventListener('click', function( $e ){
                                        let $this = this;

                                        $hzslider.resetClassBullet( $pagi.querySelectorAll('*') );
                                        $this.classList.add('hzslider-pagination-active');
                                        
                                        $hzslider.slideContinue( $v, $this.getAttribute('hjs-index'));
                                        if( $autoplay.enable ){
                                            clearInterval( $autoInterval );
                                        }
                                    });
                                }
                                $i+= $step;
                            }else{
                                $span.remove();
                            }
                        });
                    }

                    let $current = $pagi.querySelector('.hzbullet-' + $defaultSlide);
                    if( $current ){
                        $current.classList.add('hzslider-pagination-active');
                        $hzslider.peginationPrevNext($current);
                    }
                }
            }
        }
        

    },
    resetClass: function( $el ){
        $el.forEach( $v1 => {
            $v1.classList.remove('hzslide-prev');
            $v1.classList.remove('hzslide-prev-prev');
            $v1.classList.remove('hzslide-next');
            $v1.classList.remove('hzslide-next-next');
            $v1.classList.remove('hzslide-active');
        });
    },
    resetClassBullet: function( $el ){
        $el.forEach( $v1 => {
            $v1.classList.remove('hzslider-pagination-active');
            $v1.classList.remove('hzslider-pagination-prev');
            $v1.classList.remove('hzslider-pagination-prev-prev');
            $v1.classList.remove('hzslider-pagination-next');
            $v1.classList.remove('hzslider-pagination-next-next');
        });
    },
    peginationPrevNext: function( $this ){
        let $prev = $this.previousElementSibling;
        if( $prev ){
            $this.previousSibling.classList.add('hzslider-pagination-prev');
            if( $this.previousSibling.previousElementSibling ){
                let $prev1 = $this.previousSibling.previousSibling;
                $prev1.classList.add('hzslider-pagination-prev-prev');
            }
        }

        let $next = $this.nextElementSibling;
        if( $next ){
            $this.nextSibling.classList.add('hzslider-pagination-next');
            if( $this.nextSibling.nextElementSibling ){
                let $next1 = $this.nextSibling.nextSibling;
                $next1.classList.add('hzslider-pagination-next-next');
            }
        }
    },
    setPrev: function( $itemsEl, $index ){
        let $preItem = ($itemsEl[ Number($index) - 1]) ? $itemsEl[ Number($index) - 1] : false;
        if( $preItem ){
            $preItem.classList.add('hzslide-prev');
            let $prev1 = ($itemsEl[ Number($index) - 2]) ? $itemsEl[ Number($index) - 2] : false;
            if( $prev1 ){
                $prev1.classList.add('hzslide-prev-prev');
            }
        }
        return true;
    },
    setNext: function( $itemsEl, $index ){
        let $nextItem = ($itemsEl[ Number($index) + 1]) ? $itemsEl[ Number($index) + 1] : false;
        if( $nextItem ){
            $nextItem.classList.add('hzslide-next');
            let $next1 = ($itemsEl[ Number($index) + 2]) ? $itemsEl[ Number($index) + 2] : false;
            if( $next1 ){
                $next1.classList.add('hzslide-next-next');
            }
        }
        return true;
    },
    slideContinue: function($v, $typeSlide){
        if( !$v ){
            return;
        }
        let $parentEl = $v.parentElement;
        // set Settings
        let $offset = $parentEl.getBoundingClientRect(),
            $width = $offset.width,
            $height = $offset.height;
        let $id = $v.getAttribute('id');
        let $sett = ($hzslider.objData[ $id ]) ? $hzslider.objData[ $id ] : $hzslider.getSettings( $v );
        
        var $type = ($sett.type) ? $sett.type : 'none',
            $step = ($sett.step) ? $sett.step : false,
            $direction = ($sett.direction) ? $sett.direction : 'horizontal',
            $speed = ($sett.speed) ? $sett.speed : 1000,
            $autoplay = ($sett.autoplay) ? $sett.autoplay : {},
            $pagination = ($sett.pagination) ? $sett.pagination : { container : true },
            $slidesPerView = ($sett.slidesPerView) ? $sett.slidesPerView : 1,
            $spaceBetween = ($sett.spaceBetween) ? $sett.spaceBetween : 10,
            $item = ($sett.itemSelector) ? $sett.itemSelector : '.hzslider-slide',
            $itemsEl = ($sett.itemsEl) ? $sett.itemsEl : $v.querySelectorAll($item),
            $itemsTotal = $itemsEl.length;

        var $iwidth = Math.floor( $width / Number($slidesPerView) );
        var $iheight = 0;
        if( $direction == 'vertical'){
            $iwidth = 0;
            $iheight = Math.floor( $height / Number($slidesPerView) );
        }  
        let $setIndex = 0;
        $hzslider.resetClass($itemsEl);
        if( $typeSlide == 'next' ){
            $setIndex = Number($v.getAttribute('hjs-start')) + Math.abs($step);
        } else if( $typeSlide == 'prev' ){
            $setIndex = Number($v.getAttribute('hjs-start')) - Math.abs($step);
        } else{
            $setIndex = $typeSlide;
        }
        
        $setIndex = ( $itemsTotal < $setIndex) ? 1 : $setIndex;
        if( 0 >=  $setIndex ){
            $setIndex = $itemsTotal;
        } 
        var $pointer = (($setIndex - 1) * ($iwidth + $spaceBetween) );
        if( $direction == 'vertical'){
            $pointer = (($setIndex - 1) * ($iheight + $spaceBetween));
            $v.style.webkitTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
            $v.style.mozTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
            $v.style.msTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
            $v.style.oTransform = "translate3d(0px, -" + $pointer + "px, 0px)";
            $v.style.transform = "translate3d(0px, -" + $pointer + "px, 0px)";
        }else{
            $v.style.webkitTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
            $v.style.mozTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
            $v.style.msTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
            $v.style.oTransform = "translate3d(-" + $pointer + "px, 0px, 0px)";
            $v.style.transform = "translate3d(-" + $pointer + "px, 0px, 0px)";
        }
        $v.setAttribute('hjs-start', $setIndex);

        $hzslider.setPrev($itemsEl, $setIndex);
        if( $itemsEl[ $setIndex ]){
            $itemsEl[ $setIndex ].classList.add('hzslide-active');
        }
        $hzslider.setNext($itemsEl, $setIndex);

        if( $pagination.el ){
            let $paginaCon = ($pagination.container) ? $pagination.container : true;
            let $pagi = document.querySelector( $pagination.el );
            if( $paginaCon ){
                $pagi = $parentEl.querySelector( $pagination.el );
            }
            if( $pagi ){
                $hzslider.resetClassBullet( $pagi.querySelectorAll('*') );
                let $current = $pagi.querySelector('.hzbullet-' + $setIndex);
                if( $current ){
                    $current.classList.add('hzslider-pagination-active');
                    $hzslider.peginationPrevNext($current);
                }
            }
        }
       
        $hzslider.isPosition = $pointer;

        return $setIndex;
    },

    slideStart: function( event ){
        let $this = this;
        if( !$this.classList.contains('hzslider-ready') ){
            return;
        }
        if ( event.originalEvent) {
            event = event.originalEvent.touches[0]
        };
        let $opt = $hzslider.options;
        $hzslider.isSlider = $this;
        
        let $id = $this.getAttribute('id');
        let $sett = ($hzslider.objData[ $id ]) ? $hzslider.objData[ $id ] : $hzslider.getSettings( $this );
        
        let $direction = ($sett.direction) ? $sett.direction : 'horizontal';

        if ($hzslider.isDraged == 0) {
            $hzslider.isDraged = 1; // Status 1 = slide started.
            if( $direction == 'vertical'){
                $opt.startClientY = event.clientY;
            }else{
                $opt.startClientX = event.clientX;
            }
        }
        $hzslider.options = $opt;
    },
    slideMove: function( event ){
        if ($hzslider.isDraged == 0) {
            return;
        }
        event.preventDefault();
        if ( event.originalEvent) {
            event = event.originalEvent.touches[0]
        };
        let $this = $hzslider.isSlider;
        
        let $id = $this.getAttribute('id');
        let $sett = ($hzslider.objData[ $id ]) ? $hzslider.objData[ $id ] : $hzslider.getSettings( $this );
        
        let $direction = ($sett.direction) ? $sett.direction : 'horizontal';
        let $item = ($sett.itemSelector) ? $sett.itemSelector : '.hzslider-slide',
        $itemsEl = ($sett.itemsEl) ? $sett.itemsEl : $v.querySelectorAll($item),
        slideCount = $itemsEl.length;

        let $opt = $hzslider.options;

        var deltaSlide = event.clientX - $opt.startClientX;
        var $eventClient = event.clientX;
        var $startClient = $opt.startClientX;
        if( $direction == 'vertical'){
            deltaSlide = event.clientY - $opt.startClientY;
            $eventClient = event.clientY;
            $startClient = $opt.startClientY;
        }
        
        // If sliding started first time and there was a distance.
        if ($hzslider.isDraged == 1 && deltaSlide != 0) {
            $hzslider.isDraged = 2; // Set status to 'actually moving'
            $opt.startPixelOffset = $opt.pixelOffset; // Store current offset
        }

        if( $hzslider.isDraged == 2 ){
            var touchPixelRatio = 1;
            // Check for user doesn't slide out of boundaries
            if (
            ($opt.currentSlide == 0 && $eventClient > $startClient) ||
            ($opt.currentSlide == slideCount - 1 && $eventClient < $startClient)
            )
            touchPixelRatio = 3;
            $opt.pixelOffset = $opt.startPixelOffset + deltaSlide / touchPixelRatio;
        }

        $hzslider.options = $opt;

        if( $direction == 'vertical'){
            //$this.style.transform = "translateY(" + $opt.pixelOffset + "px)";
        } else {
            //$this.style.transform = "translateX(" + $opt.pixelOffset + "px)";
        }
        //console.log($opt);
    },
    slideEnd: function( event ){
        if ($hzslider.isDraged == 2) {

            let $this = $hzslider.isSlider;

            let $id = $this.getAttribute('id');
            let $sett = ($hzslider.objData[ $id ]) ? $hzslider.objData[ $id ] : $hzslider.getSettings( $this );
        
            let $direction = ($sett.direction) ? $sett.direction : 'horizontal';
            let $item = ($sett.itemSelector) ? $sett.itemSelector : '.hzslider-slide',
            $itemsEl = ($sett.itemsEl) ? $sett.itemsEl : $v.querySelectorAll($item),
            $step = ($sett.step) ? $sett.step : 0,
            slideCount = $itemsEl.length;
            
            let $opt = $hzslider.options;

            // Reset sliding.
            $hzslider.isDraged = 0;
            // Calculate which slide need to be in view.
            $opt.currentSlide = ($opt.pixelOffset < $opt.startPixelOffset) ? $opt.currentSlide + Math.abs($step) : $opt.currentSlide - Math.abs($step);
            // Make sure that unexisting slides weren't selected.
            $opt.currentSlide = Math.min(Math.max($opt.currentSlide, 0), slideCount - Math.abs($step));
            // Since in this example slide is full viewport width offset can be calculated according to it.
           
            $hzslider.options = $opt;

            $hzslider.slideContinue( $this, $opt.currentSlide);
        }
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
                container: true
            },
            pagination : {
                el: ".hzslider-pagination",
                clickable: true,
                container: true,
                mode: 'horizontal', // vertical, horizontal
            },
            type : 'none', // progressbar, fraction
            responsive: {}
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
        $neSettings.itemsEl = ($settings.itemsEl) ? $settings.itemsEl : $el.querySelectorAll($neSettings.itemSelector);
        $neSettings.idSlide = ($settings.idSlide) ? $settings.idSlide : $el.getAttribute('id');
       
        return $neSettings;
    },
    getMatrix: function(element) {
        const values = element.style.transform.split(/\w+\(|\);?/);
        const transform = values[1].split(/,\s?/g).map(parseInt);
        return {
          x: (transform[0]) ? transform[0] : 0,
          y: (transform[1]) ? transform[1] : 0,
          z: (transform[2]) ? transform[2] : 0
        };
    }
};

