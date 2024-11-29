/*
 * @(#) rui_config.js
 * build version : 2.8
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
 */
(function() {
    Rui.namespace('Rui.config');
    Rui.namespace('Rui.message.locale');
    /*
     * Web Root가 '/'가 아닌경우, '/'부터 Web Root까지의 경로를 기술한다.  ex) /WebContent
     */
    var contextPath = '/rui',
        ruiRootPath = '/rui2';
    
    contextPath = window._BOOTSTRAP_CONTEXTROOT || contextPath;
    ruiRootPath = window._BOOTSTRAP_RUIROOT || ruiRootPath;
    /*
     * 각 Module별 기본 config값 설정.
     */
    Rui.config.ConfigData = {
        core:
            {
                applicationName: 'DevOn RUI',
                version: 2.8,
                configFileVersion: 1.6,
                /*
                 * 기본 언어 date, message등에 영향을 준다.
                 * */
                defaultLocale: 'ko_KR',
                contextPath: contextPath,
                ruiRootPath: ruiRootPath,
                message: {
                    /*
                     * 기본 message 객체
                     */
                    defaultMessage: Rui.message.locale.ko_KR,
                    /*
                     * 다국어 지원 message 파일 위치
                     */
                    localePath: '/resources/locale'
                },
                jsunit: {
                    jsPath: contextPath + '/jsunit/app/jsUnitCore.js'
                },
                css: {
                    charset: 'utf-8'
                },
                logger: {
                    /*
                     * logger 출력 여부
                     */
                    show: false,
                    /*
                     * logger expand 여부
                     */
                    expand: false,
                    /*
                     * logger 기본 source 출력  여부
                     */
                    defaultSource: true,
                    /*
                     * logger 기본 source 명
                     */
                    defaultSourceName: 'Component'
                },
                font: {
                },
                debug: {
                    /*
                     * 에러 발생시 debugging 여부
                     */
                    exceptionDebugger : false,
                    notice: false,   // 개발자용 가이드 사용여부
                    servers: [ 'localhost', '127.0.0.1']
                },
                useAccessibility: false,
                rightToLeft: false,
                useFixedId: false,  // 컴포넌트 el DOM ID 고정여부
                dateLocale: {
                    //ko: {
                    //    x: '%Y년%B월%d일'
                    //}
                }
            }
        ,
        base:
            {
                dataSetManager: {
                    defaultProperties: {
                        params: {abc:123},
                        diableCaching: true,
                        timeout: 30,
                        blankUrl: 'about:blank',
                        defaultSuccessHandler: false,
                        defaultFailureHandler: true,
                        defaultLoadExceptionHandler: true,
                        isCheckedUpdate: true
                    },

                    failureHandler: function(e) {
                        if(typeof loadPanel != 'undefined') loadPanel.hide();
                        if (Rui.getConfig().getFirst('$.core.debug.exceptionDebugger')) {
                            alert('IE나 FireFox의 경우 디버깅 상태로 설정됩니다.');
                        debugger;
                        }
                        if(e.conn && e.conn.status == -1) // timeout
                            Rui.alert(Rui.getMessageManager().get('$.base.msg112'));
                        else {
                            var dt = new Date();
                            var strDate = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate();
                            strDate +=  ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();

                            if(typeof e.conn === 'undefined')
                                strStatus = '';
                            else if(e.conn)
                                strStatus = e.conn.status;
                            else
                                strStatus = e.status;

                            Rui.alert('[RUI-10000]DateTime:[' + strDate + ']:Status:[' + strStatus + ']<br>'
                                    + Rui.getMessageManager().get('$.base.msg101') + ' : ' + e.responseText
                                    + '<br>' + Rui.getMessageManager().get('$.base.msg142'));
                        }
                    },

                    loadExceptionHandler: function(e) {
                        if(typeof loadPanel != 'undefined') loadPanel.hide();
                        if(Rui.getConfig().getFirst('$.core.debug.exceptionDebugger')) {
                            alert('IE나 FireFox의 경우 디버깅 상태로 설정됩니다.');
                            debugger;
                        }
                        var exception = Rui.getException(e.throwObject);
                        if(e.conn && e.conn.status == -1)  // timeout
                            Rui.alert(Rui.getMessageManager().get('$.base.msg112'));
                        else {
                            var dt = new Date();
                            var strDate = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate();
                            strDate +=  ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();

                            if(typeof e.conn === 'undefined')
                                strStatus = '';
                            else
                                strStatus = e.conn.status;

                            Rui.alert('[RUI-10000]DateTime:[' + strDate + ']:Status:[' + strStatus + ']<br>'
                                    + Rui.getMessageManager().get('$.base.msg104') + ' : ' + exception.getMessage()
                                    + '<br>' + Rui.getMessageManager().get('$.base.msg142'));
                        }
                        return false;
                    }
                },
                button: {
                    disableDbClick: true,
                    disableDbClickInterval: 500
                },
                layout: {
                    defaultProperties: {
                    }
                },
                dataSet: {
                    defaultProperties: {
                        params: {abc:123},
                    	method: 'GET',
                        focusFirstRow: 0,
                        defaultFailureHandler: true,
                        isClearUnFilterChangeData: false,
                        serializeMetaData: false,
                        readFieldFormater: { date: function(value){
                            if(typeof value == 'number'){
                            	return new Date(value);
                            }else
                            	return Rui.util.LFormat.stringToTimestamp(value);
                        }},
                        writeFieldFormater: { date: Rui.util.LRenderer.dateRenderer('%Y%m%d%H%M%S') }
                    },
                    loadExceptionHandler: function(e) {
                        if(typeof loadPanel != 'undefined') loadPanel.hide();
                        if(Rui.getConfig().getFirst('$.core.debug.exceptionDebugger')) {
                            alert('IE나 FireFox의 경우 디버깅 상태로 설정됩니다.');
                            debugger;
                        }
                        var exception = Rui.getException(e.throwObject);
                        var message = e.throwObject ? e.throwObject.message : e.message;
                        Rui.log(message, 'error', this.otype);
                        if(e.conn && e.conn.status == -1)  // timeout
                            Rui.alert(Rui.getMessageManager().get('$.base.msg112'));
                        else{
                            var dt = new Date();
                            var strDate = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate();
                            strDate +=  ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();

                            if(typeof e.conn === 'undefined')
                                strStatus = '';
                            else
                                strStatus = e.conn.status;

                            Rui.alert('[RUI-10000]DateTime:[' + strDate + ']:Status:[' + strStatus + ']<br>'
                                    + Rui.getMessageManager().get('$.base.msg104') + ' : ' + exception.getMessage()
                                    + '<br>' + Rui.getMessageManager().get('$.base.msg142'));
                        }
                        return true;
                    }
                },
                guide: {
                    show: true,
                    limitGuideCount: 3,
                    defaultProperties: {
                        showPageGuide: true
                    }
                }
            }
        ,
        ext:
            {
                browser: {
                    recommend: true,
                    recommendCount: 1,
                    link: 'http://browsehappy.com'
                },
                dialog: {
                    defaultProperties: {
                        constraintoviewport: true,
                        fixedcenter: true,
                        modal: true,
                        hideaftersubmit: true,
                        postmethod: 'none'
                    }
                },
                container: {
                },
                textBox: {
                    defaultProperties: {
                        //dataSetClassName: 'Rui.data.LJsonDataSet',
                        filterMode: 'remote',
                        emptyValue: null
                    },
                    dataSet: {
                    }
                },
                combo: {
                    defaultProperties: {
                        filterMode: 'local',
                        //width: 100,
                        //listWidth: 200,
                        //emptyValue: '',
                        useEmptyText: true
                    },
                    dataSet: {
                        //valueField: 'value',
                        //displayField: 'text'
                    }
                },
                multicombo: {
                    defaultProperties: {
                    	//다국어 처리를 원할 경우 rui_config.js 가장 아래 LMultiCombo 다국어처리 방법을 참조
                        placeholder: 'choose a state'
                    }
                },
                numberBox: {
                    defaultProperties: {
                    }
                },
                textArea: {
                    defaultProperties:{
                    }
                },
                checkBox: {
                    defaultProperties: {
                    }
                },
                radio: {
                    defaultProperties: {
                    }
                },
                dateBox: {
                    defaultProperties: {
                        //valueFormat: '%Y-%m-%d',
                    	//iconMarginLeft: 1, //input과 calendar icon 사이 간격 px
                        localeMask: true,
                        calendarConfig: {close: true}
                    }
                },
                timeBox: {
                    defaultProperties: {
                        //iconMarginLeft: 1 //input과 spin buttons 사이 간격 px
                    }
                },
                monthBox: {
                    defaultProperties: {
                    }
                },
                datetimeBox: {
                    defaultProperties: {
                    	//valueFormat: '%Y-%m-%d %H:%M:%S',
                        //iconMarginLeft : 1 //input과 calendar icon 사이 간격 px
                    }
                },
                fromtodateBox: {
                    defaultProperties: {
                    	//valueFormat: '%Y-%m-%d',
                    	//separator: '~',
                        //iconMarginLeft : 1 //input과 calendar icon 사이 간격 px
                    }
                },
                popupTextBox : {
                    defaultProperties:{
                        useHiddenValue: true
                    }
                },
                slideMenu: {
                    defaultProperties: {
                        onlyOneTopOpen: true,
                        defaultOpenTopIndex: 0,
                        fields: {
                            rootValue: null,
                            id: 'menuId',
                            parentId: 'parentMenuId',
                            label: 'name',
                            order: 'seq'
                        }
                    }
                },
                messageBox: {
                    type: 'Rui.ui.MessageBox'
                },
                tabView: {
                    defaultProperties: {
                    }
                },
                treeView: {
                    defaultProperties: {
                        fields: {
                            rootValue: null,
                            id: 'nodeId',
                            parentId: 'parentNodeId',
                            label: 'name',
                            order: 'seq'
                        }
                    }
                },
                calendar: {
                    defaultProperties: {
                        navigator: true
                    }
                },
                gridPanel: {
                    defaultProperties: {
                        //autoWidth: false,
                        clickToEdit: false,
                        useRightActionMenu: false,
                        editable: true,
                        isGuide: true,
                        rendererConfig: true,
                        //showExcelDialog: false,
                        excelType: 'html'
                    }
                },
                grid: {
                    defaultProperties: {
                    },
                    excelDownLoadUrl: contextPath + ruiRootPath + '/plugins/ui/grid/excelDownload.jsp'
                },
                gridScroller: {
                    defaultProperties: {
                    }
                },
                treeGrid: {
                    defaultProperties: {
                        defaultOpenTopIndex: 0,
                        fields: {
                            depthId: 'depth'
                        }
                    }
                },
                pager: {
                    defaultProperties: {
                        /* DevOn 4.0 */
                        pageSizeFieldName: 'devonRowSize',
                        viewPageStartRowIndexFieldName: 'devonTargetRow',
                        /* DevOn 3.0
                        pageSizeFieldName: 'NUMBER_OF_ROWS_OF_PAGE',
                        viewPageStartRowIndexFieldName: 'targetRow',
                        */
                        sortQueryFieldName: 'devonOrderBy'
                    }
                },
                headerContextMenu: {
                },
                pivot: {
                    defaultProperties: {
                        pivotLabelWidth: 70,
                        defaultOpenDepth: 1,
                        defaultSumColPosLast: true,
                        hiddenZeroValColumn: false
                    }
                },
                notificationManager: {
                    defaultProperties: {
                    }
                },
                api: {
                    showDetail: true
                }
            }
        ,
        project:
            {
        }
    };

    // 모든 에러 report함.
    Rui.util.LEvent.throwErrors = true;

    Rui.BLANK_IMAGE_URL = '/resources/images/default/s.gif';
    
    Rui.onReady(function() {
        /*
         * config 관련 이벤트 탑재
         */
         var config = Rui.getConfig();
         var provider = config.getProvider();
         provider.on('stateChanged', function(e) {
             if (e.key == '$.core.defaultLocale') {
                 Rui.getMessageManager().setLocale(e.value[0]);
             }
         });
         
         Rui.noticeDebug();
    });

    if(Rui.ui && Rui.ui.grid && Rui.ui.grid.LColumnModel) {
        Rui.ui.grid.LColumnModel.rendererMapper['date'] = Rui.util.LRenderer.dateRenderer('%x');
        Rui.ui.grid.LColumnModel.rendererMapper['time'] = Rui.util.LRenderer.timeRenderer();
        Rui.ui.grid.LColumnModel.rendererMapper['money'] = Rui.util.LRenderer.moneyRenderer();
        Rui.ui.grid.LColumnModel.rendererMapper['number'] = Rui.util.LRenderer.numberRenderer();
        Rui.ui.grid.LColumnModel.rendererMapper['rate'] = Rui.util.LRenderer.rateRenderer();
        Rui.ui.grid.LColumnModel.rendererMapper['popup'] = Rui.util.LRenderer.popupRenderer();
    }

    //아래는 lMultiCombo의 '선택하세요'메시지 다국어 처리이나, 다국어처리를 위한 MessageManager 로딩 시간때문에 사용할수 없다.
    //아래를 프로젝트 공통으로 옮길 경우 LCombo의 emptyMessage에 준하는 LMultiCombo의 placeholder를 사용할 수 있다.
    //Rui.getConfig().set('$.ext.multicombo.defaultProperties.placeholder', Rui.getMessageManager().get('$.base.msg108'));
    
})();

