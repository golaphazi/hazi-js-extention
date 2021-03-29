"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/
class NextLaxxJs{

    setParallax( $selector, $settings = { x: 0, y: 0} ){

        window.removeEventListener('scroll', NextLaxxJs.onScroll);
        window.addEventListener('scroll', NextLaxxJs.onScroll);
        
        let $el = document.querySelectorAll($selector);
        if( !$el ){
            return;
        }

        $el.forEach(function($v){

            let $style = window.getComputedStyle($v)
            if ($style.getPropertyValue('position') === 'static') {
                $v.style.position = 'relative';
            }
            
            $v.style.transform = ($v.style.transform) ? $v.style.transform : 'translate3d(0px, 0px, 0px)';
            $v.style.transformStyle  = ($v.style.transformStyle) ? $v.style.transformStyle : 'preserve-3d';
            $v.style.backfaceVisibility = ($v.style.backfaceVisibility) ? $v.style.backfaceVisibility : 'hidden';
            $v.style.position = ($v.style.position) ? $v.style.position : 'relative';
            
            // bouns
            let $bounds = $v.getBoundingClientRect();
            //$v.setAttribute('njs-move-bounds', JSON.stringify($bounds));

            let $move = {};
            $move.elementPositionX = $bounds.left
            $move.elementPositionY = $bounds.top
            $move.elementWidth = $bounds.width
            $move.elementHeight = $bounds.height
            $move.elementCenterX = $move.elementWidth * $settings.x
            $move.elementCenterY = $move.elementHeight * $settings.y
            $move.elementRangeX = Math.max($move.elementCenterX, $move.elementWidth - $move.elementCenterX)
            $move.elementRangeY = Math.max($move.elementCenterY, $move.elementHeight - $move.elementCenterY)
            
            $v.setAttribute('njs-move-settings', JSON.stringify($move));

             // mouse event
             $v.removeEventListener('mousemove', NextLaxxJs.onMoveMouse);
             $v.addEventListener('mousemove', NextLaxxJs.onMoveMouse);
 
            // parent parallax element
            $v.querySelectorAll('.njs-layer').forEach(function($l, $i){
                if($l){
                    let $depth = $l.getAttribute('njs-depth');
                    if(!$depth){
                        $depth = 1;
                    }
                    let $style = $l.getBoundingClientRect();
                    
                    $l.style.transform = ($l.style.transform) ? $l.style.transform : 'translate3d(0px, 0px, 0px)';
                    $l.style.transformStyle  = ($l.style.transformStyle) ? $l.style.transformStyle : 'preserve-3d';
                    $l.style.backfaceVisibility = ($l.style.backfaceVisibility) ? $l.style.backfaceVisibility : 'hidden';
                    $l.classList.add('njs-layer-'+$i);

                    var $lposition = ($l.style.position) ? $l.style.position : 'absolute';

                    $l.style.position = $i ? $lposition : 'relative';
                    $l.style.display = ($l.style.display) ? $l.style.display : 'block';
                    $l.style.left = ($style.left) ? $style.left : 0;
                    $l.style.top = ($style.top) ? $style.top : 0;
                }
            });

        });
    }

    static onScroll( e ){
        e.preventDefault();
        // data attr 
        document.querySelectorAll('[njs-parallax]').forEach(function($v){
            if($v){
                let $value = JSON.stringify($v.getAttribute('njs-parallax'));
                if($value){
                    $value = JSON.parse( JSON.stringify($value) );
                    console.log($value);
                    
                }
                
            }
        });
    }

    static onMoveMouse( e ){
        e.preventDefault();

        let $this = this;

        var xDat = e.clientX;
        var yDat = e.clientY;

        var x, y, z;

        let $moveSettings = JSON.parse($this.getAttribute('njs-move-settings'));
        if($moveSettings){
            x = ($moveSettings.x) ? $moveSettings.x : 0;
            y = ($moveSettings.y) ? $moveSettings.y : 0;
            z = ($moveSettings.z) ? $moveSettings.z : 0;
        }

        // parent parallax element
        $this.querySelectorAll('.njs-layer').forEach(function($l){
            if($l){
                let $depth = $l.getAttribute('njs-depth');
                if(!$depth){
                    $depth = 1;
                }
                //$l.style.transform = 'translate3d('+xDat+'px, '+yDat+'px, 0px)';
            }
        });
        //console.log('x: ' + x + ' y: '+ y + ' z: ' + z);
    }
    // instance of class
    static instance() {
        return new NextLaxxJs();
    }
}

var nLJs = {
    parallax: NextLaxxJs.instance().setParallax
};

