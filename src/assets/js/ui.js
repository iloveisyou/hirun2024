'use strict';

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
    });
    
}


/*********************************************************/
/**********************  공통 유틸  **********************/
/*********************************************************/
// 인뎃스 구하기
const index=(element)=> element && [].indexOf.call(element?.parentElement?.children, element);


/*********************************************************/
/**********************  공통 제어  **********************/
/*********************************************************/
var uiux = (function(window, document, $) {
    'use strict';

    // 공통 변수 설정
    let _html = document.querySelector('.pj-hirun'); // 전체래퍼
    let stimer, userMouse = true, userMouseTimer, userMouseStatus; // 로그인섹션 변수
    window.addEventListener('DOMContentLoaded', function(){
        _html = document.querySelector('.pj-hirun');
    });

    function scroll() { // 스크롤 이벤트 공통
        window.addEventListener('scroll', function(e) {
            if(window.scrollY > 20) {
                !_html.classList.contains('sc-headerSmall') && _html.classList.add('sc-headerSmall'); 
            }else {
                _html.classList.contains('sc-headerSmall') && _html.classList.remove('sc-headerSmall'); 
            }
        });
    }

    function integratedSearch() { // 헤더 통합검색
        let _this = document.querySelector('.cp_integratedSearch');
        let _trigger = document.querySelector('.bt_headerUtil.integratedSearch');
        if(!_this) { return false; } 

        _trigger.addEventListener('click', function(e) {
            e.preventDefault();
            !_this.classList.contains('is-active') && _this.classList.add('is-active');
        })
        _this.querySelector('.bt_ntegratedSearchClose').addEventListener('click', function() {
            _this.classList.contains('is-active') && _this.classList.remove('is-active');
        });
        _this.querySelectorAll('.keyword dd').forEach(function(el,i) {
            el.addEventListener('mouseover', function(e) {
                _this.querySelector('input').value = `${e.currentTarget.innerHTML}을 검색해볼까?`;
            });
            el.addEventListener('mouseout', function(e) {
                _this.querySelector('input').value = ``;
            });
        });
    }
    
    function gnb() { // gnb 이벤트
        const _this = document.querySelector('.gnb');
        let _slide;
        if(!_this) { return false; } 

        const gnbInit=()=> {
            _this.querySelector('li[data-active="true"]:not(.is-active)')?.classList.add('is-active');
            _this.querySelector('dd[data-active="true"]:not(.is-active)')?.classList.add('is-active');
            _this.querySelector('li.is-active') && gnbSlider(index(_this.querySelector('li.is-active')), _this.querySelector('li.is-active'));
            if((_this.querySelector('.slider')) && !_this.querySelector('li.is-active')) {
                window.addEventListener('mouseover',e=>{
                    !e.target.closest('.gnb') && _slide.remove();
                });
            } 
            
        };
        
        const gnbSlider=(idx,target)=> {
            let slideX = 0;
            
            target.closest('ul').querySelectorAll('li').forEach(function(el,i){
                if(i < idx) { slideX += parseInt(el.getBoundingClientRect().width) + 10; }
            });
            if(!(!!_this.querySelector('.slider'))) {
                _this.insertAdjacentHTML('beforeend', '<div class="slider"></div>');
            } 
            _slide = _this.querySelector('.slider');
            _slide.style.transform = `translateX(${slideX}px)`;
            _slide.style.width = `${target.getBoundingClientRect().width}px`;
        };

        gnbInit();
        _this.querySelectorAll('li').forEach(function(el,i){
            el.addEventListener('mouseover', function(e){
                gnbSlider(i,e.currentTarget);
            });
            el.addEventListener('mouseout', function(e){
                gnbInit(e);
            });
        });
    }


    function tab() { // 탭 이벤트
        console.log('tab');
    }


    function sectionTimer(time,clear,callback) { // 로그인 섹션 이벤트
        let currentTime = time;
        const target = document.querySelector('.sectionTimer');
        if(clear == true) { clearInterval(stimer); }
        const counterInit=()=> { target.innerHTML = ((~~(currentTime/60)) < 10 ? ('0'+~~(currentTime/60)) : ~~(currentTime/60)) + ' : ' + ((~~(currentTime%60)) < 10 ? ('0'+~~(currentTime%60)) : ~~(currentTime%60)); };
        const counter=()=> {
            currentTime=currentTime-1;
            target.innerHTML = ((~~(currentTime/60)) < 10 ? ('0'+~~(currentTime/60)) : ~~(currentTime/60)) + ' : ' + ((~~(currentTime%60)) < 10 ? ('0'+~~(currentTime%60)) : ~~(currentTime%60));
            if(currentTime <= 10) { 
                !target.classList.contains('is-warning') && target.classList.add('is-warning');
            }else{
                target.classList.contains('is-warning') && target.classList.remove('is-warning');
            }
            if(currentTime == 0) { clearInterval(stimer); setTimeout(()=>alert('로그아웃되었습니다.'),100) }
        };
        const stimerStart=()=> { 
            clearInterval(stimer);
            stimer = setInterval(counter,1000); 
        };

        counterInit();
        setInterval(function(){
            if(userMouse){
                currentTime = time+1;
                userMouseTimer = setTimeout(stimerStart, 3000);
                userMouse=false;
            }
        },1000);
        window.addEventListener('mousemove', function(){
            clearTimeout(userMouseTimer);
            userMouse = true;
        });
    }

    function dialog() { // 다이알로그 공통
        const _this = document.querySelectorAll('.cp_dialog');

        _this.forEach((cp,i)=>{
            cp.querySelectorAll('.bt_dialogClose, .bt_cancel').forEach((el,j)=>{
                if(!el.getAttribute('onclick')){
                    el.addEventListener('click', (e)=>{
                        e.preventDefault();
                        cp.classList.contains('is-active') && cp.classList.remove('is-active');
                    });
                }
            });
        });
    }
    function dialogOpen(t) { // 다이알로그 열기 함수
        !document.querySelector(t)?.classList.contains('is-active') && document.querySelector(t)?.classList.add('is-active');
    }
    function dialogClose(t) { // 다이알로그 닫기 함수
        if(typeof(target) === 'string') {
            document.querySelector(t)?.classList.contains('is-active') && document.querySelector(t)?.classList.remove('is-active');
        }else {
            t.closest('.cp_dialog')?.classList.contains('is-active') && t.closest('.cp_dialog')?.classList.remove('is-active');
        }
    }

    function drag() {
        const _this = document.querySelectorAll('.nm-webMessenger .contact dd');

        _this.forEach((el,i)=>{
            console.log('작업예정')
        });
    }
    

    function form() { // 폼 이벤트
        const _fm = '[class*="fm_"]';
        const _this = document.querySelectorAll(_fm);

        const isFocus=(e)=>{
            e.preventDefault();
            !e.currentTarget.closest(_fm).classList.contains('is-focus') && e.currentTarget.closest(_fm).classList.add('is-focus');
        }
        const isFocusout=(e)=>{
            e.preventDefault();
            e.currentTarget.closest(_fm).classList.contains('is-focus') && e.currentTarget.closest(_fm).classList.remove('is-focus');
        }
        const isActive=(e)=>{
            // e.preventDefault();
            const _e = e.tagName ? e : e.target;
            !_e.closest(_fm).classList.contains('is-active') && _e.closest(_fm).classList.add('is-active');

            window.addEventListener('click',(ev)=>{
                if(ev.target.closest(_fm) != _e.closest(_fm)) {
                    isInactive(_e);
                } 
            });
        }
        const isInactive=(e)=>{;
            // e.preventDefault();
            const _e = e.tagName ? e : e.target;
            _e.closest(_fm)?.classList.contains('is-active') && _e.closest(_fm)?.classList.remove('is-active');
        }
        const isValue=(e)=>{
            let _wrap = e.tagName ? e.closest(_fm) : e.currentTarget.closest(_fm), 
                _input = e.tagName ? e : e.currentTarget;

            if(_input?.value.trim()) {
                !_wrap?.classList?.contains('is-value') && _wrap.classList.add('is-value');
            } else {
                _wrap?.classList?.contains('is-value') && _wrap.classList.remove('is-value');
            }
        }
        const clear=(e)=>{
            e.preventDefault();
            let _input = e.tagName ? e.closest(_fm).querySelector('input') : e.currentTarget.closest(_fm).querySelector('input');

            _input.value = '';
            isValue(_input);
        }
        const select=(e)=>{
            e.currentTarget.closest(_fm).querySelector('input').value = e.currentTarget.innerText;
            e.currentTarget.closest(_fm).querySelector('input').value ? e.currentTarget?.closest(_fm)?.classList?.add('is-value') : e.currentTarget?.closest(_fm)?.classList?.remove('is-value');
        }
        _this.forEach((el,i)=>{
            const _input = el.querySelector('input[type="text"]');
            const _inner = el.querySelector('.fmInner');
            const _clear = el.querySelector('.bt_form_clear');
            if(_input) {
                _input.value && isValue(_input);
                _input.addEventListener('change', isValue);
                _input.addEventListener('keyup', isValue);
                _inner.addEventListener('focusin', isFocus);
                _inner.addEventListener('focusout', isFocusout);
            } 
            if(_clear) {
                _clear.addEventListener('click', clear)
            }
            if(el?.classList?.contains('ty-select')) {
                
                el.querySelector('.select').addEventListener('click', isActive);
                el.querySelectorAll('.option li').forEach((li,i)=>{

                    li.addEventListener('click',function(e){
                        e.preventDefault();
                        select(e);
                        isInactive(e);
                    });
                });

            }
        });
    }
    function formClear(t) { // 폼 지우기
        t.closest(_fm).querySelector('input').value = '';
    }
    

    return {
        scroll,
        gnb,
        tab,
        sectionTimer,
        dialog, dialogOpen, dialogClose,
        integratedSearch,
        drag,
        form,
    }
})(window, document, jQuery);

// DOMContentLoaded
// $(function() {
//     // ui.gnb();
// });
window.addEventListener('DOMContentLoaded',()=>{

});


window.addEventListener('load', function(){
    uiux.scroll();
    uiux.gnb();
    uiux.tab();
    uiux.dialog();
    uiux.integratedSearch();
    uiux.drag();
    uiux.form();
    // document.querySelector('#workRegister').classList.add('is-active');
});



// text
function alarm() {
    // $('.sectionTimer').toggleClass('is-warning');
    // uiux.sectionTimer('.sectionTimer',10);
    uiux.sectionTimer(14,true);
    
}