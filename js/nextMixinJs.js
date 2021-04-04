"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/
class NextMixinJs{
    
    

    loadMixin( $selector = ''){
        let $el =  document.querySelectorAll($selector);
        if( !$el ){
            return;
        }

        $el.forEach(function($v, $k){
            $v.classList.add('njs-mixin-wrapper');
            $v.setAttribute('njs-mixin', 'nextmix-'+$k); 
            $v.setAttribute('njs-display', 'desktop'); 

            NextMixinJs.instance().getSettings($v);

            // content settings
            NextMixinJs.instance().getContents($v);

            //get filter
            NextMixinJs.instance().getFilter($v);
            
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

    }

    desktopMedia( $x ){
        if($x.matches){
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'desktop');
            });
        }
        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }
    tablateMedia( $x ){
        if($x.matches){
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'tablate');
            });
        } else {
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'desktop');
            });
        }

        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }

    mobileMedia( $x){
        if($x.matches){
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'mobile');
            });
        } 
        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
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
            filter: '.njs-filter',
            filterItem: '.njs-filter-item',
            filterAction: 'click',
            itemContainer: '.njs-item-container',
            item: '.njs-item',
            itemHeight: '.njs-item-height',
        };

        let $settings = $el.getAttribute('njs-settings');
        if( !$settings ){
            $el.setAttribute('njs-settings', JSON.stringify($default));
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
                let $elIndex = $el.getAttribute('njs-mixin');
                $filEl.forEach(function($v, $k){
                   
                   $v.setAttribute('njs-filter', $elIndex);

                   let $item = $v.querySelectorAll($filterItem);
                   if($item.length == 0){
                      $item = $v.querySelectorAll('*');
                   }

                   let $dataFilter = '*';

                   $item.forEach(function($v1){

                      $v1.removeEventListener($filterAction, NextMixinJs.instance().toggleFilter);
                      $v1.addEventListener($filterAction, NextMixinJs.instance().toggleFilter);
                      $v1.setAttribute('njs-filter-content', $elIndex);

                      if( $v1.classList.contains('njs-current') ){
                        if( $v1.getAttribute('njs-filter-action') ){
                            $dataFilter = $v1.getAttribute('njs-filter-action');
                        }

                        NextMixinJs.instance().openFilter($el, $dataFilter);
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
        if( $this.getAttribute('njs-filter-action') ){
            $dataFilter = $this.getAttribute('njs-filter-action');
        }
        
        let $target = $this.getAttribute('njs-filter-content');

        let $el = document.querySelector('[njs-mixin="'+$target+'"]');
        if($el){
            NextMixinJs.instance().openFilter($el, $dataFilter);
        }
       return;
    }

    openFilter( $el, $target){
        let $settings = NextMixinJs.instance().getSettings($el);
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $gutter = ($settings.gutter) ? $settings.gutter : 0;
        let $itemConSelector = ($settings.itemContainer) ? $settings.itemContainer : '.njs-item-container';
        let $itemSelector = ($settings.item) ? $settings.item : '.njs-item';
        
        let $itemCon = $el.querySelector($itemConSelector);
        if( !$itemCon ){
            return;
        }
        var $totalHeight = 0;
        let $items = $itemCon.querySelectorAll($itemSelector);
        if($items){
            $items.forEach(function($v, $k){
                if($target != '*'){

                    let $clientItem = $v.getBoundingClientRect();
                    let $height = ($clientItem.height) ? $clientItem.height: 0;
                    let $width = ($clientItem.width) ? $clientItem.width: 0;



                    $totalHeight += Math.floor($height + $gutter);
                } 
            });
        }

        if($totalHeight != 0 && $target != '*'){
            //$itemCon.style.height = ($totalHeight / $columns)  + 'px';
        }
    
        //console.log($items);
    }

    getContents( $el ){
        let $settings = NextMixinJs.instance().getSettings($el);
       
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $type = ($settings.type) ? $settings.type : 'grid';
        let $gutter = ($settings.gutter) ? $settings.gutter : 0;
        

        let $client = $el.getBoundingClientRect();
        console.log($client);

        var $tWidth = $client.width;
        var $tHeight = $client.height;

        var $responMode = $el.getAttribute('njs-display');
        if($responMode == "tablate"){
            $columns = ($settings.columnsTablet) ? $settings.columnsTablet : 2;
        }
        else if($responMode == "mobile"){
            $columns = ($settings.columnsMobile) ? $settings.columnsMobile : 1;
        }
        let $gutterCOl = Math.floor($gutter * $columns);
        let $itemWidth = Math.floor(($tWidth - $gutterCOl) / $columns);
        
        let $itemConSelector = ($settings.itemContainer) ? $settings.itemContainer : '.njs-item-container';
        let $itemSelector = ($settings.item) ? $settings.item : '.njs-item';
        let $itemHeightSelector = ($settings.itemHeight) ? $settings.itemHeight : '.njs-item-height';
        
        let $itemCon = $el.querySelector($itemConSelector);
        if( !$itemCon ){
            return;
        }
        $itemCon.style.position = 'relative';

        var $totalHeight = 0;

        let $items = $itemCon.querySelectorAll($itemSelector);
        if($items){
            let $top = 0;
            let $left = 0;
            let $stepLeft = 0;
            let $stepTop = 0;
           
            let $totalItem = Number($items.length);
            let $Itemheight = 'auto';
            $items.forEach(function($v, $k){
                
                if($k % $columns != 0){
                    $stepLeft += 1;
                } else {
                    $stepLeft = 0;
                }

                if( ($k % $columns) == 0 && $k != 0){
                    $stepTop += 1;
                }
                let $clientItem = $v.getBoundingClientRect();

                let $height = Math.floor(($clientItem.height) ? $clientItem.height: 0);
                let $width = ($clientItem.width) ? $clientItem.width: 0;
                if($type == 'grid'){
                   $Itemheight = Math.floor($itemWidth)  + 'px';
                   $top = Math.floor(($itemWidth + $gutter) *  $stepTop);
                   
                   $totalHeight += Math.floor($itemWidth + $gutter);
                } else {
                   $top = Math.floor(($height + $gutter) *  $stepTop);

                   $totalHeight += Math.floor($height + $gutter);
                }
                
                // set height
                let $heightItem = $v.querySelector($itemHeightSelector);
                if( !$heightItem ){
                    $heightItem = $v;
                }
                $heightItem.style.height = $Itemheight;
               
                
                $left = parseInt( ($itemWidth + $gutter) * Number($stepLeft));
               
                console.log($itemWidth);
                $v.style.width = $itemWidth + 'px';
                $v.style.position = 'absolute';
                $v.style.top = $top + 'px';
                $v.style.left = $left + 'px';

               
                
            });
        }

        $itemCon.style.height = ($totalHeight / $columns)  + 'px';

    }

    // instance of class
    static instance() {
        return new NextMixinJs();
    }
}


var nMixJs = {
    load: NextMixinJs.instance().loadMixin
};
