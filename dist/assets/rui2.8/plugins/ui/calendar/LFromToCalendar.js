/*
 * @(#) LFromToCalendar.js
 *
 * DevOn RUI
 * Build Version : 2.8
 * 
 * Copyright ⓒ LG CNS, Inc. All rights reserved.
 *
 * DevOn RUI의 모든 저작물은 LG CNS 의 지적재산입니다.
 * LG CNS로 부터 허가 받지 않은 경우 사용, 열람, 복사, 수정, 재배포 할 수 없으며 외부로의 유출을 금지합니다.
 * 특히 소스 코드를 수정하는 경우 기술 지원의 대상이 되지 않을 수 있습니다.
 * 자세한 사항은 계약사항에 따릅니다. 기타 사항은 devon@lgcns.com 으로 문의 하십시오.
 *
 * Do Not Erase This Comment!!! (이 주석문을 지우지 말것)
 *
 * rui/license.txt를 반드시 읽어보고 사용하시기 바랍니다. License.txt파일은 절대로 삭제하시면 안됩니다. 
 *
 * 1. 사내 사용시 KAMS를 통해 요청하여 사용허가를 받으셔야 소프트웨어 라이센스 계약서에 동의하는 것으로 간주됩니다.
 * 2. DevOn RUI가 포함된 제품을 판매하실 경우에도 KAMS를 통해 요청하여 사용허가를 받으셔야 합니다.
 * 3. KAMS를 통해 사용허가를 받지 않은 경우 소프트웨어 라이센스 계약을 위반한 것으로 간주됩니다.
 * 4. 별도로 판매될 경우는 LGCNS의 소프트웨어 판매정책을 따릅니다.
 * 
 * (추가) Plugin 하위 목록에 포함된 파일의 경우 프로젝트에서 임의로 customizing 해서 사용 가능합니다.
 * 단, 프로젝트에서 customizing 한 사항은 기술지원 대상 범위에서 제외됩니다.
 * 
 */

Rui.ui.calendar.LFromToCalendar = function(config) {
    Rui.ui.calendar.LFromToCalendar.superclass.constructor.call(this, config);
    this.createEvent('select');
};
Rui.extend(Rui.ui.calendar.LFromToCalendar, Rui.ui.LPanel, {
    otype: 'Rui.ui.form.LFromToCalendar',
    CSS_BASE: 'L-fromtocalendar',
    doRender: function(container) {
        Rui.ui.calendar.LFromToCalendar.superclass.doRender.call(this, container);
        Rui.util.LDom.addClass(this.element, 'L-fromtocalendar-panel');
        Rui.util.LDom.setStyle(this.element, 'z-index', 999);
        this._insertBody('');
    },
    afterRender: function(container) {
        Rui.ui.calendar.LFromToCalendar.superclass.afterRender.call(this, container);
        var calContainerDiv = document.createElement('div'),
            fromCalendarDiv = document.createElement('div'),
            toCalendarDiv = document.createElement('div');
            calContainerDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToCal-cal-' + this.id) : Rui.id();
            fromCalendarDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToCal-from-' + this.id) : Rui.id();
            toCalendarDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToCal-to-' + this.id) : Rui.id();
        var calContainerEl = Rui.get(calContainerDiv),
        fromCalendarEl = Rui.get(fromCalendarDiv),
        toCalendarEl = Rui.get(toCalendarDiv);
        if(Rui.rightToLeft()) {
            calContainerEl.appendChild(toCalendarEl);
            calContainerEl.appendChild(fromCalendarEl);
        } else {
            calContainerEl.appendChild(fromCalendarEl);
            calContainerEl.appendChild(toCalendarEl);
        }
        calContainerEl.addClass('L-fromtocalendar-inner');
        fromCalendarEl.addClass('L-fromtocalendar-from');
        toCalendarEl.addClass('L-fromtocalendar-to');
        this.calContainerEl =  calContainerEl;
        this.fromCalendarEl = fromCalendarEl;
        this.toCalendarEl = toCalendarEl;
        Rui.get(this.body).appendChild(calContainerEl);
        this.setHeader(Rui.getMessageManager().get('$.ext.msg020'));
        var fromCalendar = new Rui.ui.calendar.LCalendar({
            id: fromCalendarEl.id,
            mindate: this.mindate,
            maxdate: this.maxdate,
        	title: Rui.getMessageManager().get('$.ext.msg018')
        });
        fromCalendar.selectEvent.on(this.onStartCalendarSelected, this, true);
        fromCalendar.render();
        this.fromCalendar = fromCalendar;
        var toCalendar = new Rui.ui.calendar.LCalendar({
            id: toCalendarEl.id,
            mindate: this.mindate,
            maxdate: this.maxdate,
        	title: Rui.getMessageManager().get('$.ext.msg019')
        });
        toCalendar.selectEvent.on(this.onEndCalendarSelected, this, true);
        toCalendar.render();
        this.toCalendar = toCalendar;
        this.el.show();
        this.show();
    },
    onStartCalendarSelected: function(e){
        this.fireEvent('select', {
            target: this,
            start: e.date
        });
    },
    onEndCalendarSelected: function(e){
        this.fireEvent('select', {
            target: this,
            end: e.date
        });
    },
    clear: function(){
    	if(this.fromCalendar)
    		this.fromCalendar.clear();
    	if(this.toCalendar)
    		this.toCalendar.clear();
    },
    select: function(startDate, endDate, fireEvent){
    	if(this.fromCalendar && startDate){
    		this.fromCalendar.select(startDate, fireEvent);
    		this.fromCalendar.cfg.setProperty('pagedate', startDate);
    		this.fromCalendar.render();
    	}
    	if(this.toCalendar && endDate){
    		this.toCalendar.select(endDate, fireEvent);
    		this.toCalendar.cfg.setProperty('pagedate', endDate);
    		this.toCalendar.render();
    	}
    }
});