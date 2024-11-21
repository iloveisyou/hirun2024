Rui.namespace('Rui.dev');

Rui.dev.LGuide = function(config) {
    this.ruiPath = Rui.getConfig().getFirst('$.core.contextPath') + Rui.getConfig().getFirst('$.core.ruiRootPath');
    this.hostPath = 'www.dev-on.com/rui/rui2';
};

Rui.dev.LGuide.prototype = {
    warnCount: 0,
    infoCount: 0,
    isNotice: false,
    message: function(msg, type) {
        if(type > 0) {
            msg = '[Warn]: ' + msg;
            this.warnCount++;
        } else {
            msg = '[Info]: ' + msg;
            this.infoCount++;
        }
        Rui.log(msg, 'dv');
        if (console) {
            var headMsg = new Date().format('%Y-%m-%d %H:%M:%S') 
                        + ' DevOn RUI Optimizer Log:\n' + msg;
            (type > 0) ? console.warn(headMsg):console.info(headMsg);
        }
        this.isNotice = true;
    },
    Rui_load: function(scope) {
        var resources = Rui.select('script, style');
        var duplicateList = [];
        var urlLists = [];
        var orderFramework = false;
        resources.each(function(item, i){
            var src = item.dom.src ? (item.dom.src + '') : '';
            if(src || item.dom.href) {
                var url = src || item.dom.href;
                if(Rui.util.LArray.contains(urlLists, url)) {
                    duplicateList.push(url);
                }
                urlLists.push(url);
            }
            
            if(src.indexOf('jquery') > -1 || src.indexOf('prototype') > -1) {
                orderFramework = true;
            }
        });
        
        if(duplicateList.length) {
            var html = '같은 스크립트를 반복적으로 탑재할 경우 불규칙적으로 에러가 발생할 수 있습니다. 해당 페이지에서 아래의 중복된 스크립트를 제거하세요.';
            for(var i = 0, len = duplicateList.length; i < len ; i++) {
                html += '\n' + duplicateList[i];
            }
            this.message(html, 1);
        }
        
        resources = Rui.select('script');
        var isInnerScript = true;
        var isAllScript = true;
        var isEvalScript = true;
        var dmScriptCount = 0;
        var disableCount = 0;
        var comboScript = false;
        var editableScript = false;
        var dmScript = false;
        var newRecordScript = false;
        var useAjaxScript = false;
        resources.each(function(item, i){
            if (!(item.dom.src || item.dom.href || item.dom.syncSrc)) {
                var source = item.dom.innerHTML;
                if(source.indexOf(".innerHTML") > -1)
                    isInnerScript = false;
                if(source.indexOf("document.all") > -1)
                    isAllScript = false;
                if(source.indexOf("eval(") > -1)
                    isEvalScript = false;
                if(isInnerScript == false || isAllScript == false || isEvalScript == false)
                    return false;
                var cnt = source.split('Rui.data.LDataManager').length;
                if(cnt > 1)
                    dmScriptCount += cnt - 1;
                cnt = source.split('.disable()').length;
                
                if(cnt > 1)
                    disableCount += cnt - 1;
                
                if(source.indexOf('new Rui.ui.form.LCombo({')) {
                    comboScript = true;
                }
                if(source.indexOf('.editable')) {
                    editableScript = true;
                }
                if(source.indexOf('new Rui.data.LDataManager({')) {
                    comboScript = true;
                }
                if(source.indexOf('Rui.data.LDataManager') > 0) {
                    dmScript = true;
                }
                if(source.indexOf('.newRecord(') > 0) {
                    newRecordScript = true;
                }
                if(source.indexOf('.setNameValue(0,') > 0) {
                    useAjaxScript = true;
                }
            }
        });
        
        if(orderFramework) {
            var html = '다른 프레임워크와 같이 사용할 경우 memory leak이 발생할 수 있습니다. DOM의 추가/삭제/변경 및 innerHTML 사용시 memory leak을 반드시 고려해야 합니다. (자세한 사항은 RUI 담당자에게 문의)';
            this.message(html);
        }
        
        if(useAjaxScript) {
            var html = '서버에서 1건의 row를 얻어오기 위해서 DataSet을 사용할 경우 불필요한 리소스 낭비 및 성능이 저하됩니다.\n';
            html += 'Api 참조 : http://' + this.hostPath + '/api?type=LRui\n';
            html += '1건의 데이터만 가져와서 처리할 경우 Rui.ajax 메소드를 이용하세요.\n';
            this.message(html);
        }
        
        if(newRecordScript) {
            var html = 'LDataSet의 newRecord후 setNameValue 메소드로 값을 채워 넣는 방식은 성능이 느립니다.\n';
            html += 'Api 참조 : http://' + this.hostPath + '/api?type=Rui.data.LDataSet\n';
            html += 'update 이벤트 없이 값을 채울 경우에는 newRecord보다 createRecord와 add 메소드를 사용하면 성능이 향상됩니다. \n';
            html += '또한 로직이 없는 고정된 기본값을 설정할 경우에는 DataSet 생성시 field에 defalutValue 속성을 정의하면 더 빠릅니다. \n';
            this.message(html);
        }
        
        if(dmScript) {
            var html = 'LDataSetManager 사용시 자주 사용하는 속성 및 메소드에 대해서 설명합니다.\n';
            html += 'Api 참조 : http://' + this.hostPath + '/api?type=Rui.data.LDataSetManager\n';
            html += '- loadDataSet : 서버에서 복수의 데이터셋을 조회하는 메소드 (복수 건의 데이터셋을 조회할 경우에만 사용)\n';
            html += '- updateDataSet: 서버에 변경된 데이터를 저장하는 메소드. 메소드 호출 전 유효성 체크는 beforeUpdate 이벤트에서 처리하세요. \n';
            this.message(html);
        }
        
        if(editableScript) {
            var html = 'Grid의 동적 편집 가능 여부를 설정하려면 Grid.setCellConfig 메소드를 참조하세요.\n';
            html += 'Api 참조 : http://' + this.hostPath + '/api?type=Rui.ui.grid.LGridPanel\n';
            this.message(html);
        }
        
        if(comboScript) {
            var html = 'Combo 사용시 자주 사용하는 속성에 대해서 설명합니다.\n';
            html += 'Api 참조 : http://' + this.hostPath + '/api?type=Rui.ui.form.LCombo\n';
            html += '- valueField/displayField : 서버에서 받은 데이터와 맵핑하는 필드명을 변경할 수 있는 속성\n';
            html += '- autoMapping: Grid의 코드값에 맞는 Combo의 display값으로 출력하는 속성\n';
            html += '- rendererField: Grid의 DataSet에 Combo에 해당하는 display필드와 맵핑하는 속성\n';
            html += '- useEmptyText : "선택하세요." 항목 자체를 출력하지 않게 설정하는 속성\n';
            html += '- emptyText : "선택하세요." 문장 대신 "전체"나 다른 값으로 설정하는 속성\n';
            html += '- name : form의 submit시 서버에 전달하기 위한 키명 속성\n';
            html += '- defaultValue : Combo의 데이터 로드시 기본으로 설정하게 지정하는 속성\n';
            html += '- items : Combo의 데이터를 json으로 로딩하는 속성\n';
            html += '- url : Combo의 데이터를 서버에서 받아오는 속성\n';
            this.message(html);
        }
        
        if(disableCount > 0) {
            var html = 'disable/enable 등 dom 제어 처리 방법은 dom에서의 처리 방법과 컴포넌트에서의 처리 방법이 다릅니다.\n';
            html += 'RUI 콤포넌트로 생성된 객체들은 모두 해당 콤포넌트의 Api 규칙을 따라 이용해야 합니다.\n\n';
            html += '- dom 처리 방법 : Rui.get(\'col1\').disable();\n';
            html += '- 콤포넌트 처리 방법 : textbox.disable();\n\n';
            html += '콤포넌트로 생성된 dom을 아래와 같이 호출하면 안됩니다.\n';
            html += 'Rui.get(\'textbox\').disable();';
            this.message(html);
        }
        if(dmScriptCount > 3) {
            var html = 'Rui.data.LDataManager를 너무 많이 생성하고 있습니다. 불필요하게 생성한 것은 없는지 확인하십시오. 아래에 언급된 항목들과 관련된 내용은 변경이 필요합니다.\n';
            html += '- DataSet 하나를 load하기 위해서 사용하는 경우 -> 잘못된 예) dm.loadDataSet({ dataSets: [dataSet], .....\n';
            html += '- 검색 조건을 처리하는 하나의 row를 처리하기 위해 DataSet을 생성하는 경우 -> params 자체로 변경 가능합니다. params.aaa = \'값 변경\'\n';
            this.message(html);
        }
        if(isInnerScript == false)
            this.message('innerHTML은 memory leak이 발생할 확율이 놓습니다. RUI LElement의 html 메소드를 이용하세요.');
        if(isAllScript == false)
            this.message('document.all속성은 웹표준 속성이 아닙니다. document.getElementById 메소드를 사용하세요.', 1);
        if(isEvalScript == false)
            this.message('eval 스크립트는 ie에서 memory leak이 발생할 가능성이 높습니다. 꼭 사용하려면 RUI 담당자에게 문의하세요.', 1);
    },
    LConnect_ajaxRequest: function(scope, params) {
        if(params[0].async === false) {
            this.message('서버 호출 시 sync 방식은 네트워크가 느릴 경우 성능저하의 가장 큰 원인입니다. url : ' + params[1], 1);
        }
         var connect = Rui.LConnect;
         if(Rui.isUndefined(connect._reqCount)) {
             connect._reqCount = 0;
             connect._firstDtime = new Date();
         }

         if(new Date().getTime() - connect._firstDtime.getTime() < 3000)
             connect._firstDtime = new Date();

         if(++connect._reqCount > 10 && (new Date().getTime() - connect._firstDtime.getTime() > 3000) && connect._showGuide !== true) {
             var template = new Rui.LTemplate(
                 '화면 onLoad시 ajax request가 너무 많습니다. 서버에서 데이터를 묶어서 처리(LDataSetManager.loadDataSet)하거나 단순 콤보의 경우 select 태그와 LCombo를 이용하세요. \n',
                 '데이터셋을 묶어서 로딩하는 방법 : http://www.dev-on.com/rui{url1}\n',
                 '콤보를 select 태그로 생성하는 방법 : http://www.dev-on.com/rui{url2}'
             );
             this.message(template.apply({ 
                 url1: this.ruiPath + '/sample/general/data/datasetManagerMultidatasetSample.html',
                 url2: this.ruiPath + '/sample/general/ui/form/comboMarkupSample.html' 
             }), 1);
             connect._showGuide = true;
         }
    },
    LGridPanel_afterRender: function(scope) {
        var gridPanel = Rui.ui.grid.LGridPanel;
        gridPanel._renderCount = gridPanel._renderCount || 0;
        if(++gridPanel._renderCount > 5 && gridPanel._showGuide !== true) {
            var template = new Rui.LTemplate(
                '화면에 그리드가 너무 많습니다. 만약 탭안에 그리드를 생성할 경우 LTabView의 activeIndexChange이벤트에서 그리드를 render하세요. \n샘플 : ',
                'http://www.dev-on.com/rui{url}'
            );
            this.message(template.apply({ url: this.ruiPath + '/sample/general/ui/tab/tabViewActiveTabSample.html' }), 1);
            gridPanel._showGuide = true;
        }
        var manager = new Rui.webdb.LWebStorage();
        if(manager.getBoolean('gridpanelEditSample', false) === false && gridPanel._showEditGridPanel !== true) {
            var template = new Rui.LTemplate(
                '그리드 샘플을 보신 후 edit 설정 방법을 확인하시기 바랍니다. \n샘플 : ',
                'http://www.dev-on.com/rui{url}'
            );
            this.message(template.apply({ url: this.ruiPath + '/sample/general/ui/grid/gridpanelEditSample.html' }), 0);
            gridPanel._showEditGridPanel = true;
        }
    },
    LGridPanel_onContentResized: function(scope) {
        this.message('그리드의 width와 height가 너무 많이 바뀌었습니다. 원인 확인을 위해 RUI 담당자에게 확인 요청하시기 바랍니다.', 1);
    },
    LBufferGridView_irregularScroll: function(scope) {
		if(!!scope.irregularScroll){
			if(scope.columnModel && !scope.columnModel.isSummary()){
				this.message('그리드 스크롤 처리를 위한 irregularScroll 기능은 그리드에 표현된 데이터에 &lt;BR&gt;등의 태그로 인해 줄 바꿈이 있는 경우에만 사용하세요.\n이 기능은 성능저하의 원인이 될 수 있습니다.', 0);
			}
		}
    },
    LDataSet_constructor: function(scope) {
        var dataSet = Rui.data.LDataSet;
        dataSet._createCount = dataSet._createCount || 0;
        if(++dataSet._createCount > 15 && dataSet._showGuide !== true) {
            var sampleUrl = this.ruiPath + '/api/index.html?type=Rui';
            var template = new Rui.LTemplate(
                '화면에 LDataSet이 너무 많습니다. 단순하게 데이터를 서버에서 받아오는 기능은 Rui.ajax 메소드를 이용하거나 프로젝트의 공통개발 담당자, 개발리더와 협의하세요.\n샘플 : ',
                'http://www.dev-on.com/rui{url}'
            );
            this.message(template.apply({ url: sampleUrl}), 1);
            dataSet._showGuide = true;
        }
    },
    LDataSet_newRecord: function(scope) {
        var dataSet = Rui.data.LDataSet;
        if(Rui.isUndefined(dataSet._newRecordCount)) {
            dataSet._newRecordCount = 0;
            dataSet._firstDtime = new Date();
        }

        if(new Date().getTime() - dataSet._firstDtime.getTime() < 500)
            dataSet._firstDtime = new Date();

        if(++dataSet._newRecordCount > 2 && (new Date().getTime() - dataSet._firstDtime.getTime() > 500)) {
            var sampleUrl = this.ruiPath + '/sample/general/data/datasetCopySample.html';
            var template = new Rui.LTemplate(
                'LDataSet.newRecord를 반복 호출하면 성능이 저하됩니다. 업무상 반복 호출하려면 json방식의 add 메소드나 batch 메소드를 사용하세요. \n샘플 : ',
                'http://www.dev-on.com/rui{url}'
            );
            this.message(template.apply({ url: sampleUrl}), 1);
        }
    },
    LDataSet_load: function(scope) {
        var loadEvent = scope.__simple_events.load;
        for(var i = 0, len = loadEvent.length; i < len; i++) {
            if(!loadEvent[i].system && (loadEvent[i].scope === scope)) {
                var sfn = loadEvent[i].fn + '';
                if(sfn.indexOf('.setRow(')) {
                    var samplePath = this.ruiPath + '/sample/general/ui/grid/gridpanelFirstRowSample.html';
                    var sampleHtml = this.hostPath + '/sample/general/ui/grid/gridpanelFirstRowSample.html';
                    this.message('load시 setRow를 사용하려면 성능 저하문제가 발생할 수 있으므로 DataSet 생성자 속성에 focusFirstRow를 -1로 적용해야 합니다.\n샘플 참조 : ' + sampleHtml, 0);
                }
            }
        }
    },
    LEventProvider_on: function(scope, params) {
    	var gridPanel = (Rui.ui && Rui.ui.grid) ? Rui.ui.grid.LGridPanel : false;
        if(gridPanel && scope instanceof Rui.ui.grid.LGridPanel && params[0] === 'rowclick') {
            if(params.length > 4 && params[4] && params[4].system) return;
            var sampleUrl = this.ruiPath + '/api/index.html?type=Rui.data.LDataSet';
            var template = new Rui.LTemplate(
                'Master/Detail 관계의 그리드를 구현하는 경우 Master 그리드의 rowclick 이벤트가 아닌 rowPosChanged 이벤트로 구현하기 바랍니다.\n',
                'rowclick 이벤트로 구현하면, 키보드를 사용하여 방향키로 제어할 때는 Detail쪽 그리드가 갱신되지 않습니다.\n샘플 : ',
                'http://www.dev-on.com/rui{url}'
            );
            this.message(template.apply({ url: sampleUrl}), 0);
        }
        if(gridPanel && scope instanceof Rui.ui.grid.LGridPanel && params[0] === 'cellclick') {
            if(params.length > 4 && params[4] && params[4].system) return;
            var sampleUrl = this.ruiPath + '/api/index.html?type=Rui.ui.grid.LGridPanel';
            var template = new Rui.LTemplate(
                '그리드의 cell을 선택하여 팝업을 구현하는 경우 cellclick 이벤트 대신 popup 이벤트에서 구현하기 바랍니다.\n샘플 : ',
                'http://www.dev-on.com/rui{url}'
            );
            this.message(template.apply({ url: this.ruiPath + '/sample/general/ui/grid/gridpanelEditSample.html' }), 0);
        }
        if(scope.__simple_events) {
            var evtList = scope.__simple_events[params[0]];
            if(evtList) {
                for(var i = 0, len = evtList.length; i < len; i++) {
                    var isDupEvent = false;
                    if(params[2]) {
                        if(evtList[i].fn === params[1] && evtList[i].scope === params[2]) {
                            isDupEvent = true;
                        }
                    } else {
                        if(String(evtList[i].fn) == String(params[1])) {
                            isDupEvent = true;
                        }
                        if(isDupEvent === true)
                            this.message('이벤트가 중복되었습니다. scope: ' + scope + ', type: ' + params[0] + ', fn: \n' + evtList[i].fn, 1);
                    }
                }
            }
        }
    },
    LColumnModel_init: function(scope) {
        if(scope.defaultSortable !== true) {
            var showSortable = false;
            for(var i = 0, len = scope.getColumnCount(true); i < len; i++) {
                if(scope.getColumnAt(i).isSortable() !== true) {
                    showSortable = true;
                    break;
                }
            }
            if(showSortable) {
                var sampleUrl = this.ruiPath + '/api/index.html?type=Rui.ui.grid.LColumnModel';
                var template = new Rui.LTemplate(
                    '모든 컬럼에 sortable 속성을 적용하려면 LColumnModel에 defaultSortable 속성을 이용하세요.\n샘플 : ',
                    'http://www.dev-on.com/rui{url}'
                );
                this.message(template.apply({ url: sampleUrl}), 0);
            }
        }
        var isDupId = '';
        var dupIds = {};
        for(var i = 0, len = scope.getColumnCount(true); i < len; i++) {
            if(dupIds[scope.getColumnAt(i).getId()]) {
                isDupId = scope.getColumnAt(i).getId();
                break;
            }
            dupIds[scope.getColumnAt(i).getId()] = true;
        }
        if(isDupId) {
            var html = 'Grid에 중복된 컬럼이 존재합니다. 같은 field 값을 두개의 컬럼에 사용할 경우에는 컬럼 고유 id를 반드시 지정하세요.\n중복된 컬럼 id : ' + isDupId;
            this.message(html, 1);
        }
    },
    LSelectionColumn_constructor: function(scope) {
        if(scope.width === 28) return;
        this.message('LSelectionModel은 고정 길이로 제공되는 컬럼입니다. width를 지정하는 경우 그리드가 비정상적으로 표현될 수 있습니다.', 0);
    }
};
