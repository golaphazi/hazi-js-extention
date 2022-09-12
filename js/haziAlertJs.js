"use strict";
/**
* Name: HaziJs Alert Js
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @HaziJs
* Author: https://github.com/golaphazi
* Developer: Hazi
*/
var $hJsAlert = {
    init: function( $heading, $desc, $type ){
        let $body = document.querySelector('body');
        if( $body ){
            let $mes = document.createElement('div');
            $mes.setAttribute('class', 'hzalert-meassage nxfade');

            let $dialog = document.createElement('div');
            $dialog.setAttribute('class', 'hzalert-dialog hzalert-modal');

            if( $type == 'success'){
                let $success = document.createElement('span');
                $success.setAttribute('class', 'dashicons dashicons-saved hzalert-icon hzalert-success');
                $dialog.appendChild($success);
            }

            if( $type == 'error'){
                let $success = document.createElement('span');
                $success.setAttribute('class', 'dashicons dashicons-no hzalert-icon hzalert-error');
                $dialog.appendChild($success);
            }

            if( $type == 'warning'){
                let $success = document.createElement('span');
                $success.setAttribute('class', 'dashicons dashicons-warning hzalert-icon hzalert-warning');
                $dialog.appendChild($success);
            }

            if( $type == 'info'){
                let $success = document.createElement('span');
                $success.setAttribute('class', 'dashicons dashicons-info hzalert-icon hzalert-info');
                $dialog.appendChild($success);
            }

            if( $type == 'question'){
                let $success = document.createElement('span');
                $success.setAttribute('class', 'dashicons dashicons-bell hzalert-icon hzalert-question');
                $dialog.appendChild($success);
            }

            /*heading */
            if( $heading != ''){
                let $head = document.createElement('h2');
                $head.setAttribute('class', 'hzalert-title');
                $head.innerHTML = $heading;
                $dialog.appendChild($head);
            }
            

            /*desc */
            if( $desc != ''){
                let $sub = document.createElement('span');
                $sub.setAttribute('class', 'hzalert-desc');
                $sub.innerHTML = $desc;
                $dialog.appendChild($sub);
            }

            /* button */
            let $button = document.createElement('button');
            $button.setAttribute('class', 'hzalert-button');
            $button.innerText = 'Ok';
            $button.removeEventListener("click", this.close_alert);
            $button.addEventListener("click", this.close_alert);

            $dialog.appendChild($button);

            $mes.appendChild($dialog);
            $body.appendChild($mes);
        }
    },
    close_alert: function( event){
        event.preventDefault();
        let $body = document.querySelector('body > .hzalert-meassage');
        if( $body ){
            $body.remove();
        }
    },
    
    close_auto: function( $time ){
        let $body = document.querySelector('body > .hzalert-meassage');
        if( $body ){
            setTimeout(function(){
                $body.remove();
            }, $time);
        }
    }
}

//$hJsAlert.init();
