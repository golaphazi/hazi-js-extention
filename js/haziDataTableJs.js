"use strict";
/**
* Name: HaziJs Data Table
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/
var $hJsDataTable = {
    init: function( $el, $settings = ''){

        let $tablesEl = document.querySelectorAll($el);
        if( $tablesEl.length > 0 ){
            $tablesEl.forEach( $v => {
                $v.classList.toggle('hzdata-table-wrap');
            });
        }

        let $tables = document.querySelectorAll('.hzdata-table-wrap');
        if( $tables.length > 0 ){
            $tables.forEach( function( $v, $k) {
                $v.setAttribute('data-hztable', 'hztable-'+ $k);
                if( $settings != ''){
                    $v.setAttribute('data-hztable-settings', JSON.stringify($settings)); 
                }

                // set Settings
                let $sett = $hJsDataTable.getSettings( $v );
                let $thead = ($sett.thead) ? $sett.thead : false;

                // setup fikter
                $hJsDataTable.setFilterDiv( $v, 'hztable-filter-wrap' ) . setRefresh( $v ) . setSearch( $v ) . setOrderList( $v ) . setCustomOrder( $v );

                //setup table
                let $table = $hJsDataTable.setTable( $v ) . setTableHead( $v ) . setTableBody($v) . setTableFoot($v);
                
                //setup pagination
                $hJsDataTable.setFilterDiv( $v, 'hztable-pagination-wrap' ) . setPagination( $v ). setPerPage( $v );

            });
        }

        return this;
    },
    setClass: function($className, $el){
        let $clsplit = $className.split(" ");
        if( $clsplit.length > 0){
            for(let $i = 0; $i < $clsplit.length; $i++){
                if( $clsplit[$i] != ''){
                    $el.classList.add($clsplit[$i]);
                } 
            }
        }
        return this;
    },
    setTable: function( $el ){
        let $table = $el.querySelector('table');
        if( !$table ){
            let $elTable = document.createElement('table');
            $elTable.setAttribute('class', 'hztable-wrap');
            $el.appendChild($elTable);
            $table = $el.querySelector('table');
        }
        $table.classList.add('hztable-wrap');
        let $sett = $hJsDataTable.getSettings( $el );
        let $className = ($sett.className) ? $sett.className : '';
        $hJsDataTable.setClass( $className, $table);
        
        return this;
    },
    setTableHead: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $thead = ($sett.thead) ? $sett.thead : false;
        if(!$thead){
            return this;
        }
        let $table = $el.querySelector('table');
        if( !$table ){
            console.log('Error 04: Table element not found! Ex: table');
            return this;
        }

        let $theadEl = $table.querySelector('thead');
        if( !$theadEl ){
            let $elTable = document.createElement('thead');
            $elTable.setAttribute('class', 'hzthead');
            $table.appendChild($elTable);
            $theadEl = $table.querySelector('thead');
        }
        $theadEl.classList.add('hzthead');

        let $theadData = ($sett.theadData) ? $sett.theadData : {};
        let $theadElData = ($sett.theadEl) ? $sett.theadEl : '';
        $hJsDataTable.setClass( $theadElData, $theadEl);

        if(Object.keys($theadData).length == 0){
            $theadData = ($sett.tfootData) ? $sett.tfootData : {};
        }

        if(Object.keys($theadData).length > 0){
            let $tr = document.createElement('tr');
            
            for (const [$k, $v] of Object.entries($theadData)) {
                let $th = document.createElement('th');
                let $label = document.createElement('label');
                $label.setAttribute('for', 'hz-thlabel-' + $k);
                $label.setAttribute('data-key', $k);
                $label.setAttribute('data-title', $v);
                $label.innerHTML = $v;
                $th.appendChild($label);

                $tr.appendChild($th);
            }
            $theadEl.appendChild($tr);
        }
        return this;
    },
    setTableBody: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $tbody = ($sett.tbody) ? $sett.tbody : false;
        if(!$tbody){
            return this;
        }
        let $table = $el.querySelector('table');
        if( !$table ){
            console.log('Error 04: Table element not found! Ex: table');
            return this;
        }

        let $tbodyEl = $table.querySelector('tbody');
        if( !$tbodyEl ){
            let $elTable = document.createElement('tbody');
            $elTable.setAttribute('class', 'hztbody');
            $table.appendChild($elTable);
            $tbodyEl = $table.querySelector('tbody');
        }
        $tbodyEl.classList.add('hztbody');


        let $tbodyData = ($sett.tbodyData) ? $sett.tbodyData : {};
        let $tbodyElData = ($sett.tbodyEl) ? $sett.tbodyEl : '';
        $hJsDataTable.setClass( $tbodyElData, $tbodyEl);

        return this;
    },
    setTableFoot: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $tfoot = ($sett.tfoot) ? $sett.tfoot : false;
        if(!$tfoot){
            return this;
        }
        let $table = $el.querySelector('table');
        if( !$table ){
            console.log('Error 04: Table element not found! Ex: table');
            return this;
        }

        let $tfootEl = $table.querySelector('tfoot');
        if( !$tfootEl ){
            let $elTable = document.createElement('tfoot');
            $elTable.setAttribute('class', 'hztfoot');
            $table.appendChild($elTable);
            $tfootEl = $table.querySelector('tfoot');
        }
        $tfootEl.classList.add('hztfoot');


        let $tfootData = ($sett.tfootData) ? $sett.tfootData : {};
        let $tfootElData = ($sett.tfootEl) ? $sett.tfootEl : '';
        $hJsDataTable.setClass( $tfootElData, $tfootEl);

        if(Object.keys($tfootData).length == 0){
            $tfootData = ($sett.theadData) ? $sett.theadData : {};
        }
        if(Object.keys($tfootData).length > 0){
            let $tr = document.createElement('tr');
            
            for (const [$k, $v] of Object.entries($tfootData)) {
                let $th = document.createElement('th');
                let $label = document.createElement('label');
                $label.setAttribute('for', 'hz-thlabel-' + $k);
                $label.setAttribute('data-key', $k);
                $label.setAttribute('data-title', $v);
                $label.innerHTML = $v;
                $th.appendChild($label);

                $tr.appendChild($th);
            }
            $tfootEl.appendChild($tr);
        }
        return this;
    },
    setFilterDiv: function( $el , $ele){
        let $table = $el.querySelector('div.' + $ele);
        if( !$table ){
            let $elTable = document.createElement('div');
            $elTable.setAttribute('class', $ele );
            $el.appendChild($elTable);
            $table = $el.querySelector('div.' + $ele);
        }

        return this;
    },
    setRefresh: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $refresh = ($sett.refresh) ? $sett.refresh : false;
        let $refreshEl = ($sett.refreshEl) ? $sett.refreshEl : '';
        let $refreshTxt = ($sett.refreshTxt) ? $sett.refreshTxt : '';
        
        if(!$refresh){
            return this;
        }

        let $wrap = $el.querySelector('div.hztable-filter-wrap');
        if( !$wrap ){
            console.log('Error 03: filter wrap not found! Ex: .hztable-filter-wrap');
            return this;
        }
        let $elTable = document.createElement('button');
        $elTable.setAttribute('class', 'hztable-filter-refresh');
        if( $refreshEl != ''){
            let $icon = document.createElement('i');
            $hJsDataTable.setClass( $refreshEl, $icon);
            $elTable.appendChild($icon);
        }
        $elTable.innerHTML += $refreshTxt;

        $elTable.addEventListener('click', function(){
            let $this = this;
            $this.classList.add('refresh-mode');
            $hJsDataTable.getOutput( $el );
        });

        $wrap.appendChild($elTable);

        return this;
    },
    setSearch: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $searchbox = ($sett.searchbox) ? $sett.searchbox : false;
        let $keyTable = ($sett.keyTable) ? $sett.keyTable : '';
        let $searchTxt = ($sett.searchTxt) ? $sett.searchTxt : '';
        
        if(!$searchbox){
            return this;
        }

        let $wrap = $el.querySelector('div.hztable-filter-wrap');
        if( !$wrap ){
            console.log('Error 03: filter wrap not found! Ex: .hztable-filter-wrap');
            return this;
        }
        let $elTable = document.createElement('div');
        $elTable.setAttribute('class', 'hztable-filter-search');
        
        let $input = document.createElement('input');
        $input.setAttribute('type', 'search');
        $input.setAttribute('placeholder', $searchTxt);
        $input.addEventListener('blur', function(){
            let $this = this;
            
            $hJsDataTable.getOutput( $el );
        });
        $elTable.appendChild($input);

        $wrap.appendChild($elTable);

        return this;
    },
    setOrderList: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $order = ($sett.order) ? $sett.order : false;
        let $keyTable = ($sett.keyTable) ? $sett.keyTable : '';
        let $orderData = ($sett.orderData) ? $sett.orderData : '';
        let $orderDefault = ($sett.orderDefault) ? $sett.orderDefault : '';
        
        if(!$order){
            return this;
        }

        let $wrap = $el.querySelector('div.hztable-filter-wrap');
        if( !$wrap ){
            console.log('Error 03: filter wrap not found! Ex: .hztable-filter-wrap');
            return this;
        }
        if(Object.keys($orderData).length > 0){
            let $elTable = document.createElement('ul');
            $elTable.setAttribute('class', 'hztable-filter-order');
            $elTable.setAttribute('data-value', $orderDefault);
            $elTable.setAttribute('title', 'Order By');

            for (const [$k, $v] of Object.entries($orderData)) {
                let $th = document.createElement('li');
                $th.setAttribute('data-key', $k);
                $th.setAttribute('data-title', $v.txt);
                if( $orderDefault == $k){
                    $th.classList.add('hz-active');
                }
                if( $v.icon != ''){
                    let $label = document.createElement('i');
                    $label.setAttribute('class', $v.icon);
                    $th.appendChild($label);
                } else {
                    $th.innerHTML = $v.txt;
                }
                $th.addEventListener('click', function(){
                    let $this = this;
                    let $value = $this.getAttribute('data-key');
                    $elTable.setAttribute('data-value', $value);

                    $elTable.querySelectorAll('li').forEach( $v1 => {
                        $v1.classList.remove('hz-active');
                    });
                    $this.classList.add('hz-active');

                    $hJsDataTable.getOutput( $el );
                });
                
                $elTable.appendChild($th);
            }

            $wrap.appendChild($elTable);
        }

        return this;
    },
    setCustomOrder: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $keyTable = ($sett.keyTable) ? $sett.keyTable : '';
        let $customData = ($sett.customData) ? $sett.customData : '';
        let $customType = ($sett.customType) ? $sett.customType : 'radio';

        let $wrap = $el.querySelector('div.hztable-filter-wrap');
        if( !$wrap ){
            console.log('Error 03: filter wrap not found! Ex: .hztable-filter-wrap');
            return this;
        }
        if(Object.keys($customData).length > 0){
            for (const [$key, $orderData] of Object.entries($customData)) {

                let $elTable = document.createElement('ul');
                $elTable.setAttribute('class', 'hztable-filter-custom hztable-filter-' + $key);
                $elTable.setAttribute('title', $key);
                $elTable.setAttribute('data-key', $key);
                
                for (const [$k, $v] of Object.entries($orderData)) {
                    let $th = document.createElement('li');
                    $th.setAttribute('data-key', $k);
                    $th.setAttribute('data-title', $v.txt);
                    if( $v.default === true ){
                        $th.classList.add('hz-active');
                        $elTable.setAttribute('data-value', $k);
                    }
                    if( $v.icon != ''){
                        let $label = document.createElement('i');
                        $label.setAttribute('class', $v.icon);
                        $th.appendChild($label);
                    } else {
                        $th.innerHTML = $v.txt;
                    }
                    $th.addEventListener('click', function(){
                        let $this = this;
                        let $value = $this.getAttribute('data-key');
                        if( $customType == 'checkbox' ){
                            let $predt = $elTable.getAttribute('data-value');
                            let $dtSplit = $predt.split(',');

                            if( $dtSplit.includes($value) ){
                                const $index = $dtSplit.indexOf($value);
                                if ($index > -1) { 
                                    $dtSplit.splice($index, 1);
                                }
                            } else {
                                $dtSplit.push( $value );
                            }
                            
                            $elTable.setAttribute('data-value', $dtSplit.join(',') );
                        }else{
                            $elTable.setAttribute('data-value', $value);
                        }
                        
                        $elTable.querySelectorAll('li').forEach( $v1 => {
                            if( $customType == 'radio' ){
                                $v1.classList.remove('hz-active');
                            } 
                        });
                        if( $customType == 'checkbox' ){
                            $this.classList.toggle('hz-active');
                        } else {
                            $this.classList.add('hz-active');
                        }
                       

                        $hJsDataTable.getOutput( $el );
                    });
                    
                    $elTable.appendChild($th);
                }

                $wrap.appendChild($elTable);
            }
        }
    },
    setPerPage: function( $el ){

        let $sett = $hJsDataTable.getSettings( $el );
        let $per_page_type = ($sett.per_page_type) ? $sett.per_page_type : false;
        let $keyTable = ($sett.keyTable) ? $sett.keyTable : '';
        let $per_page_data = ($sett.per_page_data) ? $sett.per_page_data : {};
        let $per_page = ($sett.per_page) ? $sett.per_page : 10;

        if(!$per_page_type){
            return this;
        }

        let $wrap = $el.querySelector('div.hztable-pagination-wrap');
        if( !$wrap ){
            console.log('Error 02: pagination wrap not found! Ex: .hztable-pagination-wrap');
            return this;
        }

        if(Object.keys($per_page_data).length > 0){
            let $div = document.createElement('div');
            $div.setAttribute('class', 'hztable-perpage-wrap');
            $div.innerHTML = '<span>Rows per page:</span>';

            let $elTable = document.createElement('select');
            $elTable.setAttribute('class', 'hztable-filter-perpage');
            $elTable.setAttribute('data-value', $per_page);
            $elTable.setAttribute('title', 'Rows per page');

            $elTable.addEventListener('change', function(){
                let $this = this;
                let $value = $this.value;
                $elTable.setAttribute('data-value', $value);

                $hJsDataTable.getOutput( $el );
            });

            for (const [$k, $v] of Object.entries($per_page_data)) {
                let $th = document.createElement('option');
                $th.setAttribute('value', $k);
                $th.innerHTML = $v;
                if( $per_page == $k){
                    $th.setAttribute('selected', 'selected');
                }
                $elTable.appendChild($th);
            }

            $div.appendChild($elTable);

            $wrap.appendChild($div);
        }
        return this;
    },
    setPagination: function( $el ){
        let $sett = $hJsDataTable.getSettings( $el );
        let $keyTable = ($sett.keyTable) ? $sett.keyTable : '';
        let $pagination = ($sett.pagination) ? $sett.pagination : false;
        let $per_page = ($sett.per_page) ? $sett.per_page : 10;
        let $defaultPaged = ($sett.defaultPaged) ? $sett.defaultPaged : 0;

        let $wrap = $el.querySelector('div.hztable-pagination-wrap');
        if( !$wrap ){
            console.log('Error 02: pagination wrap not found! Ex: .hztable-pagination-wrap');
            return this;
        }

        let $loadmore = document.createElement('a');
            $loadmore.setAttribute('class', 'hztable-loadmore-action');
            $loadmore.setAttribute('data-offset', $defaultPaged);

            let $icon = document.createElement('i');
            $icon.setAttribute('class', 'dashicons dashicons-update-alt');
            $loadmore.appendChild($icon);

            $loadmore.innerHTML += 'Load More';
            $wrap.appendChild($loadmore);

        let $elTable = document.createElement('div');
            $elTable.setAttribute('class', 'tablenav-pages');
        
        let $span = document.createElement('span');
            $span.setAttribute('class', 'displaying-num');
            $elTable.appendChild($span);  
        
        let $a1 = document.createElement('a');
            $a1.setAttribute('class', 'first-page button');
            $a1.setAttribute('data-key', $keyTable);
            $a1.setAttribute('data-paged', '0');
            $a1.removeEventListener('click', $hJsDataTable.pagedAction);
            $a1.addEventListener('click', $hJsDataTable.pagedAction);
            
            let $a1_1 = document.createElement('span');
            $a1_1.setAttribute('class', 'screen-reader-text');
            $a1_1.innerHTML = 'First page';
            $a1.appendChild($a1_1);

            let $a1_2 = document.createElement('span');
            $a1_2.setAttribute('aria-hidden', true);
            $a1_2.innerHTML = '«';
            $a1.appendChild($a1_2);

            $elTable.appendChild($a1);

        
        let $a2 = document.createElement('a');
            $a2.setAttribute('class', 'prev-page button');
            $a2.setAttribute('data-key', $keyTable);
            $a2.removeEventListener('click', $hJsDataTable.pagedAction);
            $a2.addEventListener('click', $hJsDataTable.pagedAction);
            
            let $a2_1 = document.createElement('span');
            $a2_1.setAttribute('class', 'screen-reader-text');
            $a2_1.innerHTML = 'Previous page';
            $a2.appendChild($a2_1);

            let $a2_2 = document.createElement('span');
            $a2_2.setAttribute('aria-hidden', true);
            $a2_2.innerHTML = '‹';
            $a2.appendChild($a2_2);

            $elTable.appendChild($a2);

        let $input = document.createElement('span');
            $input.setAttribute('class', 'paging-input');
            $input.setAttribute('data-paged', '0');
            

            let $input_1 = document.createElement('label');
            $input_1.setAttribute('for', 'current-page-selector');
            $input_1.setAttribute('class', 'screen-reader-text');
            $input_1.innerHTML = 'Current Page';
            $input.appendChild($input_1);

            let $input_2 = document.createElement('input');
            $input_2.setAttribute('id', 'current-page-selector');
            $input_2.setAttribute('class', 'current-page');
            $input_2.setAttribute('type', 'text');
            $input_2.setAttribute('name', 'paged');
            $input_2.setAttribute('value', $defaultPaged);
            $input.appendChild($input_2);

            $input_2.addEventListener('keyup', function( e ){
                e.preventDefault();
                let $this = this;
                if($loadmore &&  $this.value != ''){
                    $loadmore.setAttribute('data-offset', $this.value);
                    $loadmore.classList.remove('nxdisabled');

                    $hJsDataTable.getOutput( $el );
                }
            });
        

            let $input_3 = document.createElement('span');
            $input_3.setAttribute('class', 'tablenav-paging-text');
            $input_3.innerHTML = 'of <span class="total-pages"></span>';
            $input.appendChild($input_3);

            $elTable.appendChild($input);

        
        let $b2 = document.createElement('a');
            $b2.setAttribute('class', 'next-page button');
            $b2.setAttribute('data-key', $keyTable);
            $b2.removeEventListener('click', $hJsDataTable.pagedAction);
            $b2.addEventListener('click', $hJsDataTable.pagedAction);
            
            let $b2_1 = document.createElement('span');
            $b2_1.setAttribute('class', 'screen-reader-text');
            $b2_1.innerHTML = 'Next page';
            $b2.appendChild($b2_1);

            let $b2_2 = document.createElement('span');
            $b2_2.setAttribute('aria-hidden', true);
            $b2_2.innerHTML = '›';
            $b2.appendChild($b2_2);

            $elTable.appendChild($b2);

        let $b1 = document.createElement('a');
            $b1.setAttribute('class', 'last-page button');
            $b1.setAttribute('data-paged', '1');
            $b1.setAttribute('data-key', $keyTable);
            $b1.removeEventListener('click', $hJsDataTable.pagedAction);
            $b1.addEventListener('click', $hJsDataTable.pagedAction);
            
            let $b1_1 = document.createElement('span');
            $b1_1.setAttribute('class', 'screen-reader-text');
            $b1_1.innerHTML = 'Last page';
            $b1.appendChild($b1_1);

            let $b1_2 = document.createElement('span');
            $b1_2.setAttribute('aria-hidden', true);
            $b1_2.innerHTML = '»';
            $b1.appendChild($b1_2);

            $elTable.appendChild($b1);

            // load more option
            $loadmore.addEventListener('click', function( $e){
                $e.preventDefault();
                var $this = this;
                $this.classList.add('nxdisabled');

                var $offset = Number($this.getAttribute('data-offset')) + 1;
                $this.setAttribute('data-offset', $offset);

                var $current = $elTable.querySelector('.current-page');
                if( $current ){
                    $current.value = $offset;
                }
                $hJsDataTable.getOutput( $el );

            });

            $wrap.appendChild($elTable);

        return this;
    },
    pagedAction: function( e ){
        e.preventDefault();
        var $this = this;
        var $parent = $this.parentElement;

        var $key = $this.getAttribute('data-key');
        var $el = document.querySelector('[data-hztable="'+$key+'"]');

        var $paged = $this.getAttribute('data-paged');
        var $loadmore = $parent.parentElement.querySelector('a.hztable-loadmore-action');
        var $current = $parent.querySelector('.current-page');
        
        var $firstToal = $parent.querySelector('.first-page').getAttribute('data-paged');
        var $lastToal = $parent.querySelector('.last-page').getAttribute('data-paged');
                              
        if($paged && $paged != ''){

            $loadmore.setAttribute('data-offset', $paged);
            if( $current){
                if( $paged == 0){
                    $paged = 1;
                }
                $current.value = $paged;
            }
        } else {
            if( $this.classList.contains('prev-page') ){
                var $paged = Number($current.value) - 1;
                if( $firstToal > $paged){
                    $paged = $firstToal;
                }
                $loadmore.setAttribute('data-offset', $paged);
                if( $current){
                    if( $paged == 0){
                        $paged = 1;
                    }
                    $current.value = $paged;
                }
            } else {
                var $paged = Number($current.value) + 1;
                if( $lastToal < $paged){
                    $paged = $lastToal;
                }
                $loadmore.setAttribute('data-offset', $paged);
                if( $current){
                    if( $paged == 0){
                        $paged = 1;
                    }
                    $current.value = $paged;
                }
            }
        }
        $hJsDataTable.getOutput( $el );
        $loadmore.classList.remove('nxdisabled');
    },
    getOutput: function( $el ){
       
        let $sett = $hJsDataTable.getSettings( $el );
        let $renderEl = ($sett.renderEl) ? $sett.renderEl : '.hztbody';
        let $perpage = ($sett.per_page) ? $sett.per_page : 10;
        let $defaultPaged = ($sett.defaultPaged) ? $sett.defaultPaged : 0;

        
        $renderEl = $el.querySelector($renderEl);
        if( !$renderEl ){
            console.log('Error 01: Table Render Element not found! Ex: .hztbody');
            return;
        }
        var $order = 'DESC';
        var $ordr = $el.querySelector('.hztable-filter-order');
        if($ordr){
            $order = $ordr.getAttribute('data-value');
        }

        var $keyword = '';
        var $search = $el.querySelector( '.hztable-filter-search > input');
        if($search){
            $keyword = $search.value;
        }

        var $perpageEl = $el.querySelector( 'select.hztable-filter-perpage');
        if($perpageEl){
            $perpage = $perpageEl.value;
        }

        var $type = 'remove';
        var $offset = $defaultPaged;
        var $loadmore = $el.querySelector('a.hztable-loadmore-action');
        if($loadmore){
            $offset = $loadmore.getAttribute('data-offset');
            if( $loadmore.classList.contains('nxdisabled') ){
                $type = 'append';
            }
        }
        var $refresh = $el.querySelector('button.hztable-filter-refresh');
        if($refresh){
            if( $refresh.classList.contains('refresh-mode') ){
                $type = 'remove';
            }
        }
        
        var myObj = {
            'params' : {
                'order': $order,
                'keyword': $keyword,
                'per_page': $perpage,
                'offset': $offset,
            },
            'wrap' : $el,
            'outputEl' : $renderEl,
            'renderType' : $type,
            'totalCountEl' : $el.querySelector('.displaying-num'),
            'totalPagesEl' : $el.querySelector('.total-pages'),
            'loadmMoreEl' : $el.querySelector('.hztable-loadmore-action'),
            'firstPaged' : $el.querySelector('.first-page'),
            'lastPaged' : $el.querySelector('.last-page'),
        };

        let $custom = $el.querySelectorAll('.hztable-filter-custom');
        if( $custom.length > 0){
            $custom.forEach( $v => {
                let $key = $v.getAttribute('data-key');
                let $value = $v.getAttribute('data-value');
                myObj.params[$key] = $value;
            });
        }

        $refresh.classList.remove('refresh-mode');
        $loadmore.classList.remove('nxdisabled');

        var event = new Event("hztable_output");
        event.data = myObj;
        $el.dispatchEvent(event);

        return event;
    },
    getSettings: function( $el ){
        let $default = {
            thead: false,
            theadData: {},
            theadEl: 'hzthead',

            tfoot: false,
            tfootData: {},
            tfootEl: 'hztfoot',

            tbody: true,
            tbodyEl: 'hztbody',
            renderEl: '.hztbody',

            className: '',
            idName: '',

            order: true,
            orderData: {
                'ASC' : {
                    'txt' : 'ASC',
                    'icon' : 'dashicons dashicons-arrow-up-alt',
                },
                'DESC' : {
                    'txt' : 'DESC',
                    'icon' : 'dashicons dashicons-arrow-down-alt',
                },
            },
            orderDefault: 'DESC',
            
            refresh: false,
            refreshEl: 'dashicons dashicons-image-rotate',
            refreshTxt: 'Refresh',

            searchbox: true,
            searchTxt: 'Keyword...',
            pagination: true,

            per_page_type: true,
            per_page_data: {
                '5' : '5',
                '10' : '10',
                '25' : '25',
                '50' : '50',
                '100' : '100',
                '150' : '150',
                '250' : '250',
                '500' : '500',
            },
            per_page : 10,
            defaultPaged: 0,

            customType: 'radio', // radio, checkbox
            customData: {},
        };

        let $settings = $el.getAttribute('data-hztable-settings');
        if( !$settings ){
            $el.setAttribute('data-hztable-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {
            keyTable: $el.getAttribute('data-hztable')
        };
        if( Object.entries($default) ){ 
            for (const [$k, $v] of Object.entries($default)) {
                $neSettings[$k] = ($settings[$k]) ? $settings[$k] : $default[$k];
            }
        }
       
        return $neSettings;
    }
    
}

//$hJsDataTable.init( '.easysmtp-logs-data');
