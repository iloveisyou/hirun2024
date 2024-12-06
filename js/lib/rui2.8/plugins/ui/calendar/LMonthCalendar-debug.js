/*
 * @(#) LMonthCalendar-debug.js
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
    var DEF_CFG = Rui.ui.calendar.LCalendar._DEFAULT_CONFIG;
    /**
     * LMonthCalendar
     * @plugin
     * @namespace Rui.ui.calendar
     * @class LMonthCalendar
     * @constructor LMonthCalendar
     * @param {Object} config The intial LMonthCalendar.
     */
    Rui.ui.calendar.LMonthCalendar = function(config) {
        config = config || {};
        Rui.ui.calendar.LMonthCalendar.superclass.constructor.call(this, config);
    };
    Rui.extend(Rui.ui.calendar.LMonthCalendar, Rui.ui.calendar.LCalendar, {
        render: function() {

            this.beforeRenderEvent.fire();
            
            var _pageDate = this.cfg.getProperty(DEF_CFG.PAGEDATE.key);
            var workingDate = Rui.util.LDate.getDate(_pageDate.getFullYear(), 0, 1);

            this.resetRenderers();
            this.cellDates.length = 0;

            Rui.util.LEvent.purgeElement(this.oDomContainer, true);

            var html = [];

            html[html.length] = '<table cellSpacing="0" style="align:center;" class="' + this.Style.CSS_CALENDAR + ' y' + workingDate.getFullYear() + '" id="' + this.id + '">';// 변경 코드
            html = this.renderHeader(html);
            html = this.renderBody(workingDate, html);
            html = this.renderFooter(html);
            html[html.length] = '</table>';

            this.oDomContainer.innerHTML = html.join("\n");

            this.applyListeners();
            this.cells = this.oDomContainer.getElementsByTagName("td");

            this.cfg.refireEvent(DEF_CFG.TITLE.key);
            this.cfg.refireEvent(DEF_CFG.CLOSE.key);
            this.cfg.refireEvent(DEF_CFG.IFRAME.key);

            this.cfg.setProperty("TITLE", '년월을 선택하세요.'); // 추가 코드

            this.renderEvent.fire();
        },
        // render header 설정
        renderHeader: function(html) {
            var colSpan = 3, // 변경 코드
                DEPR_NAV_LEFT = "us/tr/callt.gif",
                DEPR_NAV_RIGHT = "us/tr/calrt.gif",
                cfg = this.cfg,
                pageDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
                strings = cfg.getProperty(DEF_CFG.STRINGS.key),
                //prevStr = (strings && strings.previousMonth) ? strings.previousMonth : "",
                //nextStr = (strings && strings.nextMonth) ? strings.nextMonth : "",
                //monthLabel,
                prevYearStr = (strings && strings.previousYear) ? strings.previousYear : "",
                nextYearStr = (strings && strings.nextYear) ? strings.nextYear : "",
                yearLabel;
            //추가 코드
            html[html.length] = "<thead>";
            html[html.length] = "<tr>";
            html[html.length] = '<th colspan="' + colSpan + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
            html[html.length] = '<div class="' + this.Style.CSS_HEADER + '">';

            var renderLeft, renderRight = false;

            if (this.parent) {
                if (this.index === 0) {
                    renderLeft = true;
                }
                if (this.index == (this.parent.cfg.getProperty("pages") - 1)) {
                    renderRight = true;
                }
            } else {
                renderLeft = true;
                renderRight = true;
            }
            // left arrow
            if (renderLeft) {
                yearLabel = this._buildYearLabel(Rui.util.LDate.subtract(pageDate, Rui.util.LDate.YEAR, 1));

                var leftArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_LEFT.key);
                if (leftArrow === null && Rui.ui.calendar.LCalendar.IMG_ROOT !== null) {
                    leftArrow = Rui.ui.calendar.LCalendar.IMG_ROOT + DEPR_NAV_LEFT;
                }
                var leftStyle = (leftArrow === null) ? "" : ' style="background-image:url(' + leftArrow + ')"';
                var navLeftHtml = '<a class="' + this.Style.CSS_NAV_YEAR_LEFT + '"' + leftStyle + ' href="#" id="' + this.id + '_calnavyearleft">' + prevYearStr + ' (' + yearLabel + ')' + '</a>';
                html[html.length] = navLeftHtml;
            }
            // year
            var lbl = this.buildYearLabel();
            var cal = this.parent || this;
            if (cal.cfg.getProperty("navigator")) {
                lbl = "<a class=\"" + this.Style.CSS_NAV + "\" href=\"#\" id=\"" + this.id +"_calnav\">" + lbl + "</a>";
            }
            html[html.length] = lbl;
            // right arrow
            if (renderRight) {
                yearLabel = this._buildYearLabel(Rui.util.LDate.add(pageDate, Rui.util.LDate.YEAR, 1));

                var rightArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_RIGHT.key);
                if (rightArrow === null && Rui.ui.calendar.LCalendar.IMG_ROOT !== null) {
                    rightArrow = Rui.ui.calendar.LCalendar.IMG_ROOT + DEPR_NAV_RIGHT;
                }
                var rightStyle = (rightArrow === null) ? "" : ' style="background-image:url(' + rightArrow + ')"';
                var navRightHtml = '<a class="' + this.Style.CSS_NAV_YEAR_RIGHT + '"' + rightStyle + ' href="#" id="' + this.id + '_calnavyearright">' + nextYearStr + ' (' + yearLabel + ')' + '</a>';
                html[html.length] = navRightHtml;
            }

            html[html.length] = '</div>\n</th>\n</tr>';

            // weekday 표시 삭제
            if (cfg.getProperty(DEF_CFG.SHOW_WEEKDAYS.key)) {
                //html = this.buildWeekdays(html);
            }

            html[html.length] = '</thead>';

            return html;
        },

        // render body 설정
        renderBody: function(workingDate, html) {

            var startDay = 0;
            this.preMonthDays = 0;
            this.monthDays = 12;
            this.postMonthDays = 12;

            var weekNum = "1",
            weekPrefix = "w",
            cellPrefix = "_cell",
            workingDayPrefix = "wd",
            dayPrefix = "d",
            cellRenderers,
            renderer,
            t = this.today,
            cfg = this.cfg,

            //hideBlankWeeks = cfg.getProperty(DEF_CFG.HIDE_BLANK_WEEKS.key),
            showWeekFooter = cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key),
            showWeekHeader = cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key),
            mindate = cfg.getProperty(DEF_CFG.MINDATE.key),
            maxdate = cfg.getProperty(DEF_CFG.MAXDATE.key);

            html[html.length] = '<tbody class="m1 '+ this.Style.CSS_BODY + '">';

            var i = 0,
            tempDiv = document.createElement("div"),
            cell = document.createElement("td");

            tempDiv.appendChild(cell);

            var cal = this.parent || this;

            for (var r = 0; r < 4; r++) {

                //hideBlankWeeks = true;

                html[html.length] = '<tr>';

                for (var d = 0; d < 3; d++) {

                    cellRenderers = [];

                    this.clearElement(cell);
                    cell.className = this.Style.CSS_CELL;
                    cell.id = this.id + cellPrefix + i;

                    
                    var workingArray = [workingDate.getFullYear(), workingDate.getMonth()+1, 1];
                    this.cellDates[this.cellDates.length] = workingArray;

                    if (this._indexOfSelectedFieldArray(workingArray) > -1) {
                        cellRenderers[cellRenderers.length] = cal.renderCellStyleSelected;
                    }

                    cellRenderers[cellRenderers.length] = cal.styleCellDefault;
                    cellRenderers[cellRenderers.length] = cal.renderCellDefault;

                    var eventParam = {date:workingDate, cell: cell, stop: false};
                    this.renderCellEvent.fire(eventParam);

                    if(eventParam.stop !== true) {
                        for (var x = 0; x < cellRenderers.length; ++x) {
                            if (cellRenderers[x].call(cal, workingDate, cell) == Rui.ui.calendar.LCalendar.STOP_RENDER) {
                                break;
                            }
                        }
                    }

//                    workingDate.setTime(workingDate.getTime() + Rui.util.LDate.ONE_DAY_MS);
                    workingDate = Rui.util.LDate.subtract(workingDate, Rui.util.LDate.MONTH, -1);
                    workingDate = Rui.util.LDate.clearTime(workingDate);

                    html[html.length] = tempDiv.innerHTML;
                    i++;
                }
                //if (showWeekFooter) { html = this.renderRowFooter(weekNum, html); }
                html[html.length] = '</tr>';
            }
            html[html.length] = '</tbody>';
            return html;
        },
        // Month 생성
        buildYearLabel: function() {
            return this._buildYearLabel(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));
        },

        _buildYearLabel: function(date) {
            var  y = date.getFullYear(),
                yLabel = this.Locale.MY_LABEL_YEAR_SUFFIX;
            return '<span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span>';
        },

        renderCellDefault: function(workingDate, cell) {
            cell.innerHTML = '<a href="#" class="' + this.Style.CSS_CELL_SELECTOR + '">' + this.buildMonthLabel(workingDate) + "</a>";
        },

        buildMonthLabel: function(workingDate) {
            return workingDate.getMonth()+1;
        }
    });


})();