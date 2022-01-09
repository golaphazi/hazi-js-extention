'use strict';
class HzSlider {
    /*** CONSTRUCTOR ***/
  
    constructor(options = {}) {
      // our options
      this.options = {
        // slider state and values
        // the div we are going to translate
        element: options.element || document.querySelector(".hzslider-ready"),
        // easing value, the lower the smoother
        easing: options.easing || 0.1,
        // translation speed
        // 1: will follow the mouse
        // 2: will go twice as fast as the mouse, etc
        dragSpeed: options.dragSpeed || 1,
        // duration of the in animation
        duration: options.duration || 750
      };
  
      // if we are currently dragging
      this.isMouseDown = false;
      // if the slider is currently translating
      this.isTranslating = false;
  
      // current position
      this.currentPosition = 0;
      // drag start position
      this.startPosition = 0;
      // drag end position
      this.endPosition = 0;
  
      // slider translation
      this.translation = 0;
  
      this.animationFrame = null;
  
      // set up the slider
      this.setupSlider();
    }
  
    /*** HELPERS ***/
  
    // lerp function used for easing
    lerp(value1, value2, amount) {
      amount = amount < 0 ? 0 : amount;
      amount = amount > 1 ? 1 : amount;
      return (1 - amount) * value1 + amount * value2;
    }
  
    // return our mouse or touch position
    getMousePosition(e) {
      var mousePosition;
      if (e.targetTouches) {
        if (e.targetTouches[0]) {
          mousePosition = [
            e.targetTouches[0].clientX,
            e.targetTouches[0].clientY
          ];
        } else if (e.changedTouches[0]) {
          // handling touch end event
          mousePosition = [
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          ];
        } else {
          // fallback
          mousePosition = [e.clientX, e.clientY];
        }
      } else {
        mousePosition = [e.clientX, e.clientY];
      }
  
      return mousePosition;
    }
  
    // set the slider boundaries
    // we will translate it horizontally in landscape mode
    // vertically in portrait mode
    setBoundaries() {
      if (window.innerWidth >= window.innerHeight) {
        // landscape
        this.boundaries = {
          max: -1 * this.options.element.clientWidth + window.innerWidth,
          min: 0,
          sliderSize: this.options.element.clientWidth,
          referentSize: window.innerWidth
        };
  
        // set our slider direction
        this.direction = 0;
      } else {
        // portrait
        this.boundaries = {
          max: -1 * this.options.element.clientHeight + window.innerHeight,
          min: 0,
          sliderSize: this.options.element.clientHeight,
          referentSize: window.innerHeight
        };
  
        // set our slider direction
        this.direction = 1;
      }
    }
  
    /*** HOOKS ***/
  
    // this is called once our mousedown / touchstart event occurs and the drag started
    onDragStarted(mousePosition) {}
  
    // this is called while we are currently dragging the slider
    onDrag(mousePosition) {}
  
    // this is called once our mouseup / touchend event occurs and the drag started
    onDragEnded(mousePosition) {}
  
    // this is called continuously while the slider is translating
    onTranslation() {}
  
    // this is called once the translation has ended
    onTranslationEnded() {}
  
    // this is called after our slider has been resized
    onSliderResized() {}
  
    /*** ANIMATIONS ***/
  
    // this will translate our slider HTML element and set up our hooks
    translateSlider(translation) {
      translation = Math.floor(translation * 100) / 100;
  
      // should we translate it horizontally or vertically?
      var direction = this.direction === 0 ? "translateX" : "translateY";
      // apply translation
      this.options.element.style.transform =
        direction + "(" + translation + "px)";
  
      // if the slider translation is different than the translation to apply
      // that means the slider is still translating
      if (this.translation !== translation) {
        // hook function to execute while we are translating
        this.onTranslation();
      } else if (this.isTranslating && !this.isMouseDown) {
        // if those conditions are met, that means the slider is no longer translating
        this.isTranslating = false;
  
        // hook function to execute after translation has ended
        this.onTranslationEnded();
      }
  
      // finally set our translation
      this.translation = translation;
    }
  
    // this is our request animation frame loop where we will translate our slider
    animate() {
      // interpolate values
      var translation = this.lerp(
        this.translation,
        this.currentPosition,
        this.options.easing
      );
  
      // apply our translation
      this.translateSlider(translation);
  
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
  
    /*** EVENTS ***/
  
    // on mouse down or touch start
    onMouseDown(e) {
      // start dragging
      this.isMouseDown = true;
  
      // apply specific styles
      this.options.element.classList.add("dragged");
  
      // get our touch/mouse start position
      var mousePosition = this.getMousePosition(e);
      // use our slider direction to determine if we need X or Y value
      this.startPosition = mousePosition[this.direction];
  
      // drag start hook
      this.onDragStarted(mousePosition);
    }
  
    // on mouse or touch move
    onMouseMove(e) {
      // if we are not dragging, we don't do nothing
      if (!this.isMouseDown) return;
  
      // get our touch/mouse position
      var mousePosition = this.getMousePosition(e);
  
      // get our current position
      this.currentPosition =
        this.endPosition +
        (mousePosition[this.direction] - this.startPosition) *
          this.options.dragSpeed;
  
      // if we're not hitting the boundaries
      if (
        this.currentPosition > this.boundaries.min &&
        this.currentPosition < this.boundaries.max
      ) {
        // if we moved that means we have started translating the slider
        this.isTranslating = true;
      } else {
        // clamp our current position with boundaries
        this.currentPosition = Math.min(
          this.currentPosition,
          this.boundaries.min
        );
        this.currentPosition = Math.max(
          this.currentPosition,
          this.boundaries.max
        );
      }
  
      // drag hook
      this.onDrag(mousePosition);
    }
  
    // on mouse up or touchend
    onMouseUp(e) {
      // we have finished dragging
      this.isMouseDown = false;
  
      // remove specific styles
      this.options.element.classList.remove("dragged");
  
      // update our end position
      this.endPosition = this.currentPosition;
  
      // send our mouse/touch position to our hook
      var mousePosition = this.getMousePosition(e);
  
      // drag ended hook
      this.onDragEnded(mousePosition);
    }
  
    // on resize we will need to apply old translation value to new sizes
    onResize(e) {
      // get our old translation ratio
      var ratio = this.translation / this.boundaries.sliderSize;
  
      // reset boundaries and properties bound to window size
      this.setBoundaries();
  
      // reset all translations
      this.options.element.style.transform = "tanslate3d(0, 0, 0)";
  
      // calculate our new translation based on the old translation ratio
      var newTranslation = ratio * this.boundaries.sliderSize;
      // clamp translation to the new boundaries
      newTranslation = Math.min(newTranslation, this.boundaries.min);
      newTranslation = Math.max(newTranslation, this.boundaries.max);
  
      // apply our new translation
      this.translateSlider(newTranslation);
  
      // reset current and end positions
      this.currentPosition = newTranslation;
      this.endPosition = newTranslation;
  
      // call our resize hook
      this.onSliderResized();
    }
  
    /*** SET UP AND DESTROY ***/
  
    // set up our slider
    // init its boundaries, add event listeners and start raf loop
    setupSlider() {
      this.setBoundaries();
  
      // event listeners
  
      // mouse events
      window.addEventListener("mousemove", this.onMouseMove.bind(this), {
        passive: true
      });
      window.addEventListener("mousedown", this.onMouseDown.bind(this));
      window.addEventListener("mouseup", this.onMouseUp.bind(this));
  
      // touch events
      window.addEventListener("touchmove", this.onMouseMove.bind(this), {
        passive: true
      });
      window.addEventListener("touchstart", this.onMouseDown.bind(this), {
        passive: true
      });
      window.addEventListener("touchend", this.onMouseUp.bind(this));
  
      // resize event
      window.addEventListener("resize", this.onResize.bind(this));
  
      // launch our request animation frame loop
      this.animate();
    }
  
    // will be called silently to cleanly remove the slider
    destroySlider() {
      // remove event listeners
  
      // mouse events
      window.removeEventListener("mousemove", this.onMouseMove, {
        passive: true
      });
      window.removeEventListener("mousedown", this.onMouseDown);
      window.removeEventListener("mouseup", this.onMouseUp);
  
      // touch events
      window.removeEventListener("touchmove", this.onMouseMove, {
        passive: true
      });
      window.removeEventListener("touchstart", this.onMouseDown, {
        passive: true
      });
      window.removeEventListener("touchend", this.onMouseUp);
  
      // resize event
      window.removeEventListener("resize", this.onResize);
  
      // cancel request animation frame
      cancelAnimationFrame(this.animationFrame);
    }
  
    // call this method publicly to destroy our slider
    destroy() {
      // destroy everything related to the slider
      this.destroySlider();
    }
}
  
var $hzslider = {
    isDraged: false,
    isSlider: false,
    isPosition: 0,
    options: {},
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
                $v.classList.add('hzslider-ready', 'hzslider-wrapper-'+ $k);
               

                let $parentEl = $v.parentElement;
                $parentEl.style.overflow = 'hidden';
                $parentEl.style.position = 'relative';

                /*$parentEl.addEventListener('mouseenter', $hzslider.slideReady);
                $v.addEventListener('mousedown', $hzslider.slideReady);
                window.addEventListener("mousemove", $hzslider.slideMove);
                window.addEventListener('mouseup', $hzslider.slideFinish);
                window.addEventListener('mouseleave', $hzslider.slideFinish);
                
                $v.addEventListener("touchstart", $hzslider.slideReady);
                window.addEventListener("touchend", $hzslider.slideFinish);*/

                /*var options = {
                    element: $v,
                    easing: 0.075,
                    duration: 500,
                    dragSpeed: 1.75
                };
                new HzSlider(options);*/
                // render slider
                $hzslider.renderSlider( $v );

            });
            return $slider;
        }
        return $hzslider;
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

            if( $navigation.prevEl ){
                let $prebtn = document.querySelector( $navigation.prevEl );
                if( $conner ){
                    $prebtn = $parentEl.querySelector( $navigation.prevEl );
                }
                if( $prebtn ){
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

            // pagination
            let $paginaCon = ($pagination.container) ? $pagination.container : true;
            let $clickable = ($pagination.clickable) ? $pagination.clickable : true;
            if( $pagination.el ){
                let $pagi = document.querySelector( $pagination.el );
                if( $paginaCon ){
                    $pagi = $parentEl.querySelector( $pagination.el );
                }

                if( $pagi ){
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
                    }
                }
            }
        }
        

    },
    resetClass: function( $el ){
        $el.forEach( $v1 => {
            $v1.classList.remove('hzslide-prev');
            $v1.classList.remove('hzslide-next');
            $v1.classList.remove('hzslide-active');
        });
    },
    resetClassBullet: function( $el ){
        $el.forEach( $v1 => {
            $v1.classList.remove('hzslider-pagination-active');
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
    slideContinue: function($v, $typeSlide){
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
                }
            }
        }
       
        $hzslider.isPosition = $pointer;

        return $setIndex;
    },
    slideReady: function( evt ){
        evt = evt || window.event;
        let $this = this;
        if( !$this.classList.contains('hzslider-ready') ){
            return;
        }
        $hzslider.isDraged = true;
        $hzslider.isSlider = $this;
    },
    slideFinish: function(){
        if( $hzslider.isDraged ){
            $hzslider.isDraged = false;
            $hzslider.isSlider = false;
        }
    },
    slideMove: function( evt ){
        evt = evt || window.event;
        let evtEl = evt.target;
        if( !$hzslider.isDraged ){
            return;
        }
        let $target = $hzslider.isSlider;
        if ($target == false) return false;

        let $opt = $hzslider.options;

      
        console.log('O:', $opt);
        console.log('P:', $hzslider.isPosition);

        var mouseMoveTimeout;

        let $sett = $hzslider.getSettings( $target );
        let $direction = ($sett.direction) ? $sett.direction : 'horizontal';


        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(function() {
            if( $direction == 'vertical'){
               // let topPos =  evt.pageY - $target.offsetTop;
                let topPos = evt.pageY - ($opt.cursorHeight / 2);
                $target.style.transform = "translate3d(0px, -" + topPos + "px, 0px)";
                $hzslider.isPosition = topPos;
            } else{
                //let leftPos = evt.pageX - $target.offsetLeft;
                let leftPos = evt.pageX - ($opt.cursorWidth / 2);
                $target.style.transform = "translate3d(-" + leftPos + "px, 0px, 0px)";
                $hzslider.isPosition = leftPos;
            }
            
        }, 10);
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

