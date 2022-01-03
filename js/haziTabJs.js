"use strict";
/**
* Name: HaziJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/
// hJs Tab
var $hJsTab = {

    init: function( $selector, $settings = ''){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                $v.setAttribute('hjs-tab', 'hjstab-'+ $k);
                if( $settings != ''){
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }

                
                // set Settings
                let $sett = $hJsTab.getSettings( $v );
                var $tabType = ($sett.type) ? $sett.type : 'css';
                // tab
                var $tabSelector = ($sett.tabSelector) ? $sett.tabSelector : '.hjs-tab';
                $v.querySelectorAll($tabSelector).forEach(function( $target, $key){
                    $target.setAttribute('hjs-tab-target', 'hjstab-'+ $k);
                    $target.removeEventListener('click', $hJsTab.toggleTab);
                    $target.addEventListener('click', $hJsTab.toggleTab);

                    if( !$target.getAttribute('hjs-target')){
                        $target.setAttribute('hjs-target', '.hjstab-content'+ $k + '-' +$key);
                    }
                });

                // panel
                var $panelSelector = ($sett.panelSelector) ? $sett.panelSelector : '.hjs-panel';
                $v.querySelectorAll($panelSelector).forEach(function( $panel, $key){
                    $panel.setAttribute('hjs-tab-panel', 'hjstab-'+ $k);
                    $panel.classList.add('hjstab-content'+ $k + '-'+$key);

                    if($tabType == 'css'){
                        if( !$panel.style.display ){
                            $panel.style.display = 'none';
                        }
                    }
                });
            });
        }
    },

    toggleTab: function( $e ){
        $e.preventDefault();
        let $this = this;
        let $targetTab = $this.getAttribute('hjs-tab-target');
        let $target = $this.getAttribute('hjs-target');

        let $el = document.querySelector('[hjs-tab='+$targetTab+']');
        if($el){
            $hJsTab.actionRemove($el);

            let $sett = $hJsTab.getSettings( $el );
            var $tabType = ($sett.type) ? $sett.type : 'css';

            var $tabActive = ($sett.tabActiveClass) ? $sett.tabActiveClass : 'hjs-active';
            $this.classList.add($tabActive);

            var $panelActive = ($sett.panelActiveClass) ? $sett.panelActiveClass : 'hjs-show';
            $el.querySelectorAll($target).forEach(function($v){
                
                if($tabType == 'css'){
                    $v.style.display = 'block';
                    $v.style.animationName = 'fadeIn';
                    $v.style.animationDuration = '1.25s';
                } else {
                    $v.classList.add($panelActive);
                }
            });
        }
        


    },

    actionRemove: function( $el ){
        if($el){
            let $sett = $hJsTab.getSettings( $el );
            var $tabType = ($sett.type) ? $sett.type : 'css';

            var $tabSelector = ($sett.tabSelector) ? $sett.tabSelector : '.hjs-tab';
            var $tabActive = ($sett.tabActiveClass) ? $sett.tabActiveClass : 'hjs-active';
            $el.querySelectorAll($tabSelector).forEach(function( $target){
                $target.classList.remove($tabActive);
            });

            // panel
            var $panelSelector = ($sett.panelSelector) ? $sett.panelSelector : '.hjs-panel';
            var $panelActive = ($sett.panelActiveClass) ? $sett.panelActiveClass : 'hjs-show';
            $el.querySelectorAll($panelSelector).forEach(function( $panel){
                if($tabType == 'css'){
                    $panel.style.display = 'none';
                    $panel.style.animationName = '';
                    $panel.style.animationDuration = '';
                }else{
                    $panel.classList.remove($panelActive);
                }
                
            });
        }
    },

    getSettings: function( $el ){
        let $default = {
            type: 'css', // css, class
            tabSelector : '.hjs-tab',
            tabActiveClass : 'hjs-active',
            panelSelector : '.hjs-panel',
            panelActiveClass : 'hjs-show',
        };

        let $settings = $el.getAttribute('hjs-settings');
        if( !$settings ){
            $el.setAttribute('hjs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.tabSelector = ($settings.tabSelector) ? $settings.tabSelector : $default.tabSelector;
        $neSettings.tabActiveClass = ($settings.tabActiveClass) ? $settings.tabActive : $default.tabActiveClass;
        $neSettings.panelSelector = ($settings.panelSelector) ? $settings.panelSelector : $default.panelSelector;
        $neSettings.panelActiveClass = ($settings.panelActiveClass) ? $settings.panelActiveClass : $default.panelActiveClass;
       
        return $neSettings;
    }

};

// tab calling
//$hJsTab.init('#nx-tab-style');