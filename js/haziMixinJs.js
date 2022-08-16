"use strict";
/**
* Name: HaziJs Mixin
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
        if( Object.entries($default) ){ 
            for (const [$k, $v] of Object.entries($default)) {
                $neSettings[$k] = ($settings[$k]) ? $settings[$k] : $default[$k];
            }
        }
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
       
        let $items = $itemCon.querySelectorAll($itemSelector);

        if($target == '*'){
            var $targetList = $items;
        }else{
            var $targetList = $itemCon.querySelectorAll($itemSelector+$target);
        }
        // new grid css end

        if($items){
            let $widthRatio = $ratio;
            let $heightRatio = $ratio;
            let $itemheight = 'auto';
            let $totalItem = 1;

            let $totalItemsWidth = 0;
            let $totalItemsheight = 0;
            let $colStart = 1;
            let $rowStart = 1;
            $items.forEach(function($v, $k){
                var $itemStyle = 'position: relative;';
                $widthRatio = Math.floor(($v.getAttribute('hjs-width')) ? $v.getAttribute('hjs-width') : $ratio);
                $heightRatio = Math.floor(($v.getAttribute('hjs-height')) ? $v.getAttribute('hjs-height') : $ratio);

                var $itWidth = Math.floor( ($itemWidth * $widthRatio) + ($gutter * ($widthRatio - 1)) );
                $itemheight = Math.floor( ($itemWidth * $heightRatio) + ($gutter * ($heightRatio - 1)) );
                
                if( $widthRatio > $columns){
                    $widthRatio = $columns;
                }
                
                console.log('SL:', $totalItem);
                console.log('ROW:', $rowStart);
                console.log('COl:', $colStart);
                
                if($ratio < $widthRatio){
                    var $newCOls = $colStart;
                    var $newadd = Number( $colStart + $widthRatio);
                    if($colStart > $columns){
                        $newadd = Number($newadd - $widthRatio);

                        $newCOls = Number($colStart - $widthRatio );
                        //$rowStart++;
                    }
                    $itemStyle += 'grid-row-start:'+  $rowStart +';';
                    $itemStyle += 'grid-column-start:'+Number($newCOls)+';';
                    $itemStyle += 'grid-column-end:'+  $newadd +';';
                   
                }

                if($ratio < $heightRatio){
                    $itemStyle = 'position: relative;';
                    $itemStyle += 'grid-row-start:'+$rowStart+';';
                    $itemStyle += 'grid-row-end:'+ Number( $rowStart + $heightRatio) +';';
                } 
                 
                let $heightItem = $v.querySelector($itemHeightSelector);
                if( !$heightItem ){
                    $heightItem = $v;
                }
                $heightItem.style.height = $itemheight + 'px';

                $v.setAttribute('hjs-index-item', $totalItem);
                $v.setAttribute('style', $itemStyle);
                
                if($colStart < $columns){
                    $colStart += $widthRatio;
                } else {
                    $colStart = 1;
                    $rowStart++;
                }
                
                $totalItemsWidth += $widthRatio;
                $totalItemsheight += $heightRatio;
                $totalItem++;
            });

            // new grid css start
            var $gridStyle = 'display: grid;margin: 0 auto;position: relative;';
            let $col = 0;
            var $gridColumn = [];
            var $gridRow = [];
            for( ; $col < $columns; $col++){
                $gridColumn[$col] = $itemWidth + 'px';
            }

            let $row = 0;
            let $rows = Math.ceil(( $totalItemsWidth) / $columns);
            console.log( $rows );
            for( ; $row < $rows; $row++){
                $gridRow[$row] = $itemWidth + 'px';
            }
            
            $gridStyle += 'grid-template-columns:'+ $gridColumn.join(' ') +';';
            $gridStyle += 'grid-template-rows:'+ $gridRow.join(' ') +';';
            $gridStyle += 'grid-gap:'+ $gutter +'px;';

            $itemCon.setAttribute('style', $gridStyle);

            console.log('width:', $totalItemsWidth);
            console.log('height:', $totalItemsheight);
        }
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
