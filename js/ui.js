document.addEventListener('DOMContentLoaded',()=>{
    let today = new Date();
    console.log('script_' + today.getHours() + today.getMinutes() + today.getSeconds() );
});

var jsonURL = (window.location.host.length > 0) ? '../json/mockup.json' : 'https://iloveisyou.github.io/hirun2024/json/mockup.json';

function uiRUI(ruiObj=false) {
    // const _rui = ruiObj;
    // const _rname = (_rui+'').split('.');
    const _rui = ruiObj;
    const _rname = (_rui+'').split('.');
    
    if(_rname[0]!=='Rui') { return false; }  
    // console.log(_rui);

    // rui > form
    if(_rname[2]==='form') {
        const _jthis = $(`#${_rui.id}`);
        const _jid = `#${_rui.id}`;
        const _jhtml= $('html');

        // focus 체크
        _jhtml.on('focusin', _jid, function(e) { fmFocus(e, _rui); });
        _jhtml.on('focusout', _jid, function(e) { fmFocusout(e, _rui); });
        
        // rui > form > input type=textbox
        if(_rname[3].split(' ')[0]==='LTextBox') {
            
            fmLabel(_jthis, _rui);  // label grid

            // value 체크
            _jhtml.on('change paste keyup', _jid + ' input:not([type=hidden])', function(e) {
                fmValue(e, _rui);
            });
            
            // rui > form > input type=textbox > auto complete
            if(_rui.autoComplete){
                fmOptionBox(_jthis, _rui);  // option box
            }
        }

        // rui > form > input type=databox
        if(_rname[3].split(' ')[0]==='LDateBox') {
            fmLabel(_jthis, _rui);  // label grid
            fmDatePicker(_jthis, _rui);  // date picker box 
        }
        
        // rui > form > input type=checkbox, single
        if(_rname[3].split(' ')[0]==='LCheckBox') {
            fmWrapIdChange(_jthis, _rui);  // input parent id change
        }
        
        // rui > form > input type=checkbox, group
        if(_rname[3].split(' ')[0]==='LCheckBoxGroup') {
            fmWrapIdChange(_jthis, _rui);  // input parent id change
        }

        // rui > form > radio type=radio
        if(_rname[3].split(' ')[0]==='LRadio') {
            fmWrapIdChange(_jthis, _rui);  // input parent id change
        }
        
        // rui > form > radio type=radio, group
        if(_rname[3].split(' ')[0]==='LRadioGroup') {
            fmWrapIdChange(_jthis, _rui);  // input parent id change
        }
        /*
        // rui > form > combo type=default
        if(_rname[3].split(' ')[0]==='LCombo') {
            const j_option = $(`#${_rui.optionDivEl.id}`);
            j_opt
            ion.css('width', j_this.width() + 'px'); // 옵션 박스 넓이 재설정
        }
        */
    }
}

// form > focus
function fmFocus(e, _rui = false) {
    const jthis = $(e.currentTarget), rui = _rui; 
    if(e.target.attributes.type.value === 'checkbox' || e.target.attributes.type.value === 'radio') { return false; }

    !jthis.hasClass('is-focus') && jthis.addClass('is-focus');
}

// form > focusout
function fmFocusout(e, _rui = false) {
    const jthis = $(e.currentTarget), rui = _rui; 
    if(e.target.attributes.type.value === 'checkbox' || e.target.attributes.type.value === 'radio') { return false; }

    jthis.hasClass('is-focus') && jthis.removeClass('is-focus');
}

// form > change paste keyup
function fmValue(e, _rui = false) {
    const jthis = $(e.currentTarget), rui = _rui; 

    if(jthis.val() !== '' && jthis.val().length > 0){
        !jthis.parent('[class*="fm_"]').hasClass('is-value') && jthis.parent('[class*="fm_"]').addClass('is-value');
    }else {
        jthis.parent('[class*="fm_"]').hasClass('is-value') && jthis.parent('[class*="fm_"]').removeClass('is-value');
    }
}

//form > label grid
function fmLabel(_jthis, _rui = false) {
    const jthis = _jthis, rui = _rui; 
    if(!rui) { return false; }

    rui.label && jthis.append(`<label for="${rui.inputEl.id}">${rui.label}</label>`)
}

// form > option (combo, auto complete)
function fmOptionBox(_jthis, _rui = false) {
    const jthis = _jthis, rui = _rui; 
    if(!rui) { return false; }

    const joption = $(rui.optionDivEl.dom)
    rui.optionDivEl && joption.css('width', jthis.width() + 'px'); // 옵션 박스 넓이 재설정
}

// from > date picker box
function fmDatePicker(_jthis, _rui = false) {
    const jthis = _jthis, rui = _rui; 
    if(!rui) { return false; }

    const jdatePicker = $(rui?.calendarDivEl?.dom);
    rui?.calendarDivEl?.dom && jdatePicker.css('transform', `translateX(${jthis.outerWidth(true) - jdatePicker.outerWidth(true)}px)`); // 날짜선택 박스 위치 재설정
}


// form > checkbox wrap id change
function fmWrapIdChange(_jthis, _rui = false) {
    const jthis = _jthis, rui = _rui; 
    if(!rui) { return false; }

    $.each(jthis.find('input[type="checkbox"], input[type="radio"]'), function(i,el){
        console.log(el)
        $(el).parent('.L-form-field').attr('id') && $(el).parent('.L-form-field').attr('id', `${$(el).parent('.L-form-field').attr('id')}_wrap`);
    })
    
}