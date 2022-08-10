"use strict";
/**
* Name: HaziJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/
var $hJsEditorCont = {
    init: function(){

    },
    createDropDown : function( $el, $k, $key, $v ){
        var $heading = document.createElement('div');
        $heading.setAttribute('class', 'hjs-editor-control hjs-editor-' + $key);
        $heading.setAttribute('title', ($v.title) ?? '' );

        var $button = document.createElement('button');
        $button.setAttribute('class', 'hjs-button hjs-button-dropdown hjs-button-'+$key+' hjsicon hjsicon-ctrl');
        $button.setAttribute('type', 'button');
        
        var $icon = ($v.icon) ?? '';
        var $html = ($v.html) ?? '';
        if( $icon != ''){
            var $iconEl = document.createElement('i');
            $iconEl.setAttribute('class', $icon);
            $button.appendChild($iconEl);
        } else if( $html != ''){
            $button.setAttribute('hjs-default', $html);
            $button.innerHTML = $html;
        }
        $heading.appendChild($button);

        var $dropdown = document.createElement('div');
        $dropdown.setAttribute('class', 'hjs-popup hjs-popup-dropdown hjs-button-'+$key);
        var $ul = document.createElement('ul');
        $ul.setAttribute('class', 'hjs-list');

        var $typeEl = ($v.type) ?? 'button';
        var $data = ($v.data) ?? false;
        var $act = ($v.action) ?? false;
        var $attr = ($v.attr) ?? { type: 'button'};

        if( typeof $data === 'object' && $data !== null ){
            for (const [$kat, $vat] of Object.entries($data)) {
                var $li = document.createElement('li');

                $typeEl = ($vat.type) ?? $typeEl;
                var $buttonEl = document.createElement($typeEl);
                var $title;
                
                if( typeof $vat === 'object' && $vat !== null ){
                    $attr = ($vat.attr) ?? $attr;
                    $act = ($vat.action) ?? $act;
                    $title = ($vat.title) ?? '';
                    $key = $kat;
                    var $iconB = ($vat.icon) ?? '';
                    var $htmlV = ($vat.html) ?? '';
                    if( $iconB != ''){
                        $attr.class = ' ' + $iconB;
                    } else{
                        $buttonEl.innerHTML = $htmlV;
                    }
                    if( $key == 'extlink' || $key == 'uploadfile') {
                        $buttonEl.innerHTML += $title;
                        $attr.class += ' hjs-no-pointer';
                    } 
                    if( $key == 'uploadfile' ){
                        var $files = document.createElement('input');
                        $files.setAttribute('type', 'file');
                        $files.setAttribute('id', 'hjs-file-hidden-' + $k);
                        $files.setAttribute('class', 'hjs-file-hidden');
                        $files.setAttribute('hjs-control-id', $k );
                        $files.setAttribute('multiple', '' );
                        $files.setAttribute('accept','image/png, image/jpeg, image/gif' );

                        $li.appendChild($files);
                    }
                } else {
                    $title = $vat;
                    $buttonEl.setAttribute('hjs-value', $kat);
                    if( $key == 'heading' ){
                        $buttonEl.innerHTML = '<' + $kat + '>' + $vat + '</' + $kat + '>';
                        $attr.class += ' hjs-no-pointer';
                    } else if( $key == 'fontfamily' ) {
                        $buttonEl.innerHTML = '<span style="font-family:'+$vat+';">' + $vat + '</span>';
                        $buttonEl.setAttribute('hjs-value', $vat);
                        $attr.class += ' hjs-no-pointer';
                    }else if( $key == 'fontcolor' || $key == 'highlight') {
                        $buttonEl.style.backgroundColor = $kat;
                        $attr.class += ' hjs-no-pointer';
                    } else if( $key == 'fontsize' ) {
                        $buttonEl.innerHTML = $vat;
                        $attr.class += ' hjs-no-pointer';
                    } else {
                        $buttonEl.innerHTML = $vat;
                    }
                    
                }

                if( typeof $attr === 'object' && $attr !== null ){
                    for (const [$atk, $atv] of Object.entries($attr)) {
                        $buttonEl.setAttribute($atk, $atv );
                    }
                }
                if( typeof $act === 'object' && $act !== null ){
                    for (const [$ka, $va] of Object.entries($act)) {
                        if( $ka == ''){
                            continue;
                        }
                        
                        var fn = $va;
                        if( typeof fn === "function"){
                            $buttonEl.addEventListener($ka, fn);
                        }
                    }
                }

                $buttonEl.classList.add('hjs-button');
                $buttonEl.setAttribute('title', $title);
                $buttonEl.setAttribute('id', 'hjs-'+$k + '-' + $key );
                $buttonEl.setAttribute('hjs-control-id', $k );
                $buttonEl.setAttribute('hjs-keys', $key );

                $li.appendChild($buttonEl);

                $ul.appendChild($li);
            }
        }

        $dropdown.appendChild($ul);

        $heading.appendChild($dropdown);
        
        $el.appendChild($heading);

        $button.addEventListener('click', function( $e ){
            $e.preventDefault();
            var $this = this;

            var $find = $this.parentElement.querySelector('.hjs-popup');
            $el.querySelectorAll('.hjs-popup').forEach( $v => {
                if( $v != $find){
                    $v.classList.remove('hjs-open');
                }
            });
            $find.classList.toggle('hjs-open');
        });
        return $ul;
    },
    createButton: function(  $el, $k, $key, $v){
        if( !$el ){
            return;
        }
        var $typeEl = ($v.type) ?? 'button';
        var $action = document.createElement($typeEl);
        $action.setAttribute('title', ($v.title) ?? '' );
        $action.setAttribute('id', 'hjs-'+$key + '-' + $k );
        $action.setAttribute('hjs-control-id', $k );
        $action.setAttribute('hjs-keys', $key );
        
        var $act = ($v.action) ?? false;
        var $icon = ($v.icon) ?? '';
        var $html = ($v.html) ?? '';
        if( $icon != ''){
            $action.setAttribute('class', $icon);
        } else if( $html != ''){
            $action.innerHTML = $html;
        }

        $action.classList.add('hjs-button');
        $action.classList.add('hjs-' + $key);

        
        if( typeof $act === 'object' && $act !== null ){
            for (const [$ka, $va] of Object.entries($act)) {
                if( $ka == ''){
                    continue;
                }
                
                var fn = $va;
                if( typeof fn === "function"){
                    $action.addEventListener($ka, fn);
                }
            }
        }

        var $attr = ($v.attr) ?? { type: 'button'};
        if( typeof $attr === 'object' && $attr !== null ){
            for (const [$kat, $vat] of Object.entries($attr)) {
                $action.setAttribute($kat, $vat );
            }
        }
        
        $el.appendChild($action);
        return $action;
    },
    renTitle: function( $el, $k, $type){

        if( !$el ){
            return;
        }

        var $items = $hJsEditorCont.getType( $type );
        if($items){

            if( Object.entries($items) ){
                for (const [$k1, $v] of Object.entries($items)) {

                    var $data = ($v.data) ?? false;
                    if( $data ){
                        $hJsEditorCont.createDropDown($el, $k, $k1, $v);
                    } else {
                        $hJsEditorCont.createButton($el, $k, $k1, $v);
                    }
                    
                }
                if($type != 'rollback'){
                    var $seperator = document.createElement('span');
                    $seperator.classList.add('hjs-toolbar__separator');
    
                    $el.appendChild($seperator);
                }
                
            }
            
        }
    },
    getType: function( t ){
       
        var $types = {
            'title' : {
                'heading' : {'attr' : { class: 'hjs-heading'}, 'title' : 'Heading', 'icon' : 'hjsicon hjsicon-sort-alpha-asc', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.headingAction },
                    'data' : $hJsEditor.getFormatFont()
                },
                'fontfamily' : {'attr' : { class: 'hjs-fontfamily'}, 'title' : 'Font Family', 'icon' : 'hjsicon hjsicon-font', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.fontfamilyAction },
                    'data' : $hJsEditor.getFontFamily()
                },
                'fontsize' : {'attr' : { class: 'hjs-fontsize'}, 'title' : 'Font Size', 'icon' : 'hjsicon hjsicon-font-size', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.increaseAction },
                    'data' : $hJsEditor.getFontSize()
                },
                'fontcolor' : {'attr' : { class: 'hjs-fontcolor'}, 'title' : 'Font Color', 'icon' : 'hjsicon hjsicon-text-color', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.fontcolorAction },
                    'data' : $hJsEditor.getFontColor()
                },
                'highlight' : {'attr' : { class: 'hjs-fontcolor'}, 'title' : 'Highlight Color', 'icon' : 'hjsicon hjsicon-text-color', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.highlightAction },
                    'data' : $hJsEditor.getFontColor()
                },
                
            },
            'normal' : {
                'paragraph' : {'title' : 'Paragraph', 'icon' : 'hjsicon hjsicon-pilcrow', 'html' : 'br', 'action' : {'click' : $hJsEditor.paragraphAction }},
                'bold' : {'title' : 'Bold', 'icon' : 'hjsicon hjsicon-bold', 'html' : '', 'action' : {'click' : $hJsEditor.boldAction }},
                'italic' : {'title' : 'Italic', 'icon' : 'hjsicon hjsicon-italic', 'html' : '', 'action' : {'click' : $hJsEditor.italicAction }},
                'underline' : {'title' : 'Underline', 'icon' : 'hjsicon hjsicon-underline', 'html' : '', 'action' : {'click' : $hJsEditor.underlineAction }},
                'strike' : {'title' : 'Strike', 'icon' : 'hjsicon hjsicon-strikethrough', 'html' : '', 'action' : {'click' : $hJsEditor.strikeAction }},
            },
            'link' : {
                'link_action' : {'title' : 'Inset / Edit Link', 'icon' : 'hjsicon hjsicon-link', 'html' : '', 'action' : {'click' : $hJsEditor.linkAction }},
                'unlink' : {'title' : 'Remove Link', 'icon' : 'hjsicon hjsicon-shuffle', 'html' : '', 'action' : {'click' : $hJsEditor.unlinkAction }},
                'upload' : {'attr' : { class: 'hjs-files'}, 'title' : 'Upload Files', 'icon' : 'hjsicon hjsicon-image', 'html' : '', 
                    'data' : {
                        'extlink' : {'title' : 'External Link', 'icon' : 'hjsicon hjsicon-attachment', 'html' : '', 'action' : {'click' : $hJsEditor.extlinkAction }},
                        'uploadfile' : {'title' : 'Upload files', 'icon' : 'hjsicon hjsicon-upload2', 'html' : '', 'action' : {'click' : $hJsEditor.uploadfileAction }},
                    }
                },
                'code' : {'title' : 'Inset HTML', 'icon' : 'hjsicon hjsicon-embed2', 'html' : '', 'action' : {'click' : $hJsEditor.codeAction }},
                'table' : {'attr' : { class: 'hjs-table'}, 'title' : 'Insert Table', 'icon' : 'hjsicon hjsicon-table2', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.tableInsertAction },
                    'data' : $hJsEditor.getTableCell()
                },
            },
            'align' : {
                'alignment' : {'attr' : { class: 'hjs-align'}, 'title' : 'Align', 'icon' : 'hjsicon hjsicon-paragraph-left', 'html' : '', 
                    'data' : {
                        'left' : {'title' : 'Left Align', 'icon' : 'hjsicon hjsicon-paragraph-left', 'html' : '', 'action' : {'click' : $hJsEditor.leftAction }},
                        'center' : {'title' : 'Center Align', 'icon' : 'hjsicon hjsicon-paragraph-center', 'html' : '', 'action' : {'click' : $hJsEditor.centerAction }},
                        'right' : {'title' : 'Right Align', 'icon' : 'hjsicon hjsicon-paragraph-right', 'html' : '', 'action' : {'click' : $hJsEditor.rightAction }},
                        'justify' : {'title' : 'Justify Align', 'icon' : 'hjsicon hjsicon-paragraph-justify', 'html' : '', 'action' : {'click' : $hJsEditor.justifyAction }},
                    }
                },
                
            },
            'order' : {
                'order_list' : {'attr' : { class: 'hjs-align'}, 'title' : 'Order', 'icon' : 'hjsicon hjsicon-list-numbered', 'html' : '', 
                    'data' : {
                        'ordered' : {'title' : 'Number List', 'icon' : 'hjsicon hjsicon-list-numbered', 'html' : '', 'action' : {'click' : $hJsEditor.orderedAction }},
                        'unordered' : {'title' : 'Bulleted List', 'icon' : 'hjsicon hjsicon-list2', 'html' : '', 'action' : {'click' : $hJsEditor.unorderedAction }},
                    }
                }, 
            },

            'text_spacing' : {
                'spacing' : {'title' : 'Spacing', 'icon' : 'hjsicon hjsicon-indent-increase', 'html' : '', 'action' : {'click' : $hJsEditor.spacingAction }},
            },

            'copy_cut' : {
                'copy' : {'title' : 'Copy', 'icon' : 'hjsicon hjsicon-copy', 'html' : '', 'action' : {'click' : $hJsEditor.copyAction }},
                'cut' : {'title' : 'Cut', 'icon' : 'hjsicon hjsicon-scissors', 'html' : '', 'action' : {'click' : $hJsEditor.cutAction }},
                'paste' : {'title' : 'Paste', 'icon' : 'hjsicon hjsicon-paste', 'html' : '', 'action' : {'click' : $hJsEditor.pasteAction }},
                'delete' : {'title' : 'Delete', 'icon' : 'hjsicon hjsicon-bin', 'html' : '', 'action' : {'click' : $hJsEditor.deleteAction }},
            },
            
            'math' : {
                'sup' : {'title' : 'Sup', 'icon' : 'hjsicon hjsicon-superscript2', 'html' : '', 'action' : {'click' : $hJsEditor.supAction }},
                'sub' : {'title' : 'Sub', 'icon' : 'hjsicon hjsicon-subscript2', 'html' : '', 'action' : {'click' : $hJsEditor.subAction }},
            },
            'rollback' : {
                'undo' : {'title' : 'Undo', 'icon' : 'hjsicon hjsicon-undo', 'html' : '', 'action' : {'click' : $hJsEditor.undoAction }},
                'redo' : {'title' : 'Redo', 'icon' : 'hjsicon hjsicon-redo', 'html' : '', 'action' : {'click' : $hJsEditor.redoAction }},
            },
            

        };
        return ($types[t]) ?? false;
    },
    setClickPopupData: function( $el ){
        if( !$el){
            return;
        }
        $el.querySelectorAll('.hjs-popup').forEach( $v => {
            $v.classList.remove('hjs-open');
        });
    },

    removePopupModal: function( $el ){
        if( !$el){
            return;
        }
        $el.querySelectorAll('.hjs-editor-overpopup').forEach( $v => {
            $v.remove();
        });
    }
};

var $hJsEditor = {

    init: function(  $selector, $settings = '', $control = ''){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                $v.setAttribute('style', 'display: none;');
                $v.setAttribute('hjs-editor', 'hjseditor-'+ $k);
                $v.classList.add('hjseditor-'+ $k);

                if( $settings != ''){
                    $v.setAttribute('hjs-settings', JSON.stringify($settings)); 
                }
                // set Settings
                let $sett = $hJsEditor.getSettings( $v );
                var $type = ($sett.type) ? $sett.type : 'basic';
                if( $control != ''){
                    $v.setAttribute('hjs-' + $type, JSON.stringify($control)); 
                }
              
                // parent
                var $parentEl = $v.parentElement;
                var $appendEl = $parentEl.querySelector('.hjseditor-'+ $k);

                var $mode = ($sett.displayMode) ? $sett.displayMode : 'white';
                var $panelClass = ($sett.panelClass) ? $sett.panelClass : 'hjs-editor-panel';
                var $new = document.createElement('div');
                $new.classList.add($panelClass);
                $new.classList.add('hjseditor-panel-'+ $k);
                $new.classList.add('hjseditor-mode-'+ $mode);
                $new.setAttribute('hjs-panel', 'hjseditor-'+ $k);
                
                var $controls = document.createElement('div');
                $controls.classList.add('hjseditor-panel-controls');

                // render control
                let $basic = ['basic', 'advance'];
                if( $basic.includes($type)){
                    $hJsEditorCont.renTitle($controls, $k, 'title');
                }
                
                
                let $normal = ['normal', 'math', 'advance'];
                if( $normal.includes($type)){
                    $hJsEditorCont.renTitle($controls, $k, 'normal');
                    $hJsEditorCont.renTitle($controls, $k, 'align');
                    $hJsEditorCont.renTitle($controls, $k, 'order');
                }

                let $advance = ['advance', 'math'];
                if( $advance.includes($type)){
                    $hJsEditorCont.renTitle($controls, $k, 'text_spacing');
                    $hJsEditorCont.renTitle($controls, $k, 'link');
                    $hJsEditorCont.renTitle($controls, $k, 'copy_cut');
                }

                let $math = ['math'];
                if( $math.includes($type)){
                    $hJsEditorCont.renTitle($controls, $k, 'math');
                }

                $hJsEditorCont.renTitle($controls, $k, 'rollback');

                $new.appendChild($controls);
                
                var $editorPanel = document.createElement('div');
                $editorPanel.classList.add('hjseditor-panel-editor');

                var $editorMode = document.createElement('iframe');
                $editorMode.classList.add('hjseditor-iframe-editor');
                $editorMode.setAttribute('id', 'hjseditor-mode-' + $k);
                $editorMode.setAttribute('name', 'hjseditor-mode-' + $k);
                $editorMode.setAttribute('frameborder', 0);
                
                $editorMode.setAttribute('style', 'height: 100%; width: 100%; position: relative;');
                $editorPanel.appendChild($editorMode);

                window.addEventListener("load", function( $e ){
                    $e.preventDefault();
                    var $editor = window.frames['hjseditor-mode-' + $k].document;
                    if( $editor){
                        $editor.body.innerHTML = $v.value;
                        $hJsEditor.setRezise('img', $k);
                        $editor.designMode = "on";
                        $editor.execCommand("defaultParagraphSeparator", false, "p");
                        $editor.body.setAttribute('hjs-control-id', $k);
                        $editor.addEventListener('keyup', $hJsEditor.editorKeyup);
                    }
                    
                });

                $new.appendChild($editorPanel);
                
                $parentEl.insertBefore($new, $appendEl);

                $new.querySelectorAll('.hjseditor-panel-controls > [title]').forEach( $vt => {
                    if( !$vt.querySelector('.hjs-tooltip') ){
                        var $tooltip = document.createElement('span');
                        $tooltip.classList.add('hjs-tooltip');
                        $tooltip.innerText = $vt.getAttribute('title');
                        $vt.appendChild($tooltip);
                        $vt.setAttribute('data-title', $vt.getAttribute('title'));
                        $vt.removeAttribute('title');
                    }
                    
                });

                $hJsEditor.autoiframeHeight( $new );
            });

           
        }
    },
    getFontFamily: function(){
        return ["Times New Roman", "Consolas", "Tahoma", "Monospace", "Cursive", "Sans-Serif", "Calibri", "Arial"];
    },
    autoiframeHeight: function( $el ){
        if( !$el ){
            return;
        }
        $el.querySelectorAll('iframe').forEach( $v => {
            if( $v.contentWindow.document.body.scrollHeight > 100){
                $v.style.height = $v.contentWindow.document.body.scrollHeight + 'px';
            }
        });
    },
    getFontSize: function(){
        return {
            '1' : 'Tiny',
            '2' : 'Small',
            '3' : 'Default',
            '4' : 'Medium',
            '5' : 'Large',
            '6' : 'Big',
            '7' : 'Huge',
        };
    },

    getFontColor: function(){
        return {
            'rgb(0, 0, 0)' : 'Black',
            'rgb(77, 77, 77)' : 'Dim grey',
            'rgb(153, 153, 153)' : 'Grey',
            'rgb(230, 230, 230)' : 'Light grey',
            'rgb(255, 255, 255)' : 'White',
            'rgb(230, 76, 76)' : 'Red',
            'rgb(230, 153, 76)' : 'Orange',
            'rgb(230, 230, 76)' : 'Yellow',
            'rgb(153, 230, 76)' : 'Light green',
            'rgb(76, 230, 76)' : 'Green',
            'rgb(76, 230, 153)' : 'Aquamarine',
            'rgb(76, 230, 230)' : 'Turquoise',
            'rgb(76, 153, 230)' : 'Light blue',
            'rgb(76, 76, 230)' : 'Blue',
            'rgb(153, 76, 230)' : 'Purple',
        };
    },
    getTableCell: function(){
        return {
            '1-1' : '1:1',
            '1-2' : '1:2',
            '1-3' : '1:3',
            '1-4' : '1:4',
            '1-5' : '1:5',
            '2-1' : '2:1',
            '2-2' : '2:2',
            '2-3' : '2:3',
            '2-4' : '2:4',
            '2-5' : '2:5',
            '3-1' : '3:1',
            '3-2' : '3:2',
            '3-3' : '3:3',
            '3-4' : '3:4',
            '3-5' : '3:5',
            '4-1' : '4:1',
            '4-2' : '4:2',
            '4-3' : '4:3',
            '4-4' : '4:4',
            '4-5' : '4:5',
            '5-1' : '5:1',
            '5-2' : '5:2',
            '5-3' : '5:3',
            '5-4' : '5:4',
            '5-5' : '5:5'
        };
    },

    getFormatFont: function(){
        return {
            'p' : 'Paragraph',
            'h1' : 'Heading 1',
            'h2' : 'Heading 2',
            'h3' : 'Heading 3',
            'h4' : 'Heading 4',
            'h5' : 'Heading 5',
            'h6' : 'Heading 6',
            'blockquote' : 'Blockquote',
            'pre' : 'Pre',
        };
    },
    getUnqueid : function(){
        return Math.random().toString(36).substr(2);
    },
    getSettings: function( $el ){
        let $default = {
            type: 'basic', // normal, advance, math, basic
            panelClass : 'hjs-editor-panel',
            displayMode: 'white', //// dark, white
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
    },
    setValue: function($k, $editor ){
        var $el = document.querySelector('.hjseditor-'+$k+'[hjs-editor="hjseditor-'+$k+'"]');
        if( $el ){
            $el.innerHTML =  $editor.body.innerHTML;
        }
        $hJsEditorCont.setClickPopupData( document.querySelector('.hjseditor-panel-' + $k) );

        $hJsEditor.autoiframeHeight( document.querySelector('[hjs-panel="hjseditor-'+$k+'"]') );
    },
    getValue: function($el, $name ){
        if( $el ){
            window.frames[$name].document.body.innerHTML = $el.value;
        }
    },
    editorKeyup: function( $e){
        $e.preventDefault();
        var $this = this;
        var $k = $this.body.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            
            $hJsEditor.setValue($k, $editor );
        }
    },
    paragraphAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("insertParagraph", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    boldAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Bold", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    italicAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Italic", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    linkAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.hjseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'link', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'hjs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.hjs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.hjs-popup-button-add');
            if( $addButton ){
                var $linkAddress = $popup.querySelector('.hjs-popup-get-link');
                $addButton.addEventListener('click', function( $e ){
                    $editor.execCommand("CreateLink", null, $linkAddress.value);
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.hjseditor-panel-' + $k) );
                });
            }
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.hjseditor-panel-' + $k) );

        }
    },
    unlinkAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Unlink", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    codeAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.hjseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'code', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'hjs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.hjs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.hjs-popup-button-add');
            if( $addButton ){
                var $linkAddress = $popup.querySelector('.hjs-popup-get-link');
                $addButton.addEventListener('click', function( $e ){
                    $editor.execCommand("insertHTML", null, $linkAddress.value);
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.hjseditor-panel-' + $k) );
                });
            }
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.hjseditor-panel-' + $k) );

        }
    },
    spacingAction: function( $e ){
       
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.hjseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'spacing', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'hjs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.hjs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.hjs-popup-button-add');
            if( $addButton ){
                var $lineHeight = $popup.querySelector('.hjs-line-height');
                var $letterSpacing = $popup.querySelector('.hjs-letter-spacing');
                $addButton.addEventListener('click', function( $e ){
                    var $selectNode = $editor.getSelection().focusNode;
                    if( $lineHeight.value != ''){
                        $selectNode.style.lineHeight = $lineHeight.value;
                    }
                    if( $letterSpacing.value != ''){
                        $selectNode.style.letterSpacing = $letterSpacing.value;
                    }
                    console.log( $lineHeight );
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.hjseditor-panel-' + $k) );
                });
            }
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.hjseditor-panel-' + $k) );

        }
    },
    underlineAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Underline", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    supAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Superscript", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    subAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Subscript", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    strikeAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Strikethrough", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    leftAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("JustifyLeft", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    centerAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("JustifyCenter", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    rightAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("JustifyRight", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    justifyAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("justifyFull", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    orderedAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("InsertOrderedList", false, "newOL", + Math.round(Math.random() * 1000));
            $hJsEditor.setValue($k, $editor );
        }
    },
    unorderedAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("InsertUnorderedList", false, "newOL", + Math.round(Math.random() * 1000));
            $hJsEditor.setValue($k, $editor );
        }
    },
    fontcolorAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("ForeColor", false, $e.target.getAttribute('hjs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    highlightAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("BackColor", false, $e.target.getAttribute('hjs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    tableInsertAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            let $data = $e.target.getAttribute('hjs-value');
            let $sp = $data.split('-');

            let $table = document.createElement('table');
            let $id = $hJsEditor.getUnqueid();
            $table.setAttribute('id', $id);
            $table.setAttribute('border', '0');
            $table.setAttribute('cellpadding', '0');
            $table.setAttribute('cellspacing', '0');
            $table.setAttribute('align', 'left');
            $table.setAttribute('style', 'min-width: 100%;border-collapse: collapse;');
            
            for(var i = 0; i < $sp[0]; i++){
                let $row = document.createElement('tr');
                $row.contentEditable = false;
                for(var j = 0; j < $sp[1]; j++){
                    let $col = document.createElement('td');
                    $col.innerHTML = 'td-' + j;
                    $col.contentEditable = true;
                    $row.appendChild($col);
                }
                $table.appendChild($row);
            }

            $editor.execCommand("styleWithCSS", true, null);
            
            $editor.execCommand("insertHTML", null, $table.outerHTML);
            $hJsEditor.setValue($k, $editor );
        }
    },
    fontfamilyAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("FontName", false, $e.target.getAttribute('hjs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    headingAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("formatblock", false, $e.target.getAttribute('hjs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    increaseAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("fontSize", false, $e.target.getAttribute('hjs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    undoAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("undo", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    redoAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("redo", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    copyAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("copy");
            $hJsEditor.setValue($k, $editor );
        }
    },
    cutAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("cut");
            $hJsEditor.setValue($k, $editor );
        }
    },
    pasteAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("paste");
            $hJsEditor.setValue($k, $editor );
        }
    },
    deleteAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("delete", null, false);
            $hJsEditor.setValue($k, $editor );
        }
    },
    extlinkAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.hjseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'image', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'hjs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.hjs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.hjs-popup-button-add');
            if( $addButton ){
                var $linkAddress = $popup.querySelector('.hjs-popup-get-link');
                $addButton.addEventListener('click', function( $e ){
                    $editor.execCommand("insertImage", null, $linkAddress.value);
                    $hJsEditor.setRezise('img', $k);
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.hjseditor-panel-' + $k) );
                });
            }
            $hJsEditorCont.setClickPopupData( document.querySelector('.hjseditor-panel-' + $k) );
        }
    },
    uploadfileAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('hjs-control-id');
        if( !$k ){
            return;
        }
        
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            
            var $files = document.querySelector('#hjs-file-hidden-' + $k);
            if( $files && document.createEvent ){
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, false);
                $files.dispatchEvent(evt);

                $files.addEventListener('change', function( $e){
                    $e.preventDefault();
                    
                    var files = $e.target.files, file;
                    if (files && files.length > 0) {
                        for(file of files){
                            var reader = new FileReader();
                            reader.onload = function( e ) {
                              $editor.execCommand("insertImage", null, e.target.result);
                              $hJsEditor.setRezise('img', $k);
                            };
                            reader.readAsDataURL(file);
                        }
                        $hJsEditor.setValue($k, $editor );
                    }
                });
                
            }
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.hjseditor-panel-' + $k) );
        }
    },

    createLinkBox: function( $el, $type = 'link', $k){
        if( !$el){
            return;
        }
        var $check = $el.querySelector('.hjs-editor-overpopup');
        if($check){
            $check.remove();
        }
        var $popup = document.createElement('div');
        $popup.setAttribute('class', 'hjs-editor-overpopup');

        var $label = document.createElement('label');
        $label.setAttribute('class', 'hjs-editor-overpopup-label');
        if( $type == 'image'){
            $label.innerText = ' Insert Image';
        } else if($type == 'image_re'){
            $label.innerText = ' Resize Box';
        } else if($type == 'code'){
            $label.innerText = ' Insert HTML';
        } else if($type == 'spacing'){
            $label.innerText = ' Spacing';
        } else {
            $label.innerText = ' Insert Link';
        }
        $popup.appendChild($label);

        var $con = document.createElement('div');
        $con.setAttribute('class', 'hjs-overpopup-continer');
        if( $type == 'image'){
            var $input = document.createElement('input');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-image');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'Enter url');
            $con.appendChild($input);
        } else if($type == 'image_re'){
            var $input = document.createElement('input');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-image-re hjs-img-width');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'W: 100px');
            $con.appendChild($input);
            var $input = document.createElement('input');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-image-re hjs-img-height');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'H: 100px');
            $con.appendChild($input);
        } else if($type == 'spacing'){
            var $input = document.createElement('input');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-image-re hjs-line-height');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'line height: 100px');
            $con.appendChild($input);
            var $input = document.createElement('input');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-image-re hjs-letter-spacing');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'letter spacing: 100px');
            $con.appendChild($input);
        } else if($type == 'code'){
            var $input = document.createElement('textarea');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-code');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'Enter code');
            $con.appendChild($input);
        }else {
            var $input = document.createElement('input');
            $input.setAttribute('class', 'hjs-popup-get-link hjs-popup-link-href');
            $input.setAttribute('hjs-control-id', $k);
            $input.setAttribute('placeholder', 'Enter link');
            $con.appendChild($input);
        }

        var $add = document.createElement('button');
            $add.setAttribute('type', 'button');
            $add.setAttribute('class', 'hjs-button hjs-popup-button-add hjsicon hjsicon-checkmark');
            $add.setAttribute('hjs-control-id', $k);
            $con.appendChild($add);

        var $remove = document.createElement('button');
            $remove.setAttribute('class', 'hjs-button hjs-popup-button-remove hjsicon hjsicon-cross');
            $remove.setAttribute('hjs-control-id', $k);
            $remove.addEventListener('click', function( $e ){
                $hJsEditorCont.removePopupModal( document.querySelector('.hjseditor-panel-' + $k) );
            });
            $con.appendChild($remove);

        $popup.appendChild($con);

        $el.appendChild($popup);
        return $popup;
    },
    setRezise: function( $tag, $k){
        var $editor = window.frames['hjseditor-mode-' + $k].document;
        if($editor){
            let $tags = $editor.querySelectorAll($tag);
            if( $tags.length > 0){
                $tags.forEach( $v => {
                    $v.classList.add('hjs-rezise-options');
                    $v.classList.add('hjs-rezise-' + $tag);
                    $v.setAttribute('hjs-control-id', $k);
                    $v.removeEventListener('click', $hJsEditor.resizeOption);
                    $v.addEventListener('click', $hJsEditor.resizeOption);
                });
            }
            
        }
    },
    resizeOption: function( $e ){
        $e.preventDefault();
        let $this = this;
        let $k = $this.getAttribute('hjs-control-id');
        var $el = document.querySelector('.hjseditor-panel-' + $k);
        var $popup = $hJsEditor.createLinkBox($el, 'image_re', $k);
            
        var $editor = window.frames['hjseditor-mode-' + $k].document;

        var $select = $editor.getSelection().getRangeAt(0);
        var $selectCOn = $select.extractContents();
        var $span = document.createElement("span");
        $span.setAttribute('class', 'hjs-fake-link-selection');
        $span.appendChild($selectCOn);
        $select.insertNode($span);

        var $offsetLeft = ($this.offsetLeft) ?? 0;
        var $offsetTop = ($this.offsetTop) ?? 0;
        $offsetTop += 70;
        
        $popup.style.top = $offsetTop + 'px';
        $popup.style.left = $offsetLeft  + 'px';

        var $link = $editor.querySelectorAll('span.hjs-fake-link-selection');
        if( $link.length > 0){
            $link.forEach( $v => {
                var $html = $v.innerHTML;
                var $newNode = document.createTextNode($html);
                $select.deleteContents();
                $select.insertNode($newNode);
            });
        }

        var $addButton = $popup.querySelector('.hjs-popup-button-add');
        if( $addButton ){
            var $width = $popup.querySelector('.hjs-img-width');
            var $height = $popup.querySelector('.hjs-img-height');
            $addButton.addEventListener('click', function( $e ){
                
                if( $width.value != ''){
                    $this.style.width = $width.value;
                }
                if( $height.value != ''){
                    $this.style.height = $height.value;
                }
                $hJsEditor.setValue($k, $editor );
            });
        }
    }
};

// Accrodion calling
$hJsEditor.init('.nx-editor-selector');