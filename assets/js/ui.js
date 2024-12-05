document.addEventListener('DOMContentLoaded',()=>{
    let today = new Date();
    console.log('script_' + today.getHours() + today.getMinutes() + today.getSeconds() );
});

function uiRUI(ruiObj=false) {
    const _obj = ruiObj;
    const _rui = (_obj+'').split('.');
    console.log('uiRUI? '+_rui);
    
    if(_rui[0]!=='Rui') { return false; }  
    // console.log(_obj);

    // rui > form
    if(_rui[2]==='form') {
        const j_this = $(`#${_obj.id}`);

        // focus 체크
        j_this.on('focusin', function() { j_this.parents('.fm_text').addClass('is-focus'); });
        j_this.on('focusout', function() { j_this.parents('.fm_text').hasClass('is-focus') && j_this.parents('.fm_text').removeClass('is-focus'); });
        
        // rui > form > input type=textbox
        if(_rui[3].split(' ')[0]==='LTextBox') {
            
            // value 체크
            j_this.find('input:not([type=hidden])').on('change paste keyup', function() {
                if(j_this.find('input:not([type=hidden])').val() !== '' && j_this.find('input:not([type=hidden])').val().length > 0){
                    j_this.parent('.fm_text').addClass('is-value');
                }else {
                    j_this.parents('.fm_text').hasClass('is-value') && j_this.parents('.fm_text').removeClass('is-value');
                }
            });
            
            // rui > form > input type=textbox > auto complete
            if(_obj.autoComplete){
                const j_option = $(`#${_obj.optionDivEl.id}`);
                j_option.css('width', j_this.width() + 'px'); // 옵션 박스 넓이 재설정
            }
        }

        // rui > form > input type=databox
        if(_rui[3].split(' ')[0]==='LDateBox') {
            const j_option = $(`#${_obj.calendar.id}`);
            j_option.css('transform', `translateX(${j_this.outerWidth(true) - j_option.outerWidth(true)}px)`); // 날짜선택 박스 위치 재설정
        }
        
        // rui > form > input type=checkbox
        if(_rui[3].split(' ')[0]==='LCheckBox') {
        }
        
        // rui > form > radio type=radio
        if(_rui[3].split(' ')[0]==='LRadio') {
        }
        
        // rui > form > combo type=default
        if(_rui[3].split(' ')[0]==='LCombo') {
            const j_option = $(`#${_obj.optionDivEl.id}`);
            j_option.css('width', j_this.width() + 'px'); // 옵션 박스 넓이 재설정
        }
    }
}