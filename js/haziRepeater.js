"use strict";
/**
* Library : Hazi Repeater  
* Package Name : hz-repeater
* Version : 1.0.0 
* @release Date: 01-02-2019
*
* @Author: ThemeDev
* @URL: themedev.net
*/
var $haziRepeater = {
    appendtype: 'last',
    clonetype: 'last',
    firstItemDelete: false,
    whenDelete: false,
    whenDeleteMessage: 'Are you sure you want to delete this element?',
    config: function( $el, $config = {}){

        if( 'appendtype' in $config ){
            this.appendtype = $config.appendtype;
        }
        if( 'clonetype' in $config ){
            this.clonetype = $config.clonetype;
        }
        if( 'firstItemDelete' in $config ){
            this.firstItemDelete = $config.firstItemDelete;
        }
        if( 'whenDelete' in $config ){
            this.whenDelete = $config.whenDelete;
        }
        if( 'whenDeleteMessage' in $config ){
            this.whenDeleteMessage = $config.whenDeleteMessage;
        }

        let $intail = document.querySelectorAll($el);
        if( $intail.length > 0){
            $intail.forEach( function($v, $k) {
                $v.classList.add('nx-repeater-wrap');
                $v.setAttribute('data-type', 'wrap');
                $v.setAttribute('data-id', 'repeater_wrap_' + $k);
                $haziRepeater.init( $v ) . addAction() ;
            });
        }
        return this;
    },
    init: function( $v ){
        if( !$v ){
            $v = document.querySelector( $v );
        }
       
        let $wrap = $v.querySelector("div[data-group]");
        
        if( $wrap ){

            if( !$wrap.hasAttribute('data-group-config') ){
                $wrap.setAttribute('data-group-config', $wrap.getAttribute('data-group'));
            }

            let $prefix_input = 'nxinput__';
            let $prefix_item = 'nxitem__';
            $wrap.classList.add('ui-sortable');
            $wrap.classList.add('nxrepeater-group-list');

            let $el = $wrap.children;
            if( $el.length > 0){
                let $itemno = 0;
                $el.forEach( function($v1, $k1) {
                    if( $v1.hasAttribute('data-item') ){
                        
                        var $group_format = $v1.parentElement.getAttribute('data-group');
                        var $group_status = true;

                        if( !$v1.hasAttribute('data-id') ){
                            $v1.setAttribute('id', $prefix_item  + $v.getAttribute('id') + '_' + $k1 );
                            $v1.setAttribute('data-id', $prefix_item  + $v.getAttribute('id') + '_++');
                        }
                        let $ren_it = $v1.getAttribute('data-id').replace('++', $k1);
                        $v1.setAttribute('id', $ren_it);

                        
                        // remove button 
                        let $remove = $v1.querySelector( 'div > .tabs-remove-button > button[data-delete]');
                        if( $remove ){
                            $remove.removeEventListener("click", $haziRepeater.remove_item);
                            $remove.addEventListener("click", $haziRepeater.remove_item);
                            $remove.setAttribute('data-target', $v1.getAttribute('id') );
                        }
                        // item action

                        // query tags
                        let $tags = $v1.querySelectorAll('div > .tabs-fields-action input, div > .tabs-fields-action select, div > .tabs-fields-action textarea');
                        if($tags.length > 0){
                            for( let $n = 0; $n <  $tags.length; $n++){
                                let $tag = $tags[$n];
                                
                                if( $tag.classList.contains('numInput') || $tag.classList.contains('disabled-repeater-input') || $tag.classList.contains('ncode-date-option') || $tag.classList.contains('flatpickr-monthDropdown-months') || $tag.classList.contains('select2-search__field') ){
                                    continue;
                                }
                                let $tagName = $tag.tagName.toLowerCase();

                                if( !$tag.hasAttribute('data-id') ){
                                    $tag.setAttribute('id', $prefix_input  + $v1.getAttribute('id') + '_' + $n );
                                    $tag.setAttribute('data-id', $prefix_input  + $v1.getAttribute('id') + '_++');
                                }
                                let $parent = $haziRepeater.getParentClss( $tag, 'tabs-fields-action');
                                if( $parent ){
                                    $group_status = true;
                                    $group_format = $parent.parentElement.parentElement.parentElement.getAttribute('data-group');
                                }
                                if( !$tag.hasAttribute('data-name') ){
                                    let $nameSelect = $tagName + $n;
                                    //let $nameSelect = ( $tag.getAttribute('name' ) ) ? $tag.getAttribute('name' ) : $tagName + $n;
                                    $tag.setAttribute('name',  $group_format + '[' + $itemno + '][' + $nameSelect + ']');
                                    $tag.setAttribute('data-name', $group_format + '[++][' +  $nameSelect + ']' );
                                }
  
                                let $name_d = $tag.getAttribute('data-name');
                                
                                var $ren_name = $name_d.replace('++', $itemno);
                                if( $group_status ){
                                    $ren_name = $group_format+$ren_name;
                                }
                                $tag.setAttribute('name', $ren_name);
                    
                                let $id_d = $tag.getAttribute('data-id');
                                let $ren_id = $id_d.replace('++', $itemno);
                                $tag.setAttribute('id', $ren_id);
                            }
                        }

                        //group id setup
                        let $group = $v1.querySelector('[data-group]');
                        if( $group ){
                            let $gro_dta = $group.getAttribute('data-group-config');
                            if( !$gro_dta ){
                                let $dataName = $group.getAttribute('data-name').split("__");
                                let $dataAtt = ($dataName[1]) ? $dataName[1] : $dataName[0];
                                let $setAttr = $group_format + '[++]' + '[' + $dataAtt + ']'
                                $group.setAttribute('data-group-config', $setAttr);
                                $gro_dta = $group.getAttribute('data-group-config');
                            }
                            let $grou_id = $gro_dta.replace('++', $k1);
                            $group.setAttribute('data-group', $grou_id); 

                            $haziRepeater.init( $group.parentElement ) . addAction() ;
                        }

                        $itemno++;
                    }
                    
                });
            }
            new NxLoad_Default( $wrap );
        }
        
        return this;
    },
    addAction: function(){ 
        document.querySelectorAll('.nx-repeater-wrap > button[data-create]').forEach( $v => {
            $v.removeEventListener("click", $haziRepeater.add_item);
            $v.addEventListener("click", $haziRepeater.add_item);
        });
        return this;
    },
    add_item: function( e ){
        e.preventDefault();
        let $this = this;
        let $parent = $this.parentElement.children[0];
        if( !$parent){
            console.log( "Sorry!! invalid append element");
        }

        let $cloneTemp = $parent.lastElementChild;
        if( $haziRepeater.clonetype === 'first-item'){
            $cloneTemp = $parent.firstElementChild;
        }
        var $cln = $cloneTemp.cloneNode(true);
        if( $haziRepeater.appendtype === 'last'){
            $parent.appendChild($cln);
        } else {
            $parent.insertBefore($cln, $parent.childNodes[0]); 
        }

        $haziRepeater.init( $this.parentElement ) . addAction() ;
    },
    remove_item: function( e ){
        e.preventDefault();

        if( $haziRepeater.whenDelete ){
            if(!confirm( $haziRepeater.whenDeleteMessage )) {
                return false;
            }
        }
        let $target_item = this.getAttribute('data-target');
        if( !$target_item ){
            return;
        }
        let $item_r = document.querySelector( '#'+$target_item);
        if($item_r){
            let $parent = $item_r.parentElement.parentElement;
            $item_r.remove();
            
            if(!$parent){
                return;
            }
            $haziRepeater.init( $parent ) . addAction() ;
        }
    },
    drag_index: function( e ){
        e.preventDefault();
        let $this = this;
        $haziRepeater.init( $this ) . addAction() ;
    },
    
    getParentClss: function( $el, $f ){
        if( $el.classList.contains( $f ) ){
            return $el;
        }
        if( $el.parentElement ){
            return $haziRepeater.getParentClss( $el.parentElement, $f);
        }
        return false;
    }
};


