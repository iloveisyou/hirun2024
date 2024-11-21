/*
 * @(#) LSimpleCalendar.js
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
(function(){
    Rui.ui.calendar.LSimpleCalendar = function(oConfig) {
        var config = oConfig || {};
        Rui.ui.calendar.LSimpleCalendar .superclass.constructor.call(this, config);
        this.createEvent("cellRendered");
        this.createEvent("beforeSelect");
        this.createEvent("select");
        this.createEvent("beforeDeselect");
        this.createEvent("deselect");
    };
    Rui.extend(Rui.ui.calendar.LSimpleCalendar, Rui.ui.LUIComponent, {
        otype : 'Rui.ui.calendar.LSimpleCalendar',
        CSS_BASE: 'L-calendar',
        startWeekDay: 0,
        pagedate: new Date(),
        locale: 'ko_KR',
        valueDateLocale: Rui.util.LDateLocale['en_US'],
        dateLocale: null,
        selectedDate: null,
        initComponent : function(oConfig){
            this.createTemplate();
            this.dateLocale = Rui.util.LDateLocale.getInstance(this.locale);
            if(!this.pagedate) pagedate = new Date();
        },
        createTemplate : function() {
            var ts = this.templates || {};
            if (!ts.master) {
                ts.master = new Rui.LTemplate(
                            '<div class="L-calendar-header" >',
                                '<div class="L-calendar-header-offset" >{header}</div>',
                            '</div>',
                            '<div class="L-calendar-body" >',
                                '<div class="L-calendar-body-offset"></div>',
                            '</div>',
                            '<div class="L-calendar-footer">{footer}</div>',
                            '<a class="L-calendar-focus" tabindex="-1" onclick="return false" href="#">{footer}</a>'
                        );
            }
            if (!ts.header) {
                ts.header = new Rui.LTemplate(
                        '<a href="#" class="L-calendar-header-year-left"><<</a>',
                        '<a href="#" class="L-calendar-header-month-left"><</a>',
                        '<a href="#" class="L-calendar-header-body">{year} {month}</a>',
                        '<a href="#" class="L-calendar-header-month-right">></a>',
                        '<a href="#" class="L-calendar-header-year-right">>></a>'
                        );
            }
            if (!ts.body) {
                ts.body = new Rui.LTemplate('<ul class="L-calendar-dates">{cellHeader}{cellBody}</ul>');
            }
            if (!ts.cellHeader) {
                ts.cellHeader = new Rui.LTemplate(
                        '<li class="L-calendar-date-header {dayOfTheWeek}">{dayOfTheWeekLocale}</li>'
                        );
            }
            if (!ts.cellBody) {
                ts.cellBody = new Rui.LTemplate(
                        '<li class="L-calendar-date {day} {css} ">{date}</li>'
                        );
            }
            if (!ts.footer) {
                ts.footer = new Rui.LTemplate('<a href="#" class="L-calendar-footer-close">close</a>');
            }
            this.templates = ts;
        },
        doRender : function(container) {
            this.renderMaster(this.getRenderHeader(), '', this.getRenderFooter());
            this.el.addClass(this.CSS_BASE);
            this.el.addClass("L-fixed");
            this.el.on('click', this.focusCalendar, this, true);
            this.headerEl = this.el.select('.L-calendar-header').getAt(0);
            this.headerOffsetEl = this.el.select('.L-calendar-header-body').getAt(0);
            this.bodyEl = this.el.select('.L-calendar-body').getAt(0);
            this.bodyOffsetEl = this.el.select('.L-calendar-body-offset').getAt(0);
            this.footerEl = this.el.select('.L-calendar-footer').getAt(0);
            this.focusEl = this.el.select('.L-calendar-focus').getAt(0);
            this.renderBody(this.getRenderBody());
            this.focusEl.on('focus', this.onCheckFocus, this, true);
            this.headerEl.on('click', this.onHeaderClick, this, true);
            this.bodyEl.on('click', this.onBodyClick, this, true);
        },
        renderMaster: function(headerHtml, bodyHtml, footerHtml) {
            var html = this.templates.master.apply({
                header: headerHtml,
                body: bodyHtml,
                footer: footerHtml
            });
            this.el.html(html);
        },
        renderHeader: function(headerHtml) {
            this.headerEl.html(headerHtml);
        },
        renderBody: function(bodyHtml) {
            this.bodyOffsetEl.html(bodyHtml);
            var currentDate = this.renderStartDate.clone();
            var dateDomList = this.bodyOffsetEl.query('.L-calendar-date');
            for (var i = 0 ; i < dateDomList.length ; i++) {
                var p = {
                    cell:dateDomList[i],
                    date: currentDate
                };
                this.fireEvent('cellRendered', p);
                currentDate = currentDate.add('D', 1);
            }
        },
        getRenderHeader: function() {
            var ts = this.templates || {};
            var p = {
                year: this.pagedate.format('%Y'),
                month: this.pagedate.format('%m')
            };
            return ts.header.apply(p);
        },
        getRenderBody: function() {
            var ts = this.templates || {};
            var p = {
                cellHeader: this.getRenderCellHeaderRows(),
                cellBody: this.getRenderCellBodyRows()
            };
            return ts.body.apply(p);
        },
        getRenderCellHeaderRows: function() {
            var headerRowsHtml = '';
            var currentDay = this.startWeekDay;
            for (var i = 0 ; i < 7 ; i ++, currentDay++) {
                headerRowsHtml += this.getRenderCellHeader(currentDay)
                currentDay = currentDay == 6 ? -1 : currentDay;
            }
            return headerRowsHtml;
        },
        getRenderCellHeader: function(dayOfTheWeek) {
            var ts = this.templates || {};
            var p = {
                dayOfTheWeek: this.valueDateLocale.A[dayOfTheWeek],
                dayOfTheWeekLocale: this.dateLocale.a[dayOfTheWeek]
            };
            return ts.cellHeader.apply(p);
        },
        getRenderCellBodyRows: function() {
            var headerRowsHtml = '';
            var currentDay = this.startWeekDay;
            var lastDay = 6 - this.startWeekDay;
            var currentDate = new Date(this.pagedate.getFullYear(), this.pagedate.getMonth(), 1);
            var lastDate = this.pagedate.getLastDayOfMonth();
            for (var i = 0 ; i < 7; i++) {
                if(currentDate.getDay() == this.startWeekDay) break;
                currentDate = currentDate.add('D', -1); 
            }
            this.renderStartDate = currentDate.clone();
            var isLastDate = false;
            for (var i = 0 ; i < 100 ; i ++) {
                headerRowsHtml += this.getRenderCellBody(currentDate)
                if(isLastDate && currentDate.getDay() == lastDay) break;
                currentDate = currentDate.add('D', 1);
                if(this.pagedate.getMonth() == currentDate.getMonth() &&
                    this.pagedate.getDayInMonth().getDate() == currentDate.getDate()) 
                        isLastDate = true;
            }
            return headerRowsHtml;
        },
        getRenderCellBody: function(date) {
            var ts = this.templates || {};
            var css = ['L-date-' + date.format('%Y%m%d'), date.equals(this.pagedate, {format:'%y%m'}) ? '' : 'L-disable-date'];
            var p = {
                day: this.valueDateLocale.A[date.getDay()],
                date: date.getDate(),
                css : css.join(' ')
            };
            return ts.cellBody.apply(p);
        },
        getRenderFooter: function() {
            var ts = this.templates || {};
            return ts.footer.apply({});
        },
        focusCalendar: function(e) {
            this.focusEl.focus();
        },
        onHeaderClick : function(e) {
            var targetEl = Rui.get(e.target);
            if(targetEl.hasClass('L-calendar-header-year-left')) {
                this.setYear(this.pagedate.getFullYear() - 1);
            } else if(targetEl.hasClass('L-calendar-header-month-left')) {
                this.setMonth(this.pagedate.getMonth() - 1);
            } else if(targetEl.hasClass('L-calendar-header-month-right')) {
                this.setMonth(this.pagedate.getMonth() + 1);
            } else if(targetEl.hasClass('L-calendar-header-year-right')) {
                this.setYear(this.pagedate.getFullYear() + 1);    
            }
        },
        onBodyClick : function(e) {
            var targetEl = Rui.get(e.target);
            if(targetEl.hasClass('L-calendar-date')) {
                if(targetEl.hasClass('L-disable-date')) return;
                if(this.doDeselectCell(e, this) == true)
                    this.doSelectCell(e, this);
            }
        },
        setMonth: function(month){
            this.pagedate.setMonth(month);
            this.renderHeader(this.getRenderHeader());
            this.renderBody(this.getRenderBody());
        },
        setYear: function(year) {
            this.pagedate.setFullYear(year);
            this.renderHeader(this.getRenderHeader());
            this.renderBody(this.getRenderBody());
        },
        doSelectCell: function(e, cal){
            var targetEl = Rui.get(e.target);
            var currentDate = this.getCssToDate(targetEl.dom);
            if(this.fireEvent('beforeSelect', { date: currentDate }) == false) return;
            targetEl.addClass('selected');
            this.fireEvent('select', {date: currentDate});
            this.selectedDate = currentDate;
        },
        doDeselectCell: function(e, cal) {
            if(this.selectedDate != null) {
                if(this.fireEvent('beforeSelect', { date: this.selectedDate }) == false) return false;
                var deselectedDate = this.selectedDate.clone();
                this.clear();
                this.fireEvent('deselect', {
                    date: deselectedDate
                });
            }
            return true;
        },
        getCssToDate: function(dom) {
            var className = dom.className;
            var classNameList = className.split(' ');
            for (var i = 0 ; i < classNameList.length ; i++) {
                if(classNameList[i].startsWith('L-date-')) {
                    return classNameList[i].substring(7).toDate('%Y%m%d');
                }
            }
            return null;
        },
        clear: function() {
            this.bodyEl.select('.selected').removeClass('selected');
            this.selectedDate = null;
        },
        focus : function() {
            this.focusCalendar();
        },
        destroy : function() {
            this.headerEl.remove();
            this.headerOffsetEl.remove();
            this.bodyEl.remove();
            this.bodyOffsetEl.remove();
            this.footerEl.remove();
            this.focusEl.remove();
            this.headerEl = null;
            this.headerOffsetEl = null;
            this.bodyEl = null;
            this.bodyOffsetEl = null;
            this.footerEl = null;
            this.focusEl = null;
            Rui.ui.calendar.LSimpleCalendar.superclass.destroy.call(this);
        }
    });
})();