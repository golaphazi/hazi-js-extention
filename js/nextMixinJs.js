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
            $v.setAttribute('njs-mixin', 'nextmix-'+$k); 
            
            // content settings
            NextMixinJs.instance().getContents($v);

            // tablate mode
            var tablet = window.matchMedia("(max-width: 1024px) and (min-width: 768px)");
            NextMixinJs.instance().tablateMedia(tablet);
            tablet.addListener(NextMixinJs.instance().tablateMedia);

            // mobile 
            var mobile = window.matchMedia("(max-width: 767px)");
            NextMixinJs.instance().mobileMedia(mobile);
            mobile.addListener( NextMixinJs.instance().mobileMedia);

            //get filter
            NextMixinJs.instance().getFilter($v);

            
        });
        
    }
    tablateMedia( $x ){
        if($x.matches){
            document.querySelectorAll('[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'tablate');
            });
        } else {
            document.querySelectorAll('[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'desktop');
            });
        }
    }

    mobileMedia( $x){
        if($x.matches){
            document.querySelectorAll('[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'mobile');
            });
        } else {
            document.querySelectorAll('[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'desktop');
            });
        }
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
        var $settings = NextMixinJs.instance().getSettings($el);
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
        console.log($target);
    }

    getContents( $el ){
        var $settings = NextMixinJs.instance().getSettings($el);
        console.log($settings);
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $type = ($settings.type) ? $settings.type : 'grid';
        let $columnsMobile = ($settings.columnsMobile) ? $settings.columnsMobile : 1;
        let $columnsTablet = ($settings.columnsTablet) ? $settings.columnsTablet : 2;

        let $client = $el.getBoundingClientRect();
        console.log($client);

        var $tWidth = $client.width;
        var $tHeight = $client.height;
        console.log($tWidth);
        
    }

    // instance of class
    static instance() {
        return new NextMixinJs();
    }
}


var nMixJs = {
    load: NextMixinJs.instance().loadMixin
};
