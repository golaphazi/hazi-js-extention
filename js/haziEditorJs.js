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
        $heading.setAttribute('class', 'njs-editor-control njs-editor-' + $key);
        $heading.setAttribute('title', ($v.title) ?? '' );

        var $button = document.createElement('button');
        $button.setAttribute('class', 'njs-button njs-button-dropdown njs-button-'+$key+' njsicon njsicon-ctrl');
        $button.setAttribute('type', 'button');
        
        var $icon = ($v.icon) ?? '';
        var $html = ($v.html) ?? '';
        if( $icon != ''){
            var $iconEl = document.createElement('i');
            $iconEl.setAttribute('class', $icon);
            $button.appendChild($iconEl);
        } else if( $html != ''){
            $button.setAttribute('njs-default', $html);
            $button.innerHTML = $html;
        }
        $heading.appendChild($button);

        var $dropdown = document.createElement('div');
        $dropdown.setAttribute('class', 'njs-popup njs-popup-dropdown njs-button-'+$key);
        var $ul = document.createElement('ul');
        $ul.setAttribute('class', 'njs-list');

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
                        $attr.class += ' njs-no-pointer';
                    } 
                    if( $key == 'uploadfile' ){
                        var $files = document.createElement('input');
                        $files.setAttribute('type', 'file');
                        $files.setAttribute('id', 'njs-file-hidden-' + $k);
                        $files.setAttribute('class', 'njs-file-hidden');
                        $files.setAttribute('njs-control-id', $k );
                        $files.setAttribute('multiple', '' );
                        $files.setAttribute('accept','image/png, image/jpeg, image/gif' );

                        $li.appendChild($files);
                    }
                } else {
                    $title = $vat;
                    $buttonEl.setAttribute('njs-value', $kat);
                    if( $key == 'heading' ){
                        $buttonEl.innerHTML = '<' + $kat + '>' + $vat + '</' + $kat + '>';
                        $attr.class += ' njs-no-pointer';
                    } else if( $key == 'fontfamily' ) {
                        $buttonEl.innerHTML = '<span style="font-family:'+$vat+';">' + $vat + '</span>';
                        $buttonEl.setAttribute('njs-value', $vat);
                        $attr.class += ' njs-no-pointer';
                    }else if( $key == 'fontcolor' || $key == 'highlight') {
                        $buttonEl.style.backgroundColor = $kat;
                        $attr.class += ' njs-no-pointer';
                    } else if( $key == 'fontsize' ) {
                        $buttonEl.innerHTML = $vat;
                        $attr.class += ' njs-no-pointer';
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

                $buttonEl.classList.add('njs-button');
                $buttonEl.setAttribute('title', $title);
                $buttonEl.setAttribute('id', 'njs-'+$k + '-' + $key );
                $buttonEl.setAttribute('njs-control-id', $k );
                $buttonEl.setAttribute('njs-keys', $key );

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

            var $find = $this.parentElement.querySelector('.njs-popup');
            $el.querySelectorAll('.njs-popup').forEach( $v => {
                if( $v != $find){
                    $v.classList.remove('njs-open');
                }
            });
            $find.classList.toggle('njs-open');
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
        $action.setAttribute('id', 'njs-'+$key + '-' + $k );
        $action.setAttribute('njs-control-id', $k );
        $action.setAttribute('njs-keys', $key );
        
        var $act = ($v.action) ?? false;
        var $icon = ($v.icon) ?? '';
        var $html = ($v.html) ?? '';
        if( $icon != ''){
            $action.setAttribute('class', $icon);
        } else if( $html != ''){
            $action.innerHTML = $html;
        }

        $action.classList.add('njs-button');
        $action.classList.add('njs-' + $key);

        
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
                    $seperator.classList.add('njs-toolbar__separator');
    
                    $el.appendChild($seperator);
                }
                
            }
            
        }
    },
    getType: function( t ){
       
        var $types = {
            'title' : {
                'heading' : {'attr' : { class: 'njs-heading'}, 'title' : 'Heading', 'icon' : 'njsicon njsicon-sort-alpha-asc', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.headingAction },
                    'data' : $hJsEditor.getFormatFont()
                },
                'fontfamily' : {'attr' : { class: 'njs-fontfamily'}, 'title' : 'Font Family', 'icon' : 'njsicon njsicon-font', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.fontfamilyAction },
                    'data' : $hJsEditor.getFontFamily()
                },
                'fontsize' : {'attr' : { class: 'njs-fontsize'}, 'title' : 'Font Size', 'icon' : 'njsicon njsicon-font-size', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.increaseAction },
                    'data' : $hJsEditor.getFontSize()
                },
                'fontcolor' : {'attr' : { class: 'njs-fontcolor'}, 'title' : 'Font Color', 'icon' : 'njsicon njsicon-text-color', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.fontcolorAction },
                    'data' : $hJsEditor.getFontColor()
                },
                'highlight' : {'attr' : { class: 'njs-fontcolor'}, 'title' : 'Highlight Color', 'icon' : 'njsicon njsicon-text-color', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.highlightAction },
                    'data' : $hJsEditor.getFontColor()
                },
                
            },
            'normal' : {
                'paragraph' : {'title' : 'Paragraph', 'icon' : 'njsicon njsicon-pilcrow', 'html' : 'br', 'action' : {'click' : $hJsEditor.paragraphAction }},
                'bold' : {'title' : 'Bold', 'icon' : 'njsicon njsicon-bold', 'html' : '', 'action' : {'click' : $hJsEditor.boldAction }},
                'italic' : {'title' : 'Italic', 'icon' : 'njsicon njsicon-italic', 'html' : '', 'action' : {'click' : $hJsEditor.italicAction }},
                'underline' : {'title' : 'Underline', 'icon' : 'njsicon njsicon-underline', 'html' : '', 'action' : {'click' : $hJsEditor.underlineAction }},
                'strike' : {'title' : 'Strike', 'icon' : 'njsicon njsicon-strikethrough', 'html' : '', 'action' : {'click' : $hJsEditor.strikeAction }},
            },
            'link' : {
                'link_action' : {'title' : 'Inset / Edit Link', 'icon' : 'njsicon njsicon-link', 'html' : '', 'action' : {'click' : $hJsEditor.linkAction }},
                'unlink' : {'title' : 'Remove Link', 'icon' : 'njsicon njsicon-shuffle', 'html' : '', 'action' : {'click' : $hJsEditor.unlinkAction }},
                'upload' : {'attr' : { class: 'njs-files'}, 'title' : 'Upload Files', 'icon' : 'njsicon njsicon-image', 'html' : '', 
                    'data' : {
                        'extlink' : {'title' : 'External Link', 'icon' : 'njsicon njsicon-attachment', 'html' : '', 'action' : {'click' : $hJsEditor.extlinkAction }},
                        'uploadfile' : {'title' : 'Upload files', 'icon' : 'njsicon njsicon-upload2', 'html' : '', 'action' : {'click' : $hJsEditor.uploadfileAction }},
                    }
                },
                'code' : {'title' : 'Inset HTML', 'icon' : 'njsicon njsicon-embed2', 'html' : '', 'action' : {'click' : $hJsEditor.codeAction }},
                'table' : {'attr' : { class: 'njs-table'}, 'title' : 'Insert Table', 'icon' : 'njsicon njsicon-table2', 'html' : 'Select once', 
                    'action' : {'click' : $hJsEditor.tableInsertAction },
                    'data' : $hJsEditor.getTableCell()
                },
            },
            'align' : {
                'alignment' : {'attr' : { class: 'njs-align'}, 'title' : 'Align', 'icon' : 'njsicon njsicon-paragraph-left', 'html' : '', 
                    'data' : {
                        'left' : {'title' : 'Left Align', 'icon' : 'njsicon njsicon-paragraph-left', 'html' : '', 'action' : {'click' : $hJsEditor.leftAction }},
                        'center' : {'title' : 'Center Align', 'icon' : 'njsicon njsicon-paragraph-center', 'html' : '', 'action' : {'click' : $hJsEditor.centerAction }},
                        'right' : {'title' : 'Right Align', 'icon' : 'njsicon njsicon-paragraph-right', 'html' : '', 'action' : {'click' : $hJsEditor.rightAction }},
                        'justify' : {'title' : 'Justify Align', 'icon' : 'njsicon njsicon-paragraph-justify', 'html' : '', 'action' : {'click' : $hJsEditor.justifyAction }},
                    }
                },
                
            },
            'order' : {
                'ordered' : {'title' : 'Number List', 'icon' : 'njsicon njsicon-list-numbered', 'html' : '', 'action' : {'click' : $hJsEditor.orderedAction }},
                'unordered' : {'title' : 'Bulleted List', 'icon' : 'njsicon njsicon-list2', 'html' : '', 'action' : {'click' : $hJsEditor.unorderedAction }},
            },

            'copy_cut' : {
                'copy' : {'title' : 'Copy', 'icon' : 'njsicon njsicon-copy', 'html' : '', 'action' : {'click' : $hJsEditor.copyAction }},
                'cut' : {'title' : 'Cut', 'icon' : 'njsicon njsicon-scissors', 'html' : '', 'action' : {'click' : $hJsEditor.cutAction }},
                'paste' : {'title' : 'Paste', 'icon' : 'njsicon njsicon-paste', 'html' : '', 'action' : {'click' : $hJsEditor.pasteAction }},
                'delete' : {'title' : 'Delete', 'icon' : 'njsicon njsicon-bin', 'html' : '', 'action' : {'click' : $hJsEditor.deleteAction }},
            },
            
            'math' : {
                'sup' : {'title' : 'Sup', 'icon' : 'njsicon njsicon-superscript2', 'html' : '', 'action' : {'click' : $hJsEditor.supAction }},
                'sub' : {'title' : 'Sub', 'icon' : 'njsicon njsicon-subscript2', 'html' : '', 'action' : {'click' : $hJsEditor.subAction }},
            },
            'rollback' : {
                'undo' : {'title' : 'Undo', 'icon' : 'njsicon njsicon-undo', 'html' : '', 'action' : {'click' : $hJsEditor.undoAction }},
                'redo' : {'title' : 'Redo', 'icon' : 'njsicon njsicon-redo', 'html' : '', 'action' : {'click' : $hJsEditor.redoAction }},
            },
            

        };
        return ($types[t]) ?? false;
    },
    setClickPopupData: function( $el ){
        if( !$el){
            return;
        }
        $el.querySelectorAll('.njs-popup').forEach( $v => {
            $v.classList.remove('njs-open');
        });
    },

    removePopupModal: function( $el ){
        if( !$el){
            return;
        }
        $el.querySelectorAll('.njs-editor-overpopup').forEach( $v => {
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
                $v.setAttribute('njs-editor', 'njseditor-'+ $k);
                $v.classList.add('njseditor-'+ $k);

                if( $settings != ''){
                    $v.setAttribute('njs-settings', JSON.stringify($settings)); 
                }
                // set Settings
                let $sett = $hJsEditor.getSettings( $v );
                var $type = ($sett.type) ? $sett.type : 'basic';
                if( $control != ''){
                    $v.setAttribute('njs-' + $type, JSON.stringify($control)); 
                }
              
                // parent
                var $parentEl = $v.parentElement;
                var $appendEl = $parentEl.querySelector('.njseditor-'+ $k);

                var $mode = ($sett.displayMode) ? $sett.displayMode : 'white';
                var $panelClass = ($sett.panelClass) ? $sett.panelClass : 'njs-editor-panel';
                var $new = document.createElement('div');
                $new.classList.add($panelClass);
                $new.classList.add('njseditor-panel-'+ $k);
                $new.classList.add('njseditor-mode-'+ $mode);
                $new.setAttribute('njs-panel', 'njseditor-'+ $k);
                
                var $controls = document.createElement('div');
                $controls.classList.add('njseditor-panel-controls');

                // render control
                $hJsEditorCont.renTitle($controls, $k, 'title');
                
                $hJsEditorCont.renTitle($controls, $k, 'normal');
                $hJsEditorCont.renTitle($controls, $k, 'align');
                $hJsEditorCont.renTitle($controls, $k, 'order');
                $hJsEditorCont.renTitle($controls, $k, 'link');
                $hJsEditorCont.renTitle($controls, $k, 'copy_cut');
                $hJsEditorCont.renTitle($controls, $k, 'math');
                $hJsEditorCont.renTitle($controls, $k, 'rollback');

                $new.appendChild($controls);
                
                var $editorPanel = document.createElement('div');
                $editorPanel.classList.add('njseditor-panel-editor');

                var $editorMode = document.createElement('iframe');
                $editorMode.classList.add('njseditor-iframe-editor');
                $editorMode.setAttribute('id', 'njseditor-mode-' + $k);
                $editorMode.setAttribute('name', 'njseditor-mode-' + $k);
                $editorMode.setAttribute('frameborder', 0);
                
                $editorMode.setAttribute('style', 'height: 100%; width: 100%; position: relative;');
                $editorPanel.appendChild($editorMode);

                window.addEventListener("load", function( $e ){
                    $e.preventDefault();
                    var $editor = window.frames['njseditor-mode-' + $k].document;
                    if( $editor){
                        $editor.body.innerHTML = $v.value;
                        $hJsEditor.setRezise('img', $k);
                        $editor.designMode = "on";
                        $editor.execCommand("defaultParagraphSeparator", false, "p");
                        $editor.body.setAttribute('njs-control-id', $k);
                        $editor.addEventListener('keyup', $hJsEditor.editorKeyup);
                    }
                    
                });

                $new.appendChild($editorPanel);
                
                $parentEl.insertBefore($new, $appendEl);

                $new.querySelectorAll('.njseditor-panel-controls > [title]').forEach( $vt => {
                    if( !$vt.querySelector('.njs-tooltip') ){
                        var $tooltip = document.createElement('span');
                        $tooltip.classList.add('njs-tooltip');
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
        };
    },
    getUnqueid : function(){
        return Math.random().toString(36).substr(2);
    },
    getSettings: function( $el ){
        let $default = {
            type: 'basic', // css, class
            panelClass : 'njs-editor-panel',
            displayMode: 'white', //// dark, white
        };

        let $settings = $el.getAttribute('njs-settings');
        if( !$settings ){
            $el.setAttribute('njs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.panelClass = ($settings.panelClass) ? $settings.panelClass : $default.panelClass;
        $neSettings.displayMode = ($settings.displayMode) ? $settings.displayMode : $default.displayMode;
        
        return $neSettings;
    },
    setValue: function($k, $editor ){
        var $el = document.querySelector('.njseditor-'+$k+'[njs-editor="njseditor-'+$k+'"]');
        if( $el ){
            $el.innerHTML =  $editor.body.innerHTML;
        }
        $hJsEditorCont.setClickPopupData( document.querySelector('.njseditor-panel-' + $k) );

        $hJsEditor.autoiframeHeight( document.querySelector('[njs-panel="njseditor-'+$k+'"]') );
    },
    getValue: function($el, $name ){
        if( $el ){
            window.frames[$name].document.body.innerHTML = $el.value;
        }
    },
    editorKeyup: function( $e){
        $e.preventDefault();
        var $this = this;
        var $k = $this.body.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            
            $hJsEditor.setValue($k, $editor );
        }
    },
    paragraphAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("insertParagraph", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    boldAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Bold", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    italicAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Italic", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    linkAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.njseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'link', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'njs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.njs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.njs-popup-button-add');
            if( $addButton ){
                var $linkAddress = $popup.querySelector('.njs-popup-get-link');
                $addButton.addEventListener('click', function( $e ){
                    $editor.execCommand("CreateLink", null, $linkAddress.value);
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.njseditor-panel-' + $k) );
                });
            }
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.njseditor-panel-' + $k) );

        }
    },
    unlinkAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Unlink", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    codeAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.njseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'code', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'njs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.njs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.njs-popup-button-add');
            if( $addButton ){
                var $linkAddress = $popup.querySelector('.njs-popup-get-link');
                $addButton.addEventListener('click', function( $e ){
                    $editor.execCommand("insertHTML", null, $linkAddress.value);
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.njseditor-panel-' + $k) );
                });
            }
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.njseditor-panel-' + $k) );

        }
    },
    underlineAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Underline", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    supAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Superscript", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    subAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Subscript", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    strikeAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("Strikethrough", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    leftAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("JustifyLeft", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    centerAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("JustifyCenter", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    rightAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("JustifyRight", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    justifyAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("justifyFull", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    orderedAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("InsertOrderedList", false, "newOL", + Math.round(Math.random() * 1000));
            $hJsEditor.setValue($k, $editor );
        }
    },
    unorderedAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("InsertUnorderedList", false, "newOL", + Math.round(Math.random() * 1000));
            $hJsEditor.setValue($k, $editor );
        }
    },
    fontcolorAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("ForeColor", false, $e.target.getAttribute('njs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    highlightAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("BackColor", false, $e.target.getAttribute('njs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    tableInsertAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            let $data = $e.target.getAttribute('njs-value');
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
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("FontName", false, $e.target.getAttribute('njs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    headingAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("formatblock", false, $e.target.getAttribute('njs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    increaseAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("styleWithCSS", true, null);
            $editor.execCommand("fontSize", false, $e.target.getAttribute('njs-value'));
            $hJsEditor.setValue($k, $editor );
        }
    },
    undoAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("undo", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    redoAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("redo", false, null);
            $hJsEditor.setValue($k, $editor );
        }
    },
    copyAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("copy");
            $hJsEditor.setValue($k, $editor );
        }
    },
    cutAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("cut");
            $hJsEditor.setValue($k, $editor );
        }
    },
    pasteAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("paste");
            $hJsEditor.setValue($k, $editor );
        }
    },
    deleteAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            $editor.execCommand("delete", null, false);
            $hJsEditor.setValue($k, $editor );
        }
    },
    extlinkAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            var $el = document.querySelector('.njseditor-panel-' + $k);
            var $popup = $hJsEditor.createLinkBox($el, 'image', $k);
            
            var $select = $editor.getSelection().getRangeAt(0);
            var $selectCOn = $select.extractContents();
            var $span = document.createElement("span");
            $span.setAttribute('class', 'njs-fake-link-selection');
            $span.appendChild($selectCOn);
            $select.insertNode($span);

            var $offsetLeft = ($span.offsetLeft) ?? 0;
            var $offsetTop = ($span.offsetTop) ?? 0;
            $offsetTop += 70;
            
            $popup.style.top = $offsetTop + 'px';
            $popup.style.left = $offsetLeft  + 'px';

            var $link = $editor.querySelectorAll('span.njs-fake-link-selection');
            if( $link.length > 0){
                $link.forEach( $v => {
                    var $html = $v.innerHTML;
                    var $newNode = document.createTextNode($html);
                    $select.deleteContents();
                    $select.insertNode($newNode);
                });
            }

            var $addButton = $popup.querySelector('.njs-popup-button-add');
            if( $addButton ){
                var $linkAddress = $popup.querySelector('.njs-popup-get-link');
                $addButton.addEventListener('click', function( $e ){
                    $editor.execCommand("insertImage", null, $linkAddress.value);
                    $hJsEditor.setRezise('img', $k);
                    $hJsEditor.setValue($k, $editor );
                    $hJsEditorCont.removePopupModal( document.querySelector('.njseditor-panel-' + $k) );
                });
            }
            $hJsEditorCont.setClickPopupData( document.querySelector('.njseditor-panel-' + $k) );
        }
    },
    uploadfileAction: function( $e ){
        $e.preventDefault();
        var $this = this;
        var $k = $this.getAttribute('njs-control-id');
        if( !$k ){
            return;
        }
        
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            
            var $files = document.querySelector('#njs-file-hidden-' + $k);
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
            
            $hJsEditorCont.setClickPopupData( document.querySelector('.njseditor-panel-' + $k) );
        }
    },

    createLinkBox: function( $el, $type = 'link', $k){
        if( !$el){
            return;
        }
        var $check = $el.querySelector('.njs-editor-overpopup');
        if($check){
            $check.remove();
        }
        var $popup = document.createElement('div');
        $popup.setAttribute('class', 'njs-editor-overpopup');

        var $label = document.createElement('label');
        $label.setAttribute('class', 'njs-editor-overpopup-label');
        if( $type == 'image'){
            $label.innerText = ' Insert Image';
        } else if($type == 'image_re'){
            $label.innerText = ' Resize Box';
        } else if($type == 'code'){
            $label.innerText = ' Insert HTML';
        } else {
            $label.innerText = ' Insert Link';
        }
        $popup.appendChild($label);

        var $con = document.createElement('div');
        $con.setAttribute('class', 'njs-overpopup-continer');
        if( $type == 'image'){
            var $input = document.createElement('input');
            $input.setAttribute('class', 'njs-popup-get-link njs-popup-link-image');
            $input.setAttribute('njs-control-id', $k);
            $input.setAttribute('placeholder', 'Enter url');
            $con.appendChild($input);
        } else if($type == 'image_re'){
            var $input = document.createElement('input');
            $input.setAttribute('class', 'njs-popup-get-link njs-popup-link-image-re njs-img-width');
            $input.setAttribute('njs-control-id', $k);
            $input.setAttribute('placeholder', 'W: 100px');
            $con.appendChild($input);
            var $input = document.createElement('input');
            $input.setAttribute('class', 'njs-popup-get-link njs-popup-link-image-re njs-img-height');
            $input.setAttribute('njs-control-id', $k);
            $input.setAttribute('placeholder', 'H: 100px');
            $con.appendChild($input);
        }else if($type == 'code'){
            var $input = document.createElement('textarea');
            $input.setAttribute('class', 'njs-popup-get-link njs-popup-link-code');
            $input.setAttribute('njs-control-id', $k);
            $input.setAttribute('placeholder', 'Enter code');
            $con.appendChild($input);
        }else {
            var $input = document.createElement('input');
            $input.setAttribute('class', 'njs-popup-get-link njs-popup-link-href');
            $input.setAttribute('njs-control-id', $k);
            $input.setAttribute('placeholder', 'Enter link');
            $con.appendChild($input);
        }

        var $add = document.createElement('button');
            $add.setAttribute('type', 'button');
            $add.setAttribute('class', 'njs-button njs-popup-button-add njsicon njsicon-checkmark');
            $add.setAttribute('njs-control-id', $k);
            $con.appendChild($add);

        var $remove = document.createElement('button');
            $remove.setAttribute('class', 'njs-button njs-popup-button-remove njsicon njsicon-cross');
            $remove.setAttribute('njs-control-id', $k);
            $remove.addEventListener('click', function( $e ){
                $hJsEditorCont.removePopupModal( document.querySelector('.njseditor-panel-' + $k) );
            });
            $con.appendChild($remove);

        $popup.appendChild($con);

        $el.appendChild($popup);
        return $popup;
    },
    setRezise: function( $tag, $k){
        var $editor = window.frames['njseditor-mode-' + $k].document;
        if($editor){
            let $tags = $editor.querySelectorAll($tag);
            if( $tags.length > 0){
                $tags.forEach( $v => {
                    $v.classList.add('njs-rezise-options');
                    $v.classList.add('njs-rezise-' + $tag);
                    $v.setAttribute('njs-control-id', $k);
                    $v.removeEventListener('click', $hJsEditor.resizeOption);
                    $v.addEventListener('click', $hJsEditor.resizeOption);
                });
            }
            
        }
    },
    resizeOption: function( $e ){
        $e.preventDefault();
        let $this = this;
        let $k = $this.getAttribute('njs-control-id');
        var $el = document.querySelector('.njseditor-panel-' + $k);
        var $popup = $hJsEditor.createLinkBox($el, 'image_re', $k);
            
        var $editor = window.frames['njseditor-mode-' + $k].document;

        var $select = $editor.getSelection().getRangeAt(0);
        var $selectCOn = $select.extractContents();
        var $span = document.createElement("span");
        $span.setAttribute('class', 'njs-fake-link-selection');
        $span.appendChild($selectCOn);
        $select.insertNode($span);

        var $offsetLeft = ($this.offsetLeft) ?? 0;
        var $offsetTop = ($this.offsetTop) ?? 0;
        $offsetTop += 70;
        
        $popup.style.top = $offsetTop + 'px';
        $popup.style.left = $offsetLeft  + 'px';

        var $link = $editor.querySelectorAll('span.njs-fake-link-selection');
        if( $link.length > 0){
            $link.forEach( $v => {
                var $html = $v.innerHTML;
                var $newNode = document.createTextNode($html);
                $select.deleteContents();
                $select.insertNode($newNode);
            });
        }

        var $addButton = $popup.querySelector('.njs-popup-button-add');
        if( $addButton ){
            var $width = $popup.querySelector('.njs-img-width');
            var $height = $popup.querySelector('.njs-img-height');
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