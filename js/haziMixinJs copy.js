"use strict";
/**
* Name: HaziJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/
class NextMixinJs{
    
    

    loadMixin( $selector = '', $settings = ''){
        let $el =  document.querySelectorAll($selector);
        if( !$el ){
            return;
        }

        $el.forEach(function($v, $k){
            $v.classList.add('hjs-mixin-wrapper');
            $v.setAttribute('hjs-mixin', 'nextmix-'+$k); 
            $v.setAttribute('hjs-display', 'desktop'); 
            if( $settings != ''){
                $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
            }

            NextMixinJs.instance().getSettings($v);

            
            //get filter
            NextMixinJs.instance().getFilter($v);

            // content settings
            NextMixinJs.instance().getContents($v);

            
        });
        
        NextMixinJs.instance().responsiveMode();
    }

    responsiveMode(){

         // desktop mode
         var desktop = window.matchMedia("(min-width: 1025px)");
         NextMixinJs.instance().desktopMedia(desktop);
         desktop.addListener(NextMixinJs.instance().desktopMedia);

        // tablate mode
        var tablet = window.matchMedia("(max-width: 1024px) and (min-width: 768px)");
        NextMixinJs.instance().tablateMedia(tablet);
        tablet.addListener(NextMixinJs.instance().tablateMedia);

        // mobile 
        var mobile = window.matchMedia("(max-width: 767px)");
        NextMixinJs.instance().mobileMedia(mobile);
        mobile.addListener( NextMixinJs.instance().mobileMedia);

        // window resize
        window.addEventListener('resize', NextMixinJs.instance().resizeMedia);
    }

    resizeMedia( e ){
        var w = window.outerWidth;
        var h = window.outerHeight;

        document.querySelectorAll('.hjs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }
    desktopMedia( $x ){
        if($x.matches){
            document.querySelectorAll('.hjs-mixin-wrapper[hjs-settings]').forEach(function($v){
                $v.setAttribute('hjs-display', 'desktop');
            });
        }
        document.querySelectorAll('.hjs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }
    tablateMedia( $x ){
        if($x.matches){
            document.querySelectorAll('.hjs-mixin-wrapper[hjs-settings]').forEach(function($v){
                $v.setAttribute('hjs-display', 'tablate');
            });
        } else {
            document.querySelectorAll('.hjs-mixin-wrapper[hjs-settings]').forEach(function($v){
                $v.setAttribute('hjs-display', 'desktop');
            });
        }

        document.querySelectorAll('.hjs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }

    mobileMedia( $x){
        if($x.matches){
            document.querySelectorAll('.hjs-mixin-wrapper[hjs-settings]').forEach(function($v){
                $v.setAttribute('hjs-display', 'mobile');
            });
        } 
        document.querySelectorAll('.hjs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }

    getSettings( $el ){
        let $default = {
            type : 'grid', // grid, metro, masonry
            ratio: 1,
            columns: 3,
            columnsTablet: 2,
            columnsMobile: 1,
            gutter: 30,
            filter: '.hjs-filter',
            filterItem: '.hjs-filter-item',
            filterAction: 'click',
            itemContainer: '.hjs-item-container',
            item: '.hjs-item',
            itemHeight: '.hjs-item-height',
        };

        let $settings = $el.getAttribute('hjs-settings');
        if( !$settings ){
            $el.setAttribute('hjs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);

        let $neSettings = {};
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.ratio = ($settings.ratio) ? $settings.ratio : $default.ratio;
        $neSettings.columns = ($settings.columns) ? $settings.columns : $default.columns;
        $neSettings.columnsTablet = ($settings.columnsTablet) ? $settings.columnsTablet : $default.columnsTablet;
        $neSettings.columnsMobile = ($settings.columnsMobile) ? $settings.columnsMobile : $default.columnsMobile;
        $neSettings.gutter = ($settings.gutter) ? $settings.gutter : $default.gutter;
        $neSettings.filter = ($settings.filter) ? $settings.filter : $default.filter;
        $neSettings.filterItem = ($settings.filterItem) ? $settings.filterItem : $default.filterItem;
        $neSettings.itemContainer = ($settings.itemContainer) ? $settings.itemContainer : $default.itemContainer;
        $neSettings.item = ($settings.item) ? $settings.item : $default.item;

        return $neSettings;
    }

    getFilter( $el ){
        let $settings = NextMixinJs.instance().getSettings($el);
        var $filter = ($settings.filter) ? $settings.filter : '';
        var $filterItem = ($settings.filterItem) ? $settings.filterItem : '*';
        var $filterAction = ($settings.filterAction) ? $settings.filterAction : 'click';
        if( $filter !== ''){
            
            let $filEl = document.querySelectorAll($filter);
            if( $filEl ){
                let $elIndex = $el.getAttribute('hjs-mixin');
                $filEl.forEach(function($v, $k){
                   
                   $v.setAttribute('hjs-filter', $elIndex);

                   let $item = $v.querySelectorAll($filterItem);
                   if($item.length == 0){
                      $item = $v.querySelectorAll('*');
                   }

                   let $dataFilter = '*';

                   $item.forEach(function($v1){

                      $v1.removeEventListener($filterAction, NextMixinJs.instance().toggleFilter);
                      $v1.addEventListener($filterAction, NextMixinJs.instance().toggleFilter);
                      $v1.setAttribute('hjs-filter-content', $elIndex);

                      if( $v1.classList.contains('hjs-current') ){
                        if( $v1.getAttribute('hjs-filter-action') ){
                            $dataFilter = $v1.getAttribute('hjs-filter-action');
                        }
                        $el.setAttribute('hjs-active', '-1');
                      }

                   });

                });
            }
        }
    }

    toggleFilter( e ){
        e.preventDefault();
        let $this = this;
        let $dataFilter = '*';
        if( $this.getAttribute('hjs-filter-action') ){
            $dataFilter = $this.getAttribute('hjs-filter-action');
        }
        
        let $target = $this.getAttribute('hjs-filter-content');

        let $el = document.querySelector('[hjs-mixin="'+$target+'"]');
        if($el){
            $el.setAttribute('hjs-active', $dataFilter);

            NextMixinJs.instance().getContents($el);
        }
       return;
    }

    openFilter( $el, $target){
        let $settings = NextMixinJs.instance().getSettings($el);
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $gutter = ($settings.gutter) ? $settings.gutter : 0;
        let $itemConSelector = ($settings.itemContainer) ? $settings.itemContainer : '.hjs-item-container';
        let $itemSelector = ($settings.item) ? $settings.item : '.hjs-item';
        
        let $itemCon = $el.querySelector($itemConSelector);
        if( !$itemCon ){
            return;
        }
        var $totalHeight = 0;
        let $items = $itemCon.querySelectorAll($itemSelector);
        let $targetClass = $target.replace('.', '').replace('#', '');
        if($items){
            $items.forEach(function($v, $k){
                if($targetClass != '*'){
                   
                    if($v.classList.contains($targetClass) ){

                        /*let $clientItem = $v.getBoundingClientRect();
                        let $height = ($clientItem.height) ? $clientItem.height: 0;
                        let $width = ($clientItem.width) ? $clientItem.width: 0;
    
                        $totalHeight += Math.floor($height + $gutter);*/

                        $v.style.display = 'block';
                        console.log($target);
                    } else {
                        $v.style.display = 'none';
                    }
                    
                } else {
                    $v.style.display = 'block';
                }
            });
            
                        
        }
        
        if($totalHeight != 0 && $target != '*'){
            //$itemCon.style.height = ($totalHeight / $columns)  + 'px';
        }
    
        
    }

    getContents( $el ){
        let $settings = NextMixinJs.instance().getSettings($el);
       
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $type = ($settings.type) ? $settings.type : 'grid';
        let $ratio = ($settings.ratio) ? $settings.ratio : 1;
        let $gutter = ($settings.gutter) ? $settings.gutter : 0;
        

        let $client = $el.getBoundingClientRect();
        
        var $tWidth = $client.width;
        var $tHeight = $client.height;

        var $target1 = $el.getAttribute('hjs-active');
        if( $target1 == -1){
            var $target = '*';
        } else {
            var $target = $target1;
        }
        let $targetClass = $target.replace('.', '').replace('#', '');
        
        var $responMode = $el.getAttribute('hjs-display');
        if($responMode == "tablate"){
            $columns = ($settings.columnsTablet) ? $settings.columnsTablet : 2;
        }
        else if($responMode == "mobile"){
            $columns = ($settings.columnsMobile) ? $settings.columnsMobile : 1;
        }
        let $gutterCOl = Math.floor($gutter * ($columns - 1));
        let $itemWidth = Math.floor(($tWidth - $gutterCOl) / $columns);

        let $itemConSelector = ($settings.itemContainer) ? $settings.itemContainer : '.hjs-item-container';
        let $itemSelector = ($settings.item) ? $settings.item : '.hjs-item';
        let $itemHeightSelector = ($settings.itemHeight) ? $settings.itemHeight : '.hjs-item-height';
        
        let $itemCon = $el.querySelector($itemConSelector);
        if( !$itemCon ){
            return;
        }
        $itemCon.style.position = 'relative';

        var $totalHeight = 0;
        let $heigthColumnCount = 0;
        let $items = $itemCon.querySelectorAll($itemSelector);

        if($target == '*'){
            var $targetList = $items;
        }else{
            var $targetList = $itemCon.querySelectorAll($itemSelector+$target);
        }
        
        if($items){
            var $itemArr = [];
            var $itemRatio = [];
            let $widthRatio = $ratio;
            let $heightRatio = $ratio;
            let $itemheight = 'auto';
            let $top = 0;
            let $left = 0;
            let $totalItem = 1;

            let $start_width = 0;
            let $start_height = 0;
            let $start_top = 0;
            let $start_left = 0;

            let $maxHeight = $ratio;
            let $maxWidth = 0;
            let $maxTotalHeight = [];

            let $ratio_x = 0;
            let $ratio_y = 1;

            const $objItem = [];
            const $map = [];
            $items.forEach(function($v, $k){

                let $clientItem = $v.getBoundingClientRect();
                let $style = window.getComputedStyle($v);
                let leftTrans = $style.getPropertyValue('left');
                let topTrans = $style.getPropertyValue('top');

                let $height = Math.floor(($clientItem.height) ? $clientItem.height: 0);
                let $width = ($clientItem.width) ? $clientItem.width: 0;

                $widthRatio = Math.floor(($v.getAttribute('hjs-width')) ? $v.getAttribute('hjs-width') : $ratio);
                $heightRatio = Math.floor(($v.getAttribute('hjs-height')) ? $v.getAttribute('hjs-height') : $ratio);

                var $itWidth = Math.floor( ($itemWidth * $widthRatio) + ($gutter * ($widthRatio - 1)) );
                $itemheight = Math.floor( ($itemWidth * $heightRatio) + ($gutter * ($heightRatio - 1)) );
                 
                $v.setAttribute('hjs-index-item', $totalItem);
                
                if( $widthRatio > $columns){
                    $widthRatio = $columns;
                }

                let $avg = Math.floor($k % $columns);
                
                if($avg == 0 && $k != 0){
                    $ratio_x = 0;
                }
                $ratio_x += $widthRatio;
                /*console.log('Avg', $avg);
                console.log('W', $itWidth);
                console.log('H', $itemheight);
                console.log('X', $ratio_x);*/

                var $obj = {
                    'avg' : $avg,
                    'w' : $itWidth,
                    'h' : $itemheight,
                    'wr' : $widthRatio,
                    'hr' : $heightRatio
                };
                

                $map[$k] = $obj;
                
                $objItem[$k] = $avg;

                /*
                if($avg == 0 && $k != 0){
                    $ratio_x += 1;
                } 
                var $key =  $ratio_x + ':' + $avg;
               
                $itemRatio.push(  $key );

                $objItem[$key] = $widthRatio;*/

                

                if( $start_width >= $columns){
                    if($maxHeight > $heightRatio){
                        $start_width = $maxWidth;
                        $maxHeight = $ratio;
                        $start_top += $heightRatio;
                    }else {
                        $start_width = 0;
                        $start_top++;
                    }
                    $top = Math.floor( ($itemWidth + $gutter) * $start_top); 

                    $maxTotalHeight.push( Math.floor($top + $itemheight));
                }

                if($maxHeight < $heightRatio){
                    $maxHeight = $heightRatio;
                    $maxWidth = $widthRatio;
                }

                $left = Math.floor( $start_width * ($itemWidth + $gutter) );

                $itemArr[$k] = {
                    'avg' : $maxWidth,
                    'avg_top' : $maxHeight,
                    'style' : {
                        'width' : $itWidth + 'px',
                        'height' : $itemheight + 'px',
                        'position' : 'absolute',
                        'top': $top + 'px',
                        'left' : $left + 'px',
                        'index' : $totalItem
                    },
                    'hjs-index-item' : $totalItem,
                    'hjs-width' : $widthRatio,
                    'hjs-height' : $heightRatio,
                }

                // set attribute
                $v.style.width =  ($itemArr[$k].style.width) ?? '0px';
                $v.style.position = ($itemArr[$k].style.position) ?? 'absolute';
                $v.style.top = ($itemArr[$k].style.top) ?? '0px';
                $v.style.left = ($itemArr[$k].style.left) ?? '0px';

                let $heightItem = $v.querySelector($itemHeightSelector);
                if( !$heightItem ){
                    $heightItem = $v;
                }
                $heightItem.style.height = ($itemArr[$k].style.height) ?? '0px';

                $start_width += $widthRatio;
                $start_height += $heightRatio;
                
                $totalItem++; 
            });

            $totalHeight = NextMixinJs.instance().maxValue($maxTotalHeight);

            //console.log($map);
            //console.log($objItem);

            var $mapAll = NextMixinJs.instance().margeMap($map, $objItem);
            console.log($mapAll);
        }


        /*
        if($items){
            let $top = 0;
            let $left = 0;
            let $itemLeft = 0;
            let $stepTop = 0;

            let $widthRatio = 1;
            let $heightRatio = $ratio;
           
            let $totalItemLe = Number($items.length);
            let $Itemheight = 'auto';
            let $start = 0;
            let $totalItem = 1;
            let $maxHeight = [];
            let $list = 0;
            let $hei = 0;
            let $heiIndex = 0;
            $items.forEach(function($v, $k){

                let $clientItem = $v.getBoundingClientRect();
                let $style = window.getComputedStyle($v);
                let leftTrans = $style.getPropertyValue('left');
                let topTrans = $style.getPropertyValue('top');

                let $height = Math.floor(($clientItem.height) ? $clientItem.height: 0);
                let $width = ($clientItem.width) ? $clientItem.width: 0;

                $widthRatio = Math.floor(($v.getAttribute('hjs-width')) ? $v.getAttribute('hjs-width') : $ratio);
                $heightRatio = Math.floor(($v.getAttribute('hjs-height')) ? $v.getAttribute('hjs-height') : $ratio);
               
                if( $widthRatio > $columns){
                    $widthRatio = $columns;
                }
               
                // set width
                var $itWidth = Math.floor( ($itemWidth * $widthRatio) + ($gutter * ($widthRatio - 1)) );
                $Itemheight = Math.floor($itemWidth * $heightRatio)  + 'px';
                $top = Math.floor( ($itemWidth * $heightRatio) + $gutter);  
                // set height
                if($type == 'masonry'){
                    $top = Number($top / $heightRatio);
                }
               
                if($v.classList.contains($targetClass) || $targetClass == '*'){
                    $maxHeight.push($top);
                }

                let $heightItem = $v.querySelector($itemHeightSelector);
                if( !$heightItem ){
                    $heightItem = $v;
                }
                $heightItem.style.height = $Itemheight;
                
                $v.style.width =  $itWidth + 'px';
                $v.style.position = 'absolute';
                $v.setAttribute('hjs-index-item', $totalItem);
                // set another style
                let $display = $style.getPropertyValue('display');

                if( $target1 != -1 ){
                    if($v.classList.contains($targetClass) || $targetClass == '*'){
                   
                        let leftTrans2 = $itemLeft + 'px';
                        let topTrans2 = $stepTop + 'px';
                       
                        if(leftTrans == leftTrans2 && $targetClass == '*'){
                            leftTrans = '0px';
                        } else{
                            leftTrans = Number(parseInt(leftTrans2) - parseInt(leftTrans)) + 'px';
                        }
                        
                        if(topTrans == topTrans2 && $targetClass == '*'){
                            topTrans = '0px';
                        } else{
                            topTrans = Number(parseInt(topTrans2) - parseInt(topTrans)) + 'px';
                        }
                        if($display == 'none'){
                            $v.style.opacity = 1;
                            $v.style.display = '';
                            $v.style.transform = 'translate3d('+leftTrans+', '+topTrans+', 0px)';
                        }else{
                            $v.style.transform = 'translate3d('+leftTrans+', '+topTrans+', 0px)';
                        }
                        $v.style.transitionProperty = 'opacity, transform';
                        $v.style.transitionDuration = '0.4s';
                        $v.style.transitionDelay = '0ms';
                    }else{
                        $v.style.opacity = 0;
                        $v.style.transform = 'scale(0.001)';
                        $v.style.transitionProperty = 'opacity, transform';
                        $v.style.transitionDuration = '0.4s';
                        $v.style.transitionDelay = '0ms';
                    }
                   
                }
               
                // end another style
                if( $target1 == -1){
                    $v.style.top = $stepTop + 'px';
                    $v.style.left = $itemLeft + 'px';
                }else{
                  clearTimeout($timeOut);
                  var $timeOut = setTimeout(function($v, $stepTop, $itemLeft) {
                        $v.style.top = $stepTop + 'px';
                        $v.style.left = $itemLeft + 'px';
                        if($v.classList.contains($targetClass) || $targetClass == '*'){
                            $v.style.transform = '';
                            $v.style.opacity = '';
                        } else {
                            $v.style.display = 'none';
                            $v.style.opacity = 0;
                            $v.style.transform = '';
                        }
                        $v.style.transitionProperty = '';
                        $v.style.transitionDuration = '';
                        $v.style.transitionDelay = '';
                    }, 500, $v, $stepTop, $itemLeft);
                }

               
                if($v.classList.contains($targetClass) || $targetClass == '*'){
                    $start += $widthRatio;
                   
                    let $avg = Math.floor($start % $columns);
                   
                    let $e = ($targetList[$list+1]) ? $targetList[$list+1] : '';
                     
                    if($avg == 0){
                        $stepTop += NextMixinJs.instance().maxValue($maxHeight);
                        $itemLeft = 0;
                        $start = 0;
                        $maxHeight = [];
                        
                    } else{
                        $itemLeft += $itWidth + $gutter;

                        if( $e ){
                            let $next = Math.floor(($e.getAttribute('hjs-width')) ? $e.getAttribute('hjs-width') : $ratio);
                            let $nextTotal = Number($start + $next);
                           
                            if( $nextTotal > $columns){
                                $stepTop += NextMixinJs.instance().maxValue($maxHeight);
                                $itemLeft = 0;
                                $start = 0;
                                $maxHeight = [];
                            }
                            
                        } else {
                            $stepTop += NextMixinJs.instance().maxValue($maxHeight);
                            $start = 0;
                            $maxHeight = [];
                        }

                    }
                    
                    $totalHeight = Math.floor($stepTop);
                    $list++;
                }

                $totalItem++;
            });
        }
        */


        $itemCon.style.height = '100%';
        $itemCon.style.minHeight = Math.floor($totalHeight)  + 'px';
    }
   
    margeMap($map, $objItem) {
        var $new = [];
        $objItem.forEach(function( $v, $k){
            //console.log($v);
            if( $new.indexOf($v) > -1){
                $new[$v].push($k);
            }else{
                $new[$v] = [ $k ];
            }
            
        });
        return $new;
    };

    maxValue(arr) {
        var len = arr.length, max = -1;
        while (len--) {
          if (arr[len] > max) {
            max = arr[len];
          }
        }
        return max;
    };

    nextElementEl($v){
        let $e = ($v.nextElementSibling) ? $v.nextElementSibling : '';
        if( $e ){
            let $style = window.getComputedStyle($e);
            let $opacity = $style.getPropertyValue('opacity');
            
            if($opacity == '0'){
                return NextMixinJs.instance().nextElementEl($e);
            }
            return $e;
        }
        return $v;
    }
    // instance of class
    static instance() {
        return new NextMixinJs();
    }
}


var $hJsMix = {
    load: NextMixinJs.instance().loadMixin
};

// calling
//$hJsMix.load('.dl_addons_grid_wrapper');
