"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/

var $nJsLightBox = {
    clicked: 0,
    clickData: 0,
    wrap: null,
    init: function(  $selector ){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            let $i = 1;
            $tabs.forEach(function($v, $k){

                if( !$v.classList.contains('njs-ignore-lightbox')){

                    let $data = $nJsLightBox.getData($v);
                    
                    if( $data === false){
                        let $child = $v.querySelectorAll('img:not(.njs-ignore-lightbox)');
                        if( $child.length == 1){
                            let $src = $nJsLightBox.getData( $child[0]);
                            if( $src ){
                                $v.setAttribute('njs-url', $src);
                                if( !$v.getAttribute('njs-light-index') ){
                                    $v.setAttribute('njs-light-index', $i);
                                }
                                $v.removeEventListener('click', $nJsLightBox.onOpen);
                                $v.addEventListener('click', $nJsLightBox.onOpen);
                                $i++;
                            }
                            
                        } else if( $child.length > 1){
                            $child.forEach( $v1 => {
                                let $src =  $nJsLightBox.getData($v1);
                                if( $src ){
                                    $v1.setAttribute('njs-url', $src);
                                    if( !$v1.getAttribute('njs-light-index') ){
                                        $v1.setAttribute('njs-light-index', $i);
                                    }
                                    $v1.removeEventListener('click', $nJsLightBox.onOpen);
                                    $v1.addEventListener('click', $nJsLightBox.onOpen);   
                                    $i++; 
                                }
                            });
                        }
                    } else {
                        if( !$v.getAttribute('njs-light-index') ){
                            $v.setAttribute('njs-light-index', $i);
                        }
                        $v.removeEventListener('click', $nJsLightBox.onOpen);
                        $v.addEventListener('click', $nJsLightBox.onOpen);   
                        $i++; 
                    }
                }

            });
           
        }
    },

    getData: function( $v ){
        let $data = ($v.getAttribute('href')) ? $v.getAttribute('href') : false;
        $data = ($v.getAttribute('src')) ? $v.getAttribute('src') : $data;
        return ($v.getAttribute('njs-url')) ? $v.getAttribute('njs-url') : $data;
    },

    onOpen: function( e ){
        e.preventDefault();
        let $this = this;
        $nJsLightBox.renderContent(  $this );
    },
    renderContent: function( $v ){

        document.querySelectorAll('.njs-lightbox-open').forEach( $vl => {
            $vl.classList.remove('njs-lightbox-open');
        });
       
        let $url = $nJsLightBox.getData($v);
        let $contentEl = ($v.getAttribute('njs-content')) ? $v.getAttribute('njs-content') : false;

        let $el = $nJsLightBox.renderPopup();
        
        if( $el ){
            let $wrapConSub = $el.querySelector('.njs-lightboxCon-sub');
            $wrapConSub.innerHTML = '';
            $v.classList.add('njs-lightbox-open');

            if( $url && $wrapConSub){
                let $images = document.createElement('div');
                $images.setAttribute('class', 'njs-image-continer');

                $wrapConSub.appendChild($images);
                
                let $img = document.createElement('img');
                $img.src = $url;
                $img.setAttribute('class', 'njs-images-el');
                var $height = Math.round($el.querySelector('.njs-lightbox-outer').offsetHeight - 100);
                $img.style.maxHeight = $height + 'px';
                $images.appendChild($img);

                window.addEventListener('resize', function(){
                    $height = Math.round($el.querySelector('.njs-lightbox-outer').offsetHeight - 100);
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
                $contentWrap.setAttribute('class', 'njs-content-continer');
                $conEl.forEach( $vc => {
                    $contentWrap.innerHTML += $vc.innerHTML;
                });
                $wrapConSub.appendChild($contentWrap);
            }
        }
    },
    onClose: function( e  ){
        e.preventDefault();
        let $el = $nJsLightBox.renderPopup();
        if( $el ){
            $el.remove();
        }
    }, 
    renderPopup: function(){
        let $ele = document.querySelector('.njs-lightbox-popup');
        if($ele){
            return $ele;
        }

        $ele = document.createElement('div');
        $ele.setAttribute('class', 'njs-lightbox-popup');

        let $overlay = document.createElement('div');
        $overlay.setAttribute('class', 'njs-lightbox-overlay');
        $ele.appendChild($overlay);

        let $outerWrap = document.createElement('div');
        $outerWrap.setAttribute('class', 'njs-lightbox-outer');
        
        let $wrap = document.createElement('div');
        $wrap.setAttribute('class', 'njs-lightbox-wrap');
        $nJsLightBox.wrap = $wrap;
        $wrap.addEventListener("mousedown", $nJsLightBox.onDragReady);
        window.addEventListener("mouseup", $nJsLightBox.onDragFinish);
        /*or touched (for touch screens:*/
        $wrap.addEventListener("touchstart", $nJsLightBox.onDragReady);
        window.addEventListener("touchend", $nJsLightBox.onDragFinish);

        let $wrapCon = document.createElement('div');
        $wrapCon.setAttribute('class', 'njs-lightboxCon-outer');

        let $wrapConSub = document.createElement('div');
        $wrapConSub.setAttribute('class', 'njs-lightboxCon-sub');

        let $loading = document.createElement('div');
        $loading.setAttribute('class', 'njs-lightboxConLoading');
        $loading.innerHTML = '<span class="njs-loadingText">Loading...</span>';
        $wrapConSub.appendChild($loading);

        $wrapCon.appendChild($wrapConSub);

        let $close = document.createElement('button');
        $close.setAttribute('type', 'button');
        $close.setAttribute('title', 'Close');
        $close.setAttribute('class', 'njs-close-bt');
        $close.innerText = '-';
        $close.removeEventListener('click', $nJsLightBox.onClose);
        $close.addEventListener('click', $nJsLightBox.onClose);

        $wrapCon.appendChild($close);

        let $wrapConArr = document.createElement('div');
        $wrapConArr.setAttribute('class', 'njs-lightbox-arrows');

        let $arr_buttonl = document.createElement('button');
        $arr_buttonl.setAttribute('type', 'button');
        $arr_buttonl.setAttribute('title', 'Previous');
        $arr_buttonl.setAttribute('class', 'prev njs-arr-bt');
        $arr_buttonl.setAttribute('njs-type', 'prev');
        $arr_buttonl.innerText = 'Previous';

        $arr_buttonl.removeEventListener('click', $nJsLightBox.onControl);
        $arr_buttonl.addEventListener('click', $nJsLightBox.onControl);

        $wrapConArr.appendChild($arr_buttonl);


        let $arr_buttonr = document.createElement('button');
        $arr_buttonr.setAttribute('type', 'button');
        $arr_buttonr.setAttribute('title', 'Next');
        $arr_buttonr.setAttribute('class', 'next njs-arr-bt');
        $arr_buttonr.setAttribute('njs-type', 'next');
        $arr_buttonr.innerText = 'Next';
        $arr_buttonr.removeEventListener('click', $nJsLightBox.onControl);
        $arr_buttonr.addEventListener('click', $nJsLightBox.onControl);
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
        let $type = $this.getAttribute('njs-type');
        if( $type ){
            
            let $current = document.querySelector('.njs-lightbox-open');
            if( $current ){
               
                $index = ($current.getAttribute('njs-light-index') ) ? $current.getAttribute('njs-light-index') : 0;
                if( $type == 'next'){
                    $index =  Math.round( $index ) + 1;
                } else {
                    $index =  Math.round( $index ) - 1;
                }
                let $nextOpen = document.querySelector('[njs-light-index="'+$index+'"]');
                if( $nextOpen ){
                    $nJsLightBox.renderContent( $nextOpen );
                }
            }
        }
    },
    onDrag: function(  e ){
        e.preventDefault();
        if ($nJsLightBox.clicked == 0) return false;
        let $index = 0;
        let pos = $nJsLightBox.getCursorPos(e);
        console.log( $nJsLightBox.clickData );
        let $type = 'next';
        if( pos <= $nJsLightBox.clickData && $nJsLightBox.clickData != 0){
            $type = 'prev'
        }
        $nJsLightBox.clickData = pos;
        
        let $current = document.querySelector('.njs-lightbox-open');
        if( $current ){
            
            $index = ($current.getAttribute('njs-light-index') ) ? $current.getAttribute('njs-light-index') : 0;
            if( $type == 'next'){
                $index =  Math.round( $index ) + 1;
            } else {
                $index =  Math.round( $index ) - 1;
            }
            let $nextOpen = document.querySelector('[njs-light-index="'+$index+'"]');
            if( $nextOpen ){
                $nJsLightBox.renderContent( $nextOpen );
            }
            $nJsLightBox.clicked = 0;
        }
        
    },
    onDragFinish: function(){
        $nJsLightBox.clicked = 0;
    },
    onDragReady: function( e ){
        e.preventDefault();
        $nJsLightBox.clicked = 1;
        window.addEventListener("mousemove", $nJsLightBox.onDrag);
        window.addEventListener("touchmove", $nJsLightBox.onDrag);
    },
    getCursorPos: function(e) {
        var a, x = 0;
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        a = $nJsLightBox.wrap.getBoundingClientRect();
        x = e.pageX - a.left;
        x = x - window.pageXOffset;
        return x;
    }
    
};

// LightBox calling
$nJsLightBox.init('.njs-light');