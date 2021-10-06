"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/
var $nJsEditorCont = {
    init: function(){

    },
    createDropDown : function( $el, $k, $key, $v ){
        var $heading = document.createElement('div');
        $heading.setAttribute('class', 'njs-editor-control njs-editor-' + $key);
        $heading.setAttribute('title', ($v.title) ?? '' );

        var $button = document.createElement('button');
        $button.setAttribute('class', 'njs-button njs-button-dropdown njs-button-'+$key+' fa fa-angle-down');
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
                        $attr.class += ' ' + $iconB;
                    } else{
                        $buttonEl.innerHTML = $htmlV;
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
                    }else {
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

        var $items = $nJsEditorCont.getType( $type );
        if($items){

            if( Object.entries($items) ){
                for (const [$k1, $v] of Object.entries($items)) {

                    var $data = ($v.data) ?? false;
                    if( $data ){
                        $nJsEditorCont.createDropDown($el, $k, $k1, $v);
                    } else {
                        $nJsEditorCont.createButton($el, $k, $k1, $v);
                    }
                    
                }
                var $seperator = document.createElement('span');
                $seperator.classList.add('njs-toolbar__separator');

                $el.appendChild($seperator);
            }
            
        }
    },
    getType: function( t ){
       
        var $types = {
            'title' : {
                'heading' : {'attr' : { class: 'njs-heading'}, 'title' : 'Heading', 'icon' : 'fa fa-header', 'html' : 'Select once', 
                    'action' : {'click' : $nJsEditor.headingAction },
                    'data' : $nJsEditor.getFormatFont()
                },
                'fontfamily' : {'attr' : { class: 'njs-fontfamily'}, 'title' : 'Font Family', 'icon' : 'fa fa-font', 'html' : 'Select once', 
                    'action' : {'click' : $nJsEditor.fontfamilyAction },
                    'data' : $nJsEditor.getFontFamily()
                },
               
                /*'fontcolor' : {'type' : 'input', 'attr' : { type: 'color'}, 'title' : 'Font Color', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.fontcolorAction }},
                'highlight' : {'type' : 'input', 'attr' : { type: 'color'}, 'title' : 'Highlight Color', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.highlightAction }},
                'fontfamily' : {'type' : 'select', 'attr' : { class: 'njs-fontfamily'}, 'title' : 'Font', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.fontfamilyAction }},
                'increase' : {'title' : 'Increase Font', 'icon' : 'fa fa-font', 'html' : '', 'action' : {'click' : $nJsEditor.increaseAction }},*/
            },
            'normal' : {
                'paragraph' : {'title' : 'Paragraph', 'icon' : 'fa fa-paragraph', 'html' : 'br', 'action' : {'click' : $nJsEditor.paragraphAction }},
                'bold' : {'title' : 'Bold', 'icon' : 'fa fa-bold', 'html' : '', 'action' : {'click' : $nJsEditor.boldAction }},
                'italic' : {'title' : 'Italic', 'icon' : 'fa fa-italic', 'html' : '', 'action' : {'click' : $nJsEditor.italicAction }},
                'underline' : {'title' : 'Underline', 'icon' : 'fa fa-underline', 'html' : '', 'action' : {'click' : $nJsEditor.underlineAction }},
                'strike' : {'title' : 'Strike', 'icon' : 'fa fa-strikethrough', 'html' : '', 'action' : {'click' : $nJsEditor.strikeAction }},
            },
            'link' : {
                'link' : {'title' : 'Inset / Edit Link', 'icon' : 'fa fa-link', 'html' : '', 'action' : {'click' : $nJsEditor.linkAction }},
                'unlink' : {'title' : 'Remove Link', 'icon' : 'fa fa-chain-broken', 'html' : '', 'action' : {'click' : $nJsEditor.unlinkAction }},
            },
            'align' : {
                'alignment' : {'attr' : { class: 'njs-align'}, 'title' : 'Align', 'icon' : 'fa fa-align-left', 'html' : '', 
                    'data' : {
                        'left' : {'title' : 'Left Align', 'icon' : 'fa fa-align-left', 'html' : '', 'action' : {'click' : $nJsEditor.leftAction }},
                        'center' : {'title' : 'Center Align', 'icon' : 'fa fa-align-center', 'html' : '', 'action' : {'click' : $nJsEditor.centerAction }},
                        'right' : {'title' : 'Right Align', 'icon' : 'fa fa-align-right', 'html' : '', 'action' : {'click' : $nJsEditor.rightAction }},
                        'justify' : {'title' : 'Justify Align', 'icon' : 'fa fa-align-justify', 'html' : '', 'action' : {'click' : $nJsEditor.justifyAction }},
                    }
                },
                
            },
            'order' : {
                'ordered' : {'title' : 'Number List', 'icon' : 'fa fa-list-ol', 'html' : '', 'action' : {'click' : $nJsEditor.orderedAction }},
                'unordered' : {'title' : 'Bulleted List', 'icon' : 'fa fa-list-ul', 'html' : '', 'action' : {'click' : $nJsEditor.unorderedAction }},
            },
            
            'math' : {
                'sup' : {'title' : 'Sup', 'icon' : 'fa fa-superscript', 'html' : '', 'action' : {'click' : $nJsEditor.supAction }},
                'sub' : {'title' : 'Sub', 'icon' : 'fa fa-subscript', 'html' : '', 'action' : {'click' : $nJsEditor.subAction }},
            }

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
    }
};

var $nJsEditor = {

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
                let $sett = $nJsEditor.getSettings( $v );
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
                $nJsEditorCont.renTitle($controls, $k, 'normal');
                $nJsEditorCont.renTitle($controls, $k, 'title');
                $nJsEditorCont.renTitle($controls, $k, 'link');
                $nJsEditorCont.renTitle($controls, $k, 'align');
                $nJsEditorCont.renTitle($controls, $k, 'order');
                $nJsEditorCont.renTitle($controls, $k, 'math');

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
                        $editor.designMode = "on";
                        $editor.body.setAttribute('njs-control-id', $k);
                        $editor.addEventListener('keyup', $nJsEditor.editorKeyup);
                    }
                    
                });

                $new.appendChild($editorPanel);
                
                $parentEl.insertBefore($new, $appendEl);

            });

           
        }
    },
    getFontFamily: function(){
        return ["Times New Roman", "Consolas", "Tahoma", "Monospace", "Cursive", "Sans-Serif", "Calibri", "Arial"];
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
        };
    },
    
    setFontFamily: function( $el ){
        if( $el.length > 0){
            var $fonts = $nJsEditor.getFontFamily();
            $el.forEach( $v => {
                var $i = 0;
                for(; $i < $fonts.length; $i++){
                    var $reF = document.createElement('option');
                    $reF.setAttribute('value', $fonts[$i]);
                    $reF.innerHTML = $fonts[$i];
                    $reF.style.fontFamily = $fonts[$i];
                    $v.appendChild($reF);
                }
            });
        }
    },
    setHeading: function( $el ){
        if( $el.length > 0){
            $el.forEach( $v => {
                var $fonts = $nJsEditor.getFormatFont();
                
                if( Object.entries($fonts) ){
                    for (const [$k, $v1] of Object.entries($fonts)) {
                        var $reF = document.createElement('option');
                        $reF.setAttribute('value', $k);
                        $reF.innerHTML = $v1;
                        $v.appendChild($reF);
                    }
                }
            });
        }
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
        $nJsEditorCont.setClickPopupData( document.querySelector('.njseditor-panel-' + $k) );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $editor.execCommand("styleWithCSS", true, null);
            
            var url = prompt("Enter a URL", "http://");
		    $editor.execCommand("CreateLink", false, url);
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $editor.execCommand("ForeColor", false, $e.target.value);
            $nJsEditor.setValue($k, $editor );
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
            $editor.execCommand("BackColor", false, $e.target.value);
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $nJsEditor.setValue($k, $editor );
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
            $editor.execCommand("increaseFontSize", false, "");
            $nJsEditor.setValue($k, $editor );
        }
    },

};

// Accrodion calling
$nJsEditor.init('.nx-editor-selector');