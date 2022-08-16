"use strict";
/**
* Name: HaziJs Lightbox
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/

var $hJsLightBox = {
    clicked: 0,
    clickData: 0,
    wrap: null,
    init: function(  $selector ){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            let $i = 1;
            $tabs.forEach(function($v, $k){

                if( !$v.classList.contains('hjs-ignore-lightbox')){

                    let $data = $hJsLightBox.getData($v);
                    
                    if( $data === false){
                        let $child = $v.querySelectorAll('img:not(.hjs-ignore-lightbox)');
                        if( $child.length == 1){
                            let $src = $hJsLightBox.getData( $child[0]);
                            if( $src ){
                                $v.setAttribute('hjs-url', $src);
                                if( !$v.getAttribute('hjs-light-index') ){
                                    $v.setAttribute('hjs-light-index', $i);
                                }
                                $v.removeEventListener('click', $hJsLightBox.onOpen);
                                $v.addEventListener('click', $hJsLightBox.onOpen);
                                $i++;
                            }
                            
                        } else if( $child.length > 1){
                            $child.forEach( $v1 => {
                                let $src =  $hJsLightBox.getData($v1);
                                if( $src ){
                                    $v1.setAttribute('hjs-url', $src);
                                    if( !$v1.getAttribute('hjs-light-index') ){
                                        $v1.setAttribute('hjs-light-index', $i);
                                    }
                                    $v1.removeEventListener('click', $hJsLightBox.onOpen);
                                    $v1.addEventListener('click', $hJsLightBox.onOpen);   
                                    $i++; 
                                }
                            });
                        }
                    } else {
                        if( !$v.getAttribute('hjs-light-index') ){
                            $v.setAttribute('hjs-light-index', $i);
                        }
                        $v.removeEventListener('click', $hJsLightBox.onOpen);
                        $v.addEventListener('click', $hJsLightBox.onOpen);   
                        $i++; 
                    }
                }

            });
           
        }
    },

    getData: function( $v ){
        let $data = ($v.getAttribute('href')) ? $v.getAttribute('href') : false;
        $data = ($v.getAttribute('src')) ? $v.getAttribute('src') : $data;
        return ($v.getAttribute('hjs-url')) ? $v.getAttribute('hjs-url') : $data;
    },

    onOpen: function( e ){
        e.preventDefault();
        let $this = this;
        $hJsLightBox.renderContent(  $this );
    },
    renderContent: function( $v ){

        document.querySelectorAll('.hjs-lightbox-open').forEach( $vl => {
            $vl.classList.remove('hjs-lightbox-open');
        });
       
        let $url = $hJsLightBox.getData($v);
        let $contentEl = ($v.getAttribute('hjs-content')) ? $v.getAttribute('hjs-content') : false;

        let $el = $hJsLightBox.renderPopup();
        
        if( $el ){
            let $wrapConSub = $el.querySelector('.hjs-lightboxCon-sub');
            $wrapConSub.innerHTML = '';
            $v.classList.add('hjs-lightbox-open');

            if( $url && $wrapConSub){
                let $images = document.createElement('div');
                $images.setAttribute('class', 'hjs-image-continer');

                $wrapConSub.appendChild($images);
                
                let $img = document.createElement('img');
                $img.src = $url;
                $img.setAttribute('class', 'hjs-images-el');
                var $height = Math.round($el.querySelector('.hjs-lightbox-outer').offsetHeight - 100);
                $img.style.maxHeight = $height + 'px';
                $images.appendChild($img);

                window.addEventListener('resize', function(){
                    $height = Math.round($el.querySelector('.hjs-lightbox-outer').offsetHeight - 100);
                    $img.style.maxHeight = $height + 'px';
                });
            }

            // content
            if( !$contentEl ){
                return;
            }
            
            let $conEl = $v.querySelectorAll( $contentEl );
            if( $conEl.length > 0 && $wrapConSub){
                let $contentWrap = document.createElement('div');
                $contentWrap.setAttribute('class', 'hjs-content-continer');
                $conEl.forEach( $vc => {
                    $contentWrap.innerHTML += $vc.innerHTML;
                });
                $wrapConSub.appendChild($contentWrap);
            }
        }
    },
    onClose: function( e  ){
        e.preventDefault();
        let $el = $hJsLightBox.renderPopup();
        if( $el ){
            $el.remove();
        }
    }, 
    renderPopup: function(){
        let $ele = document.querySelector('.hjs-lightbox-popup');
        if($ele){
            return $ele;
        }

        $ele = document.createElement('div');
        $ele.setAttribute('class', 'hjs-lightbox-popup');

        let $overlay = document.createElement('div');
        $overlay.setAttribute('class', 'hjs-lightbox-overlay');
        $ele.appendChild($overlay);

        let $outerWrap = document.createElement('div');
        $outerWrap.setAttribute('class', 'hjs-lightbox-outer');
        
        let $wrap = document.createElement('div');
        $wrap.setAttribute('class', 'hjs-lightbox-wrap');
        $hJsLightBox.wrap = $wrap;
        $wrap.addEventListener("mousedown", $hJsLightBox.onDragReady);
        window.addEventListener("mouseup", $hJsLightBox.onDragFinish);
        /*or touched (for touch screens:*/
        $wrap.addEventListener("touchstart", $hJsLightBox.onDragReady);
        window.addEventListener("touchend", $hJsLightBox.onDragFinish);

        let $wrapCon = document.createElement('div');
        $wrapCon.setAttribute('class', 'hjs-lightboxCon-outer');

        let $wrapConSub = document.createElement('div');
        $wrapConSub.setAttribute('class', 'hjs-lightboxCon-sub');

        let $loading = document.createElement('div');
        $loading.setAttribute('class', 'hjs-lightboxConLoading');
        $loading.innerHTML = '<span class="hjs-loadingText">Loading...</span>';
        $wrapConSub.appendChild($loading);

        $wrapCon.appendChild($wrapConSub);

        let $close = document.createElement('button');
        $close.setAttribute('type', 'button');
        $close.setAttribute('title', 'Close');
        $close.setAttribute('class', 'hjs-close-bt');
        $close.innerText = '-';
        $close.removeEventListener('click', $hJsLightBox.onClose);
        $close.addEventListener('click', $hJsLightBox.onClose);

        $wrapCon.appendChild($close);

        let $wrapConArr = document.createElement('div');
        $wrapConArr.setAttribute('class', 'hjs-lightbox-arrows');

        let $arr_buttonl = document.createElement('button');
        $arr_buttonl.setAttribute('type', 'button');
        $arr_buttonl.setAttribute('title', 'Previous');
        $arr_buttonl.setAttribute('class', 'prev hjs-arr-bt');
        $arr_buttonl.setAttribute('hjs-type', 'prev');
        $arr_buttonl.innerText = 'Previous';

        $arr_buttonl.removeEventListener('click', $hJsLightBox.onControl);
        $arr_buttonl.addEventListener('click', $hJsLightBox.onControl);

        $wrapConArr.appendChild($arr_buttonl);


        let $arr_buttonr = document.createElement('button');
        $arr_buttonr.setAttribute('type', 'button');
        $arr_buttonr.setAttribute('title', 'Next');
        $arr_buttonr.setAttribute('class', 'next hjs-arr-bt');
        $arr_buttonr.setAttribute('hjs-type', 'next');
        $arr_buttonr.innerText = 'Next';
        $arr_buttonr.removeEventListener('click', $hJsLightBox.onControl);
        $arr_buttonr.addEventListener('click', $hJsLightBox.onControl);
        $wrapConArr.appendChild($arr_buttonr);

        $wrapCon.appendChild($wrapConArr);

        // wrapper
        $wrap.appendChild($wrapCon);

        // outer Wrap
        $outerWrap.appendChild($wrap);
        // main element
        $ele.appendChild($outerWrap);

        document.querySelector('body').appendChild($ele);

        return $ele;
    },
    onControl: function( e ){
        e.preventDefault();
        let $this = this;
        let $index = 0;
        let $type = $this.getAttribute('hjs-type');
        if( $type ){
            
            let $current = document.querySelector('.hjs-lightbox-open');
            if( $current ){
               
                $index = ($current.getAttribute('hjs-light-index') ) ? $current.getAttribute('hjs-light-index') : 0;
                if( $type == 'next'){
                    $index =  Math.round( $index ) + 1;
                } else {
                    $index =  Math.round( $index ) - 1;
                }
                let $nextOpen = document.querySelector('[hjs-light-index="'+$index+'"]');
                if( $nextOpen ){
                    $hJsLightBox.renderContent( $nextOpen );
                }
            }
        }
    },
    onDrag: function(  e ){
        e.preventDefault();
        if ($hJsLightBox.clicked == 0) return false;
        let $index = 0;
        let pos = $hJsLightBox.getCursorPos(e);
        console.log( $hJsLightBox.clickData );
        let $type = 'next';
        if( pos <= $hJsLightBox.clickData && $hJsLightBox.clickData != 0){
            $type = 'prev'
        }
        $hJsLightBox.clickData = pos;
        
        let $current = document.querySelector('.hjs-lightbox-open');
        if( $current ){
            
            $index = ($current.getAttribute('hjs-light-index') ) ? $current.getAttribute('hjs-light-index') : 0;
            if( $type == 'next'){
                $index =  Math.round( $index ) + 1;
            } else {
                $index =  Math.round( $index ) - 1;
            }
            let $nextOpen = document.querySelector('[hjs-light-index="'+$index+'"]');
            if( $nextOpen ){
                $hJsLightBox.renderContent( $nextOpen );
            }
            $hJsLightBox.clicked = 0;
        }
        
    },
    onDragFinish: function(){
        $hJsLightBox.clicked = 0;
    },
    onDragReady: function( e ){
        e.preventDefault();
        $hJsLightBox.clicked = 1;
        window.addEventListener("mousemove", $hJsLightBox.onDrag);
        window.addEventListener("touchmove", $hJsLightBox.onDrag);
    },
    getCursorPos: function(e) {
        var a, x = 0;
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        a = $hJsLightBox.wrap.getBoundingClientRect();
        x = e.pageX - a.left;
        x = x - window.pageXOffset;
        return x;
    }
    
};

// LightBox calling
$hJsLightBox.init('.hjs-light');