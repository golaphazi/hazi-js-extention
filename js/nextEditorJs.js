"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/

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
                
                let $items = $v.getAttribute('njs-' + $type);
                if( !$items ){
                    $items = $nJsEditor.getType( $type );
                }

                // parent
                var $parentEl = $v.parentElement;
                var $appendEl = $parentEl.querySelector('.njseditor-'+ $k);

                var $panelClass = ($sett.panelClass) ? $sett.panelClass : 'njs-editor-panel';
                var $new = document.createElement('div');
                $new.classList.add($panelClass);
                $new.classList.add('njseditor-panel-'+ $k);
                $new.setAttribute('njs-panel', 'njseditor-'+ $k);

                if( Object.entries($items) ){
                    var $controls = document.createElement('div');
                    $controls.classList.add('njseditor-panel-controls');
                    
                    for (const [$kk, $vv] of Object.entries($items)) {
                        var $typeEl = ($vv.type) ?? 'button';
                        var $action = document.createElement($typeEl);
                        $action.setAttribute('title', ($vv.title) ?? '' );
                        $action.setAttribute('id', 'njs-'+$kk + '-' + $k );
                        $action.setAttribute('njs-control-id', $k );
                        $action.setAttribute('njs-keys', $kk );
                        
                        var $act = ($vv.action) ?? false;
                        var $icon = ($vv.icon) ?? '';
                        var $html = ($vv.html) ?? '';
                        if( $icon != ''){
                            $action.setAttribute('class', $icon);
                        } else if( $html != ''){
                            $action.innerHTML = $html;
                        }

                        $action.classList.add('njs-controls');
                        $action.classList.add('njs-' + $kk);

                        
                        if( Object.entries($act) ){
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

                        var $attr = ($vv.attr) ?? { type: 'button'};
                        if( Object.entries($attr) ){
                            for (const [$kat, $vat] of Object.entries($attr)) {
                                $action.setAttribute($kat, $vat );
                            }
                        }
                        $controls.appendChild($action);
                    }

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

                }
                $parentEl.insertBefore($new, $appendEl);

                 // font render 
                var $elFont = $new.querySelectorAll( '.njs-fontfamily' );
                $nJsEditor.setFontFamily($elFont);

                var $elHeading = $new.querySelectorAll( '.njs-heading' );
                $nJsEditor.setHeading($elHeading);

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
            'blockquote' : 'Blockquote',
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
    getType: function( $type ){
        let $types = {
            'basic' : {
                'paragraph' : {'title' : 'Paragraph', 'icon' : 'fa fa-paragraph', 'html' : 'br', 'action' : {'click' : $nJsEditor.paragraphAction }},
                'bold' : {'title' : 'Bold', 'icon' : 'fa fa-bold', 'html' : '', 'action' : {'click' : $nJsEditor.boldAction }},
                'italic' : {'title' : 'Italic', 'icon' : 'fa fa-italic', 'html' : '', 'action' : {'click' : $nJsEditor.italicAction }},
                
                'link' : {'title' : 'Inset / Edit Link', 'icon' : 'fa fa-link', 'html' : '', 'action' : {'click' : $nJsEditor.linkAction }},
                'unlink' : {'title' : 'Remove Link', 'icon' : 'fa fa-chain-broken', 'html' : '', 'action' : {'click' : $nJsEditor.unlinkAction }},
                'underline' : {'title' : 'Underline', 'icon' : 'fa fa-underline', 'html' : '', 'action' : {'click' : $nJsEditor.underlineAction }},
                
                'sup' : {'title' : 'Sup', 'icon' : 'fa fa-superscript', 'html' : '', 'action' : {'click' : $nJsEditor.supAction }},
                'sub' : {'title' : 'Sub', 'icon' : 'fa fa-subscript', 'html' : '', 'action' : {'click' : $nJsEditor.subAction }},
                'strike' : {'title' : 'Strike', 'icon' : 'fa fa-strikethrough', 'html' : '', 'action' : {'click' : $nJsEditor.strikeAction }},
                
                'left' : {'title' : 'Left Align', 'icon' : 'fa fa-align-left', 'html' : '', 'action' : {'click' : $nJsEditor.leftAction }},
                'center' : {'title' : 'Center Align', 'icon' : 'fa fa-align-center', 'html' : '', 'action' : {'click' : $nJsEditor.centerAction }},
                'right' : {'title' : 'Right Align', 'icon' : 'fa fa-align-right', 'html' : '', 'action' : {'click' : $nJsEditor.rightAction }},
                'justify' : {'title' : 'Justify Align', 'icon' : 'fa fa-align-justify', 'html' : '', 'action' : {'click' : $nJsEditor.justifyAction }},
                
                'ordered' : {'title' : 'Number List', 'icon' : 'fa fa-list-ol', 'html' : '', 'action' : {'click' : $nJsEditor.orderedAction }},
                'unordered' : {'title' : 'Bulleted List', 'icon' : 'fa fa-list-ul', 'html' : '', 'action' : {'click' : $nJsEditor.unorderedAction }},
                
                'fontcolor' : {'type' : 'input', 'attr' : { type: 'color'}, 'title' : 'Font Color', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.fontcolorAction }},
                'highlight' : {'type' : 'input', 'attr' : { type: 'color'}, 'title' : 'Highlight Color', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.highlightAction }},
                
                'fontfamily' : {'type' : 'select', 'attr' : { class: 'njs-fontfamily'}, 'title' : 'Font', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.fontfamilyAction }},
                'heading' : {'type' : 'select', 'attr' : { class: 'njs-heading'}, 'title' : 'Heading', 'icon' : '', 'html' : '', 'action' : {'change' : $nJsEditor.headingAction }},
                
                'increase' : {'title' : 'Increase Font', 'icon' : 'fa fa-font', 'html' : '', 'action' : {'click' : $nJsEditor.increaseAction }},
                
            },
            'classic' : [

            ],
            'advance' : [

            ]
        };
        switch($type){
            case 'basic':
                return ($types.basic) ? $types.basic : [];
            break;

            case 'classic':
                return ($types.classic) ? $types.classic : [];
            break;

            case 'advance':
                return ($types.advance) ? $types.advance : [];
            break;

            default: 
                return ($types.basic) ? $types.basic : [];
            break;
        }
        
    },
    getSettings: function( $el ){
        let $default = {
            type: 'basic', // css, class
            panelClass : 'njs-editor-panel'
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
        
        return $neSettings;
    },
    setValue: function($k, $editor ){
        var $el = document.querySelector('.njseditor-'+$k+'[njs-editor="njseditor-'+$k+'"]');
        if( $el ){
            $el.innerHTML =  $editor.body.innerHTML;
        }
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
            $editor.execCommand("FontName", false, $e.target.value);
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
            $editor.execCommand("formatblock", false, $e.target.value);
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