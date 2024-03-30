"use strict";
/**
* Name: HaziJs Select2
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/

var $hJsSelect2 = {
    init: function( $selector = '.hjs-select2'){
        let attribute, i, o;
        const selects = document.querySelectorAll( $selector );
       
        for (const select of selects) {

            // check already select2
            if( select.classList.contains('has-hjs-select2')){
                continue;
            }

            const div = document.createElement('div');
            const header = document.createElement('div');
            const datalist = document.createElement('datalist');
            const optgroups = select.querySelectorAll('optgroup');
            const span = document.createElement('span');
            span.setAttribute('class', 'hjs-select2-display');

            const span_input = document.createElement('span');
            span_input.setAttribute('class', 'hjs-select2-input');
            span_input.setAttribute('contenteditable', true);

            span.appendChild( span_input );

            const options = select.options;
            const parent = select.parentElement;
            const multiple = select.hasAttribute('multiple');

            select.classList.add('has-hjs-select2');

            const onclick = function(e) {
                const disabled = this.hasAttribute('data-disabled');

                let options_data = div.querySelectorAll('select option');

                let $data = this.dataset.value;
                let $label = this.dataset.label;
                let $index = this.dataset.index;

                if (disabled) return;

                // select element
                if (multiple) {
                    options_data.forEach( $v => {
                        let $check_value = ($v.value) ? $v.value : $v.innerText;

                        if( $v.hasAttribute('tabindex') ){
                            $check_value = $v.getAttribute('tabindex');
                            $data = $index;
                        }
                        
                        if( $check_value == $data){
                            const checked_item = $v.hasAttribute("selected");
                            if (checked_item) {
                                $v.removeAttribute("selected");
                            } else {
                                $v.setAttribute("selected", "");
                            }
                        }
                    });
                    
                }else{
                    options_data.forEach( $v => {
                        let $check_value = ($v.value) ? $v.value : $v.innerText;
                        if( $v.hasAttribute('tabindex') ){
                            $check_value = $v.getAttribute('tabindex');
                            $data = $index;
                        }
                        if( $check_value == $data){
                            $v.setAttribute("selected", "");
                        }else{
                            $v.removeAttribute("selected");
                        }
                    });
                }

                // datalist
                if (multiple) {
                    if (e.shiftKey) {
                        const checked_item = this.hasAttribute("data-checked");
                        if (checked_item) {
                            this.removeAttribute("data-checked");
                        } else {
                            this.setAttribute("data-checked", "");
                        };
                    } else {
                        const checked_item = this.hasAttribute("data-checked");
                        if (checked_item) {
                            this.removeAttribute("data-checked");
                        } else {
                            this.setAttribute("data-checked", "");
                        }
                    };
                } else {
                    const options_div = div.querySelectorAll('.option');

                    for (i = 0; i < options_div.length; i++) {
                        const option_div = options_div[i];
                        option_div.removeAttribute("data-checked");
                    };
                    
                    this.setAttribute("data-checked", "");
                }
                span_input.innerHTML = '';
                cleanList();
                selectedData();
            };

            const onkeyup = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.keyCode === 13) {
                    this.click();
                }
            };
            const selectedData = function( ){
                let $options_all = select.querySelectorAll( 'option[selected]' );
                
                span.innerHTML = '';

                if( $options_all.length > 0){
                    let $i = 0;
                    $options_all.forEach( $v => {
                        const selected = $v.hasAttribute('selected');
                        if( selected ){

                            let $value = $v.innerText.trim();
                            if( $value == ''){
                                $value = ($v.value) ? $v.value : '';
                            }
                            if( $v.hasAttribute('tabindex') ){
                                let $index = $v.getAttribute('tabindex');

                                let $dataList = div.querySelector('datalist div.option[data-index="'+$index+'"]');
                                if( $dataList && $dataList.hasAttribute('data-label') ){
                                    let $label = $dataList.getAttribute('data-label');
                                    if( $label.trim() != ''){
                                        $value = $label;
                                    }
                                }
                            }

                            let $span = document.createElement('span');
                            $span.innerText = $value.trim();
                            $span.tabIndex = $v.getAttribute('tabindex');
                            $span.setAttribute('data-value', $v.value);
                            $span.addEventListener('click', function(e){
                                e.preventDefault();
                                
                                let $this = this;
                                let $value = $this.getAttribute('data-value');
                                let $index = $this.getAttribute('tabindex');

                                const options_div = div.querySelector('.option[data-index="'+$index+'"]');
                                if( options_div ){
                                    options_div.removeAttribute('data-checked');
                                }

                                const options_vl = select.querySelector('option[tabindex="'+$index+'"]');
                                if( options_vl ){
                                    options_vl.removeAttribute('selected');
                                }

                                $this.remove();
                                div.setAttribute("data-open", "");
                                let $selectedItem = parent.querySelectorAll( 'select option[selected]' );
                                if( $selectedItem.length == 0){
                                    span.innerText = (select.title) ? select.title : 'Select Item';

                                    cleanList();
                                }
                            });
                            span.append( $span );
                        }
                        $i++;
                    });
                } else{
                    span.innerText = (select.title) ? select.title : 'Select Item';
                    cleanList();
                }
                
                span.appendChild( span_input );
            };

            const cleanList = function(){
                let $li = datalist.querySelectorAll("div.option");
                if($li){
                    for (let i = 0; i < $li.length; i++) {
                        $li[i].style.display = "";
                    }
                }
            };

            div.classList.add('hjs-select2-wrap');
            header.classList.add('nextheader-wrap');

            div.tabIndex = 1;
            select.tabIndex = -1;
            span.innerText = (select.title) ? select.title : 'Select Item';

            header.appendChild(span);

            for (attribute of select.attributes) {
                //div.dataset[attribute.name] = attribute.value;
            }

            let $options_all = parent.querySelectorAll( 'select > *' );
            if( $options_all.length > 0){
                let $i = 0;
                $options_all.forEach( $v => {

                    const disabled = $v.hasAttribute('disabled');
                    const selected = $v.hasAttribute('selected');

                    let $opt = $v.querySelectorAll( 'option' );
                    if( $opt.length > 0 ){
                        
                        const optgroup = document.createElement('div');
                        const label = document.createElement('div');

                        label.classList.add('label');
                        label.innerText = $v.label;
                        optgroup.appendChild(label);

                        $opt.forEach( $v1 => {
                            const option = document.createElement('div');
                            const label = document.createElement('div');
                            const o = $v1;
    
                            const disabled1 = $v1.hasAttribute('disabled');
                            const selected1 = $v1.hasAttribute('selected');

                            if( disabled1 ){
                                option.setAttribute('data-disabled', '');
                            }

                            if( selected1 ){
                                option.setAttribute('data-checked', '');
                            }

                            for (attribute of o.attributes) {
                                //option.dataset[attribute.name] = attribute.value;
                            }
    
                            option.classList.add('option');
                            option.classList.add('optgroup-item');
                            label.classList.add('label');
                            label.innerText = o.label;
    
                            option.dataset.value = o.value;
                            option.dataset.label = o.label;
                            option.dataset.index = $i;
    
                            if( !o.hasAttribute('value') ){
                                let $check_value = (o.value) ? o.value : o.innerText;
                                o.setAttribute('value', $check_value);
                            }
    
                            $v1.setAttribute('tabindex', $i);

                            option.onclick = onclick;
                            option.onkeyup = onkeyup;
                            //option.tabIndex = $i;
                            option.appendChild(label);
                            optgroup.appendChild(option);

                            $i++;
                        });
                        optgroup.classList.add('optgroup');
                        datalist.appendChild(optgroup);

                    } else {
                        
                        const option = document.createElement('div');
                        const label = document.createElement('div');
                        const o = $v;

                        if( disabled ){
                            option.setAttribute('data-disabled', '');
                        }

                        if( selected ){
                            option.setAttribute('data-checked', '');
                        }

                        for (attribute of o.attributes) {
                            //let $name = (attribute.name) ? attribute.name : '';
                            //console.log( $name );
                            //option.dataset[attribute.name] = attribute.value;
                        }

                        option.classList.add('option');
                        label.classList.add('label');
                        label.innerText = o.label;

                        option.dataset.value = o.value;
                        option.dataset.label = o.label;
                        option.dataset.index = $i;
                        
                        if( !o.hasAttribute('value') ){
                            let $check_value = (o.value) ? o.value : o.innerText;
                            o.setAttribute('value', $check_value);
                        }

                        $v.setAttribute('tabindex', $i);

                        option.onclick = onclick;
                        option.onkeyup = onkeyup;
                        //option.tabIndex = $i;
                        option.appendChild(label);
                        datalist.appendChild(option);
                    }
                    $i++;
                });
            }
           
            div.appendChild(header);

            div.onclick = function(e) {
                e.preventDefault();
            }
            parent.insertBefore(div, select);
            header.appendChild(select);
            div.appendChild(datalist);

            //datalist.style.top = ((header.offsetTop + header.offsetHeight) - 1 ) + 'px';
            datalist.style.top = 'auto';
            div.onclick = function(e) {

                if (multiple) {

                    const open = this.hasAttribute("data-open");
                    e.stopPropagation();
                    if (open) {
                        this.removeAttribute("data-open");
                    } else {
                        this.setAttribute("data-open", "");
                    }

                } else {

                    const open = this.hasAttribute("data-open");
                    e.stopPropagation();
                    if (open) {
                        this.removeAttribute("data-open");
                    } else {
                        this.setAttribute("data-open", "");
                    }

                }
            };

            div.onkeyup = function(event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    this.click();
                }
            };

            span_input.onkeyup = function( event ){
                event.preventDefault();
                div.setAttribute("data-open", '');
                let $this = this;
                let filter = $this.innerText.toUpperCase();

                let $li = datalist.querySelectorAll("div.option");
                if($li){
                    for (let i = 0; i < $li.length; i++) {
                        let $span = $li[i].querySelectorAll("*");
                        if($span){
                            let txtValue = '';
                            $span.forEach(function($v){
                                txtValue += $v.textContent || $v.innerText + ' ';
                            });

                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                $li[i].style.display = "";
                            } else {
                                $li[i].style.display = "none";
                            }
                        }
                    }
                }
                
            };

            document.addEventListener('click', function(e) {
                if (div.hasAttribute("data-open")) div.removeAttribute("data-open");
            });

            const width = Math.max(...Array.from(options).map(function(e) {
                return div.offsetWidth;
            }));
            div.style.minWidth = width + 'px';

            let $selectedItem = parent.querySelectorAll( 'select option[selected]' );
            if( $selectedItem.length > 0){
                selectedData();
            }
            
        }
    }
    
};
