document.addEventListener('DOMContentLoaded',()=>{
    let today = new Date();
    console.log('script_' + today.getHours() + today.getMinutes() + today.getSeconds() );
});

var jsonURL = (window.location.host.length > 0) ? '../json/mockup.json' : 'https://iloveisyou.github.io/hirun2024/json/mockup.json';


/*********************************************************/
/********************** 폼요소 제어 **********************/
/*********************************************************/
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

        // rui > form > input type=monthbox
        if(_rname[3].split(' ')[0]==='LMonthBox') {
            fmLabel(_jthis, _rui);  // label grid
            fmDatePicker(_jthis, _rui);  // date picker box 
        }
        
        // rui > form > input type=timebox
        if(_rname[3].split(' ')[0]==='LTimeBox') {
            fmLabel(_jthis, _rui);  // label grid
        }
        
        // rui > form > input type=datetimebox
        if(_rname[3].split(' ')[0]==='LDateTimeBox') {
            fmLabel(_jthis, _rui);  // label grid
        }

        // rui > form > input type=fromtodatebox
        if(_rname[3].split(' ')[0]==='LFromToDateBox') {
            fmLabel(_jthis, _rui);  // label grid
            fmDatePicker(_jthis, _rui);  // date picker box 
        }
        
        // rui > form > input type=numberbox
        if(_rname[3].split(' ')[0]==='LNumberBox') {
            fmLabel(_jthis, _rui);  // label grid
            fmDatePicker(_jthis, _rui);  // date picker box 
        }
        
        // rui > form > input type=popupbox
        if(_rname[3].split(' ')[0]==='LPopupTextBox') {
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
        
        // rui > form > combo type=default
        if(_rname[3].split(' ')[0]==='LCombo') {
            fmLabel(_jthis, _rui);  // label grid
            fmOptionBox(_jthis, _rui);  // option box
        }
        
        // rui > form > combo type=mutlti
        if(_rname[3].split(' ')[0]==='LMultiCombo') {
            fmLabel(_jthis, _rui);  // label grid
            fmOptionBox(_jthis, _rui);  // option box
        }
    }
}

// form > focus
function fmFocus(e, _rui = false) {
    const jthis = $(e.currentTarget), rui = _rui; 
    if(e?.target?.attributes?.type?.value === 'checkbox' || e?.target?.attributes?.type?.value === 'radio') { return false; }

    !jthis.hasClass('is-focus') && jthis.addClass('is-focus');
}

// form > focusout
function fmFocusout(e, _rui = false) {
    const jthis = $(e.currentTarget), rui = _rui; 
    if(e?.target?.attributes?.type?.value === 'checkbox' || e?.target?.attributes?.type?.value === 'radio') { return false; }

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

    rui.label && jthis.append(`<label for="${rui.inputEl?.id || rui.startDateBox?.inputEl?.id}">${rui.label}</label>`)
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
        $(el).parent('.L-form-field').attr('id') && $(el).parent('.L-form-field').attr('id', `${$(el).parent('.L-form-field').attr('id')}_wrap`);
    })
    
}


/*********************************************************/
/**********************  공통 제어  **********************/
/*********************************************************/
let ui = (function(window, document, $) {
    'use strict';

    function gnb() {
        let jthis = $('.gnb');
        let slide = jthis.find('.slider');

        gnbInit();
        // jthis.off('mouseenter').on('mouseenter', function(ev){
            // !$(this).hasClass('is-active') && $(this).addClass('is-active');
            console.log('2222222')

            // $(this).find('li').each(function(i,li){
        jthis.find('li').each(function(i,li){

            $(li).off('mouseover').on('mouseover', function(liEv){


                $(this).siblings('.is-active').removeClass('is-active');
                !$(this).hasClass('is-active') && $(this).addClass('is-active');
                !jthis.hasClass('is-active') && jthis.addClass('is-active');

                
                gnbSlider(i,this);
                
                $(this).find('dl>div').each(function(j,div){
                    $(div).off('mouseover').on('mouseover', function(divEv){
                        !$(this).hasClass('is-active') && $(this).addClass('is-active');
                        $(this).find('dd').each(function(k, dd) {
                            $(dd).off('mouseover').on('mouseover', function(ddEv){
                                $(this) !== $(this).parents('div').find('dd.is-active') && $(this).parents('div').find('dd.is-active').removeClass('is-active')
                                !$(this).hasClass('is-active') && $(this).addClass('is-active');
                            });
                            $(dd).off('mouseout').on('mouseout', function(ddEv){
                                $(this).hasClass('is-active') && $(this).removeClass('is-active');
                                gnbInit();
                            });
                        });
                    });
                    $(div).off('mouseout').on('mouseout', function(liEv){
                        $(this).hasClass('is-active') && $(this).removeClass('is-active');
                    });
                });
            });
            $(li).off('mouseout').on('mouseout', function(liEv){
                $(this).hasClass('is-active') && $(this).removeClass('is-active');
                jthis.hasClass('is-active') && jthis.removeClass('is-active');
                gnbInit();
            });
        });

        // });
        // jthis.off('mouseleave').on('mouseleave', function(ev){
        //     $(this).hasClass('is-active') && $(this).removeClass('is-active');
        // });

        function gnbInit() {
            jthis.find('li[data-active="true"]:not(.is-active)').addClass('is-active');
            jthis.find('dd[data-active="true"]:not(.is-active)').addClass('is-active');
            gnbSlider(jthis.find('li').index(jthis.find('li.is-active')), jthis.find('li.is-active'));
            // console.log(jthis.find('li').index(jthis.find('li.is-active')));
        }
        function gnbSlider(i,el) {
            let slideX = 0;
            $(el).parents('ul').find('li').each(function(j,item){
                if(j < i) {
                    slideX += parseInt($(item).outerWidth()) + 10;
                }
            });
            slide.css({'transform':`translateX(${slideX}px)`, 'width':`${$(el).outerWidth()}px`});
        }
    }
    function tab() {
        console.log('tab')
    }

    let stimer, userMouse = true, userMouseTimer, userMouseStatus;
    function sectionTimer(time,clear,callback) {
        let currentTime = time;
        let target = '.sectionTimer';
        if(clear == true) { clearInterval(stimer); }

        counterInit();
        setInterval(function(){
            if(userMouse){
                currentTime = time+1;
                userMouseTimer = setTimeout(stimerStart, 3000);
                userMouse=false;
            }
        },1000);
        
        $(window).off().on('mousemove', function(){
            clearTimeout(userMouseTimer);
            userMouse = true;
        });

        function counterInit() { $(target).text(((~~(currentTime/60)) < 10 ? ('0'+~~(currentTime/60)) : ~~(currentTime/60)) + ' : ' + ((~~(currentTime%60)) < 10 ? ('0'+~~(currentTime%60)) : ~~(currentTime%60))); }
        function counter() {
            currentTime=currentTime-1;
            $(target).text(((~~(currentTime/60)) < 10 ? ('0'+~~(currentTime/60)) : ~~(currentTime/60)) + ' : ' + ((~~(currentTime%60)) < 10 ? ('0'+~~(currentTime%60)) : ~~(currentTime%60)));
            if(currentTime <= 10) { 
                !$(target).hasClass('is-warning') && $(target).addClass('is-warning');
            }else{
                $(target).hasClass('is-warning') && $(target).removeClass('is-warning');
            }
            if(currentTime == 0) { clearInterval(stimer); setTimeout(()=>alert('로그아웃되었습니다.'),100) }
        }
        function stimerStart() { 
            clearInterval(stimer);
            stimer = setInterval(counter,1000); 
        }
    }

    function dialog() {}
    

    return {
        gnb,
        tab,
        sectionTimer,
        dialog,
    }
})(window, document, jQuery);

// DOMContentLoaded
$(function() {
    // ui.gnb();
});

$(window).on('load', function(){
    ui.gnb();
    ui.tab();
    // $('.cp_dialog').addClass('is-active');
});



// text
function alarm() {
    // $('.sectionTimer').toggleClass('is-warning');
    // ui.sectionTimer('.sectionTimer',10);
    ui.sectionTimer(14,true);
    
}