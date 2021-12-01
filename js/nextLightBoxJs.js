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

    init: function(  $selector ){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                if( !$v.getAttribute('njs-light-index') ){
                    $v.setAttribute('njs-light-index', $k);
                }
                $v.removeEventListener('click', $nJsLightBox.onOpen);
                $v.addEventListener('click', $nJsLightBox.onOpen);

            });
           
        }
    },

    onOpen: function( e ){
        e.preventDefault();
        let $v = this;
        let $url = ($v.getAttribute('njs-url')) ? $v.getAttribute('njs-url') : $v.getAttribute('href');
        let $content = ($v.getAttribute('njs-content')) ? $v.getAttribute('njs-content') : '';

        let $el = $nJsLightBox.renderPopup();
        console.log($el);
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

        let $wrapCon = document.createElement('div');
        $wrapCon.setAttribute('class', 'njs-lightboxCon-outer');

        let $wrapConSub = document.createElement('div');
        $wrapConSub.setAttribute('class', 'njs-lightboxCon-sub');

        let $images = document.createElement('div');
        $images.setAttribute('class', 'njs-image-continer');

        $wrapConSub.appendChild($images);

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
        $arr_buttonl.innerText = 'Previous';
        $wrapConArr.appendChild($arr_buttonl);


        let $arr_buttonr = document.createElement('button');
        $arr_buttonr.setAttribute('type', 'button');
        $arr_buttonr.setAttribute('title', 'Next');
        $arr_buttonr.setAttribute('class', 'next njs-arr-bt');
        $arr_buttonr.innerText = 'Next';
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
    }
    
};

// LightBox calling
$nJsLightBox.init('.njs-light');