var MOONBOARD_HOST = 'localhost';
MOONBOARD_HOST = document.location.hostname;
var MOONBOARD_PORT = ':8080';
var dataSet = null;
var grid = null;
var datas = [];
var modules = [];
var searchTextBox = null;
var searchBtn = null;
var searchDs = null;
var ruiPath = '/rui'; Rui.getConfig().getFirst('$.core.contextPath') + Rui.getConfig().getFirst('$.core.ruiRootPath');
var isShowDetail = Rui.getConfig().getFirst('$.ext.api.showDetail');
if(!Rui.License)
    Rui.License = 'MTI3LjAuMC4xO2xvY2FsaG9zdA==';
var params = Rui.util.LString.getUrlParams(document.location.href);
Rui.onReady(function() {

    Rui.util.LEvent.addListener(window, "resize", updateLayout, this, true);
    
    dataSet = new Rui.data.LJsonDataSet({
        id: 'dataSet',
        method: 'GET',
        focusFirstRow: false,
        fields: [
            { id: 'name' },
            { id: 'className' },
            { id: 'superClassName' },
            { id: 'depth', type: 'number', defaultValue: 0 },
            { id: 'visibility' },
            { id: 'deprecated' },
            { id: 'isStatic' },
            { id: 'plugin' },
            { id: 'dataType' },
            { id: 'currClassName' }
        ]
    });
    
    dataSet.on('rowPosChanged', function(e) {
        if(e.row < 0) return;
        var row = dataSet.getRow();
        if(row < 0) return null;
        var record = dataSet.getAt(row);
        var dataType = record.get('dataType');
        var className = record.get('className');

        if(dataType == 'package') {
            //loadPackages(type);
        } else if(dataType == 'type'){
            loadMembers();
        } else {
            loadBody(className);
        }
        
        $S('.L-detail-link').each(function(item) {
            item.dom.click();
        });
    });
    
    var _row = 0;
    var columnModel = new Rui.ui.grid.LColumnModel({
        columns: [
            /*new Rui.ui.grid.LNumberColumn(),
            { field: 'className' },*/
            { field: "name", label: " ", width: 450, renderer: function(val, p, record) {
                var dataType = record.get('dataType');
                var isStatic = record.get('isStatic');
                var className = record.get('className');
                var currClassName = record.get('currClassName');
                var visibility = record.get('visibility');
                var plugin = record.get('plugin');
                var superClassInfo = '';
                if(currClassName)
                    superClassInfo = ' - ' + className;
                var staticHtml = '';
                if(isStatic)
                    staticHtml = 'L-data-static';
                var pluginHtml = '';
                if(plugin) {
                    pluginHtml = 'L-data-plugin';
                }
                var visibilityHtml = '';
                if(visibility && visibility != 'public' && visibility != '') {
                    visibilityHtml = 'L-data-' + visibility;
                }
                return '<span class="L-data-type-' + dataType + ' L-visibility-' + visibility + '"><span class="' + staticHtml + '"></span><span class="' + pluginHtml + '"></span><span class="' + visibilityHtml + '"></span>' + val + '<span class="L-super-class-info">' + superClassInfo + '</span></span>';
            } }
        ]
    });

    var treeGridView = new Rui.ui.grid.LTreeGridView({
        defaultOpenDepth: -1,
        columnModel: columnModel,
        dataSet: dataSet,
        fields: {
            depthId: 'depth'
        },
        scrollerConfig: {
            manageSteps: true,
            scrollStep: 1,
            wheelStep: 3
        },
        treeColumnId: 'name'
    });

    grid = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel,
        dataSet: dataSet,
        view: treeGridView,
        selectionModel: new Rui.ui.grid.LTreeGridSelectionModel(),
        autoWidth: true,
        width: 174,
        height: 200
    });
    
    grid.render('treeGrid');
    
    Rui.ajax({
        url: './apiData.json',
        success: function(e) {
            datas = eval(e.responseText);
            datas.sort(function(a, b){
                var v1 = a.type || a.name;
                var v2 = b.type || b.name;
                v1 = v1.toLowerCase();
                v2 = v2.toLowerCase();
                if(v2.startsWith('prototype')) return 1;
                if(v1.startsWith('prototype') && !v2.startsWith('prototype')) return -1;
                var p1 = v1.split('.');
                var p2 = v2.split('.');
                //return (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
                if (p2.length == 3) {
                    if(!v2.startsWith('rui.ui') && v1.startsWith('rui.ui')) {
                        return 1;
                    } else if(!v1.startsWith('rui.ui') && v2.startsWith('rui.ui')) {
                        return -1;
                    }
                }

                if(p1.length === p2.length) {
                    return (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
                } else {
                    return (p1.length > p2.length ? 1 : (p1.length < p2.length ? -1 : 0));;
                }
            });
            dataSet.batch(function() {
                dataSet.add(dataSet.createRecord({
                    name: 'prototype',
                    depth: 0,
                    dataType: 'package'
                }));
                var dataSetAdFn = function(dataList, typeData, className, superClassName, attrType, depth, currClassName) {
                    var attrName = attrType + 's';
                    for(var j = 0 ; j < typeData[attrName].length; j++) {
                        if (Rui.util.LString.trim(typeData[attrName][j].name) == '') {
                            continue;
                        }
                        typeData[attrName][j].isStatic = typeData[attrName][j].scope == 'static';

                        if(typeData[attrName][j].visibility == 'private') continue;;
                        var isAdd = true;
                        for(var k = 0, klen = dataList.length ; k < klen; k++) {
                            if (dataList[k].name == typeData[attrName][j].name) {
                                isAdd = false;
                                break;
                            }
                        }
                        if(isAdd) {
                            dataList.push({
                                name: getTypeName(typeData[attrName][j].name),
                                className: className,
                                superClassName: superClassName,
                                depth: (depth + 1),
                                visibility: typeData[attrName][j].visibility,
                                plugin: typeData[attrName][j].plugin,
                                deprecated: typeData[attrName][j].deprecated,
                                isStatic: typeData[attrName][j].isStatic,
                                dataType: attrType,
                                currClassName: currClassName
                            });
                        }
                    }
                    if(superClassName && attrType !== 'constructor') {
                        var superTypeData = getType(superClassName);
                        if(superTypeData)
                        	dataSetAdFn(dataList, superTypeData, superClassName, superTypeData.superclass, attrType, depth, (currClassName || className));
                    }
                }

                var keys = {};
                for(var i = 0; i < datas.length; i++) {
                    var typeData = datas[i];
                    if(typeData.visibility == 'private') continue;
                    var depth = typeData.type.split('.').length - 1;
                    if(typeData.type.startsWith('Rui.') && depth > 1) {
                        var package = typeData.type.substring(0, typeData.type.lastIndexOf('.'));
                        if(!keys[package]) {
                            dataSet.add(dataSet.createRecord({
                                name: getTypeName(package),
                                depth: depth - 1,
                                dataType: 'package'
                            }));
                            keys[package] = true;
                        }
                    }
                    
                    typeData.isStatic = typeData.scope == 'static';

                    var superClassName = typeData.superclass;
                    var rData = {
                        name: getTypeName(typeData.type),
                        depth: depth,
                        className: typeData.type,
                        superClassName: superClassName,
                        visibility: typeData.visibility,
                        plugin: typeData.plugin,
                        deprecated: typeData.deprecated,
                        isStatic: typeData.isStatic,
                        dataType: 'type'
                    }
                    dataSet.add(dataSet.createRecord(rData));
                    var constructorList = [];
                    var configList = [];
                    var propertyList = [];
                    var eventList = [];
                    var methodList = [];
                    if(typeData.scope !== 'static')
                        dataSetAdFn(constructorList, typeData, typeData.type, superClassName, 'constructor', depth);
                    dataSetAdFn(configList, typeData, typeData.type, superClassName, 'config', depth);
                    dataSetAdFn(propertyList, typeData, typeData.type, superClassName, 'property', depth);
                    dataSetAdFn(eventList, typeData, typeData.type, superClassName, 'event', depth);
                    dataSetAdFn(methodList, typeData, typeData.type, superClassName, 'method', depth);
                    
                    var sortFn = function(a, b){
                        var v1 = a.name;
                        var v2 = b.name;
                        v1 = v1.toLowerCase();
                        v2 = v2.toLowerCase();
                        return (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
                    };

                    configList.sort(sortFn);
                    propertyList.sort(sortFn);
                    eventList.sort(sortFn);
                    methodList.sort(sortFn);

                    var dataList = [];
                    dataList = dataList.concat(constructorList);
                    dataList = dataList.concat(configList);
                    dataList = dataList.concat(propertyList);
                    dataList = dataList.concat(eventList);
                    dataList = dataList.concat(methodList);
                    for(var k = 0, klen = dataList.length; k < klen; k++) {
                        dataSet.add(dataSet.createRecord(dataList[k]));
                    }
                }
            });
            
            dataSet.commit();

            if(Rui.get('publicOnly').dom.checked) {
                dataSet.filter(function(id, record){
                    return (record.get('visibility') == 'public' || Rui.isEmpty(record.get('visibility')));
                }, this, true);
            }

            loadSearchDataSet();
            
            if(params.type) {
                var typeName = params.type;
                /*
                var memberName = null;
                var sPos = typeName.indexOf('_');
                if(sPos > 0) {
                    memberName = typeName.substring(sPos + 1);
                    typeName = typeName.substring(0, sPos);
                }
                */
                var searchTypeValue = typeName;
                if(typeName.indexOf('_') > 0) {
                	var typeNames = typeName.split('_');
                	if(typeNames.length == 3) {
                		searchTypeValue = typeNames[1];
                	} else if(typeNames.length == 2){
                		searchTypeValue = typeNames[0];
                	}
                }
                searchTextBox.setValue(typeName);
                searchBtn.click();
                searchTextBox.setValue(searchTypeValue);
            }
        },
        failure: function(e) {
            alert('데이터를 읽어 오지 못했습니다.');
        }
    })
    
    searchTextBox = new Rui.ui.form.LTextBox({
        applyTo: 'searchKey',
        width: 230,
        autoComplete: true,
        displayField: 'value',
        filterMode: 'local',
        filterFn: function(id, record) {
            var val2 = record.get(this.displayField);
            var val1 = this.getValue();
            if(val2 && val1 && val2.toLowerCase().indexOf(val1.toLowerCase()) >= 0)
                return true;
        }
    });
    
    searchTextBox.on('keydown', function(e){
        if(e.keyCode == 13) {
            searchBtn.click();
        }
    });
    
    Rui.get('publicOnly').on('click', function(e){
        var row = dataSet.getRow();
        var name = null;
        var dataType = null;
        if(row > -1) {
            name = dataSet.getNameValue(row, 'name');
            dataType = dataSet.getNameValue(row, 'dataType');
        }
        if(Rui.get('publicOnly').dom.checked) {
            dataSet.filter(function(id, record){
                return (record.get('visibility') == 'public' || Rui.isEmpty(record.get('visibility')));
            }, this, false);
        } else {
            dataSet.clearFilter(false);
        }

        dataSet.setRow(0);

        loadSearchDataSet();
    });

    searchDs = searchTextBox.getDataSet();
    
    searchBtn = Rui.get('searchBtn');
    searchBtn.on('click', function(e){
        var value = searchTextBox.getValue();
        if(Rui.isEmpty(value) || value.length < 2) return;
        searchType(value);
        searchTextBox.focus();
        Rui.select('.L-body-scroller').getAt(0).dom.scrollTop = 0;
        //loadMembers();
    });
    
    updateLayout();
    searchTextBox.focus();
    if(document.domain == 'localhost' || document.domain == '127.0.0.1') {
        var versionDomain = 'http://www.dev-on.com/rui';
        window['newVersion'] = function(data) {
            var template = new Rui.LTemplate('<fieldset>',
                '<legend>최신버전 정보</legend><ul class="L-view-list L-api-notification">',
                '<li>현재 버전: {curVerion}</li>',
                '<li>최신 버전: {newVersion}</li></ul>',
                '</fieldset>');
            var html = template.apply({ curVerion: Rui.env.getVersion(), newVersion: data });
            Rui.select('.L-view-body').appendChild(html)
        };
        var url = versionDomain + '/rui2/version.txt?callback=newVersion';
        Rui.ajax({
            crossDomain: true,
            url: url
        })
    }
    // var boardId = params.boardId || '';
    // var url = 'http://' + MOONBOARD_HOST + MOONBOARD_PORT + ruiPath + '/moonboard/boards/boardList.dev?boardType=api&boardId=' + boardId + '&category=notice&isMenu=N&thema=api&title=Information&mainDomain=' + document.location.host;
    // var moonBoardHtml = '<iframe src="' + url + '" height="100%" width="90%" style="border: 0px solid #fff;" class="moonBoard"></iframe><div class="LblockLine"></div>';
    // Rui.select('.L-view-body').appendChild(moonBoardHtml);
});

function loadSearchDataSet() {
    var dataList = [];
    for(var i = 0; i < datas.length; i++) {
        if(datas[i].visibility && datas[i].visibility === 'private') continue;
        dataList.push({code: datas[i].type, value: datas[i].type, obj: datas[i]});
    }

    searchDs.loadData({
        records: dataList
    });
}

function searchType(value) {
    var memberType = null;
    var memberName = null;
    var sPos = value.indexOf('_');
    var typeName = value;
    if(sPos > 0) {
        var values = value.split('_');
        memberType = values[0];
        memberName = values[2];
        typeName = values[1];
    }

    var typeData = null;
    for(var i = 0 ; i < datas.length ; i++) {
        if(datas[i].type.toLowerCase() == typeName.toLowerCase()) {
            typeData = datas[i];
            break;
        }
    }
    if (typeData) {
        var row = -1;
        for(var i = 0, ilen = dataSet.getCount(); i < ilen; i++){
            var record = dataSet.getAt(i);
            if(record.get('className') == typeData.type && record.get('dataType') == 'type') {
                row = i;
                break;
            }
        };
        if(row > -1) {
            if(memberType) {
                var mRow = -1;
                for(var i = row + 1, ilen = dataSet.getCount(); i < ilen; i++){
                    var record = dataSet.getAt(i);
                    if(record.get('className') == typeData.type 
                        && record.get('dataType') == memberType.substring(0, memberType.length - 1)
                        && memberName == record.get('name')) {
                        mRow = i;
                        break;
                    }
                };
                if(mRow > -1)
                    row = mRow;
            }
            grid.getView().expand(row);
            dataSet.setRow(row);
        }
    }
}

function getModule(name){
    for(var i = 0 ; i < modules.length ; i++) {
        if(modules[i].name == name) {
            return modules[i];
        }
    }
    var module = {
        name: name,
        classes: []
    };
    modules.push(module);
    return module;
}

function sortFn(vo1, vo2){
    var r1 = vo1.name;
    var r2 = vo2.name;
    return r1 > r2 ? 1 : (r1 < r2 ? -1 : 0);
}


function getPackages(moduleName) {
    for(var i = 0 ; i < modules.length; i++) {
        var name = modules[i].name;
        if(name == moduleName) {
            return modules[i].classes;
        }
    }
    return null;
}

function getTypes(moduleName, packageName) {
    var types = [];
    for(var i = 0 ; i < datas.length; i++) {
        if(moduleName != datas[i].module) continue;
        var name = datas[i].type;
        var sPos = name.lastIndexOf(".");
        var pName = '';
        if(sPos > 0) {
            pName = name.substring(0, sPos);
        }
        if(pName == packageName) {
            if(!Rui.util.LArray.contains(types, name)) types.push(datas[i]);
        }
    }
    return types;
}

function loadMembers() {
    var bodyHtml = getBodyClass();

    $S('.L-body .L-view-body').html(bodyHtml);
    var row = dataSet.getRow();
    if(row > -1) {
        var title = dataSet.getNameValue(row, 'name');
        var typeName = dataSet.getNameValue(row, 'className');
    	updateBodyTitle(title, typeName);
    }
    $S('h4').unOnAll();
    $S('h4').on('click', function(e){
        var tableTypesEl = $E(this).getNextSibling();
        if(tableTypesEl.isShow()) tableTypesEl.hide();
        else tableTypesEl.show();
    });
    //$S('.L-detail-link').getAt(0).dom.click();
}

function getMembers(fullTypeName) {
    var members = {
        configs: [],
        events: [],
        propertys: [],
        methods: []
    };
    var superClassName = null;
    for(var i = 0 ; i < datas.length; i++) {
        var name = datas[i].type;
        if(fullTypeName == null) break;
        if(name == fullTypeName) {
            for(var j = 0 ; j < datas[i].configs.length; j++) {
                if(!Rui.util.LArray.contains(members.configs, name)) {
                    datas[i].configs[j].superClassName = superClassName;
                    members.configs.push(datas[i].configs[j]);
                }
            }
            for(var j = 0 ; j < datas[i].propertys.length; j++) {
                if(!Rui.util.LArray.contains(members.propertys, name)) {
                    datas[i].propertys[j].superClassName = superClassName;
                    members.propertys.push(datas[i].propertys[j]);
                }
            }
            for(var j = 0 ; j < datas[i].events.length; j++) {
                if(!Rui.util.LArray.contains(members.events, name)) {
                    datas[i].events[j].superClassName = superClassName;
                    members.events.push(datas[i].events[j]);
                }
            }
            for(var j = 0 ; j < datas[i].methods.length; j++) {
                if(!Rui.util.LArray.contains(members.methods, name)) {
                    datas[i].methods[j].superClassName = superClassName;
                    members.methods.push(datas[i].methods[j]);
                }
            }
            
            if (!Rui.isEmpty(datas[i].superclass)) {
                fullTypeName = datas[i].superclass;
                superClassName = fullTypeName;
                i = 0;
            } else fullTypeName = null;
        }
    }
    return members;
}

function getSelectedName(name) {
    var row = dataSet.getRow();
    if(row < 0) return null;
    var record = dataSet.getAt(row);
    if (name == 'package') {
        if(record.get('dataType') == 'package')
            return record.get('name');
        var className = record.get('className');
        if(className)
            return getPackageName(className);
    } else if (name == 'type') {
        if(record.get('dataType') == 'type')
            return record.get('className');
        var className = record.get('className');
        if(className)
            return className;
    } else if (name == 'member') {
        if(record.get('dataType') !== 'package' && record.get('dataType') !== 'type')
            return record.get('name');
    }
    return null;
}

function getType(fullTypeName) {
    for (var i = 0; i < datas.length; i++) {
        if(datas[i].type == fullTypeName) return datas[i];
    }
    return null;
}

function loadBody(e) {
    var packageName = getSelectedName('package');
    var typeName = getSelectedName('type');
    var memberName = getSelectedName('member');
    var row = dataSet.getRow();
    if(row < 0) return null;
    var record = dataSet.getAt(row);

    var dataType = record.get('dataType');
    var className = record.get('className');
    var superClassName = record.get('superClassName');
    var currClassName = record.get('currClassName');
    var memberName = record.get('name');
    var type = getType(className);
    
    var bodyHtml = '';
    if(dataType == 'event') {
        bodyHtml = getBodyEvent(type, memberName, currClassName);
    }

    if(dataType == 'constructor') {
        bodyHtml = getBodyConstructor(type, memberName, currClassName);
    }

    if(dataType == 'config') {
        bodyHtml = getBodyConfig(type, memberName, currClassName);
    }

    if(dataType == 'property') {
        bodyHtml = getBodyProperty(type, memberName, currClassName);
    }

    if(dataType == 'method') {
        bodyHtml = getBodyMethod(type, memberName, currClassName);
    }
    $S('.L-body .L-view-body').html(bodyHtml);
    
    var titleType = (currClassName || type.type);
    updateBodyTitle(titleType.substring(titleType.lastIndexOf('.') + 1), titleType);

    //$S('.L-detail-link').getAt(0).dom.click();
}

function getTypeName(name) {
    var sPos = name.lastIndexOf(".");
    if(sPos > 0) {
        name = name.substring(sPos + 1);
    }
    return name;
}

function getPackageName(name) {
    var sPos = name.lastIndexOf(".");
    if(sPos > 0) {
        name = name.substring(0, sPos);
        return name;
    }
    return '';
}

function getParameterHtml(parameters) {
    var t = new Rui.LTemplate(
        '{type} {name}'
    );
    
    var html = [];
    for(var i = 0 ; i < parameters.length; i++) {
        html.push(t.apply({
            type: getTypeLink(parameters[i].type),
            name: parameters[i].name
        }));
    }
    return html.join(', ');
}

function getParameterDetailHtml(type, name, parameters) {
    var t = new Rui.LTemplate(
        '<div>{name} &lt;{type}&gt; {description}</div>',
        '<div class="L-member-sample">{sample}</div>'
    );
    
    var html = [];
    for(var i = 0 ; i < parameters.length; i++) {
        var parameter = parameters[i];
        html.push(t.apply({
            type: getTypeLink(parameter.type),
            name: parameter.name,
            description: replaceCarriageReturn(replaceTag(parameter.description)),
            sample: getSample(type, parameter, name)
        }));
    }
    return html.join('');
}

function getHierarchy(type, superclass) {
    var hierarchy = {
        superclass: [],
        currentclass: type,
        subclasses: []
    };
    
    for(var i = 0 ; i < dataSet.getCount(); i++) {
        var record = dataSet.getAt(i);

        if(record.get('dataType') != 'type') continue;
        if(type == record.get('superClassName')) {
            hierarchy.subclasses.push(record);
        } 
        if(superclass != '' && superclass == record.get('className')) {
            var superClassName = record.get('superClassName');
            var superHierarchy = null;
            if(superClassName) {
                superHierarchy = getHierarchy(record.get('className'), superClassName);
                hierarchy.superclass = hierarchy.superclass.concat(superHierarchy.superclass);
                hierarchy.superclass.push(record);
            } else {
                hierarchy.superclass.push(record);
            }
        } 
    }
    
    return hierarchy;
}

function showDetail(aDom, pageurl, url) {
    var aEl = Rui.get(aDom);
    var detailEl = aEl.parent().select('.L-detail');
    if(aEl.getHtml() == 'show detail') {
        aEl.html('hide detail');
        detailEl.setStyle('display', 'block');
    } else {
        aEl.html('show detail');
        detailEl.setStyle('display', 'none');
    }
    Rui.ajax({
       url: url,
       success: function(e) {
           var responseText = e.responseText;
           loadHtmlEl = Rui.createElements(responseText);
           if(loadHtmlEl.select('.' + pageurl).length > 0) {
               var loadEl = loadHtmlEl.select('.' + pageurl).getAt(0);
               var detailHtml = '';
               detailHtml = loadEl.getHtml();
               detailEl.html(detailHtml);
           }
       },
       failure: function(e) {
           alert('조회된 샘플 페이지 없습니다.');
           throw e;
       },
       sync: true
    });
    //Rui.util.LEvent.stopEvent(window.event);
}

function getSample(type, member, showType) {
    var sample = '';
    if(isShowDetail == true) {
        if(member.sample && !showType.endsWith('_')) {
            if(member.sample == 'default') {
                var samplePath = (type.type || type.name).replace(/[.]/g, '/');
                if(samplePath !== 'Rui')
                    samplePath = samplePath.replace('Rui', '');
                sample = '<div><a class="L-detail-link" onclick="showDetail(this, \'' + showType + '\', \'./details/' + samplePath + '.html\');">show detail</a><div class="L-detail"></div></div>';
            } else {
                sample = '<div><a class="L-detail-order-link" href="' + (member.sample || type.sample) + '" target="_sample">샘플 보기</a>';
                
            }
        }
    } 
    return sample;
}

function updateLayout() {
    var height = Rui.util.LDom.getViewportHeight();
    var width = Rui.util.LDom.getViewportWidth();
    Rui.getBody().setHeight(height);
    
    var bodyScrollerEl = Rui.select('.L-body-scroller').getAt(0);
    bodyScrollerEl.setHeight(height - 20);
    bodyScrollerEl.setWidth(width - 200);
    
    var lBodyEl = Rui.select('.L-body').getAt(0);
    //lBodyEl.setHeight(height - 22);
    if(Rui.browser.msie678)
        lBodyEl.setWidth(width - 420);
    else
        lBodyEl.setWidth(width - 260);

    var bodyHeight = Rui.select('.L-body-scroller').getAt(0).getHeight();
    grid.setHeight(height - 100);
}

function replaceCarriageReturn(html) {
    return '<br/>' + Rui.util.LString.simpleReplace(html, '\n', '<br/>');
}

function replaceTag(html) {
    html = Rui.util.LString.simpleReplace(html, '&amp;', '&');
    html = Rui.util.LString.simpleReplace(html, '    ', '&nbsp;&nbsp;&nbsp;&nbsp;');
    return html;
}

function getTypeLink(type) {
    if(Rui.isEmpty(type)) return type;
    if(Rui.util.LString.startsWith(type, "Rui."))
        return '<a href="javascript:showType(\'' + type + '\')">' + type + '</a>';
    return type;
}

function showType(type) {
    searchTextBox.setValue(type);
    searchBtn.click();
}

function getBodyClass() {
    var row = dataSet.getRow();
    if(row < 0) {
        return '데이터가 없습니다.';
    }
    var bodyHtml = '';
    var record = dataSet.getAt(row);
    var typeName = record.get('name');
    var className = record.get('className');
    var superClassName = record.get('superClassName');
    var type = getType(className);

    var mt = new Rui.LTemplate(
        '<h3>Class:</h3>',
        '{plugin}',
        '<div class="L-member-title">',
        '<div>',
        '<div class="L-hierarchy">',
        '<span class="L-member-superclass">{superClass}</span>',
        '<span class="L-member-subclasses">{subClasses}</span>',
        '</div>',
        '<span class="L-member-return-type">{visibility} {scope}</span> ',
        'Class <span class="L-member-name {deprecated}">{typeName}</span>',
        '</div>',
        '</div>',
        '<div class="L-member-body">',
        '<div class="L-member-description">{description}</div>',
        '<div class="L-member-sample">{sample}</div>',
        '<h4>Parameters:</h4>',
        '<div class="L-member-parameters-detail">{parameterDetail}</div>',
        '</div>',
        '</div>'
    );

    var hierarchy = getHierarchy(className, superClassName);

    var level = 0;
    var superClass = '';
    for(var i = 0 ; i < hierarchy.superclass.length ; i++, level++) {
        superClass += '<div class="L-hierarchy-level' + level + '">- ' + getTypeLink(hierarchy.superclass[i].get('className')) + '</div>';
    }    

    superClass += '<div class="L-hierarchy-level' + level + '">- ' + className + '</div>';
    level++;

    var subClasses = '';
    var hierarchyData = [];
    for(var i = 0 ; i < hierarchy.subclasses.length ; i++) {
        subClasses += '<div class="L-hierarchy-level' + level + '">- ' + getTypeLink(hierarchy.subclasses[i].get('className')) + '</div>';
    }

    var parameterDetail = '';
    if(type.scope == 'instance') {
        parameterDetail = getParameterDetailHtml(type, 'config_', type.constructors[0].parameters);
    }

    var plugin = getPluginHtml(type);
    
    bodyHtml = mt.apply({
        plugin: plugin,
        visibility: type.visibility,
        typeName: type.type,
        description: replaceTag(type.description),
        scope: type.scope,
        superClass: superClass,
        subClasses: subClasses,
        sample: getSample(type, type, 'class_description'),
        deprecated: (type.deprecated ? 'L-deprecated' : ''),
        parameterDetail: parameterDetail
    });
    
    //if(type.constructors.length > 0)
        bodyHtml += getMemeberBodyHtml('constructors', type);
    
    //if(type.configs.length > 0)
        bodyHtml += getMemeberBodyHtml('configs', type);
        //bodyHtml += getBodyConfig(type, type.configs[i].name);

    //if(type.propertys.length > 0)
        bodyHtml += getMemeberBodyHtml('propertys', type);
        //bodyHtml += getBodyProperty(type, type.propertys[i].name);

    //if(type.events.length > 0)
        bodyHtml += getMemeberBodyHtml('events', type);
        //bodyHtml += getBodyEvent(type, type.events[i].name);

    //if(type.methods.length > 0)
        bodyHtml += getMemeberBodyHtml('methods', type);
        //bodyHtml += getBodyMethod(type, type.methods[i].name);

    // var width = Rui.select('.L-view-body').getAt(0).getWidth(false) - 70;
    // bodyHtml += getMoonBoardHtml({
    //     boardName: 'class_' + className.replace(/[.]/g, '_'),
    //     width: width
    // });
    return bodyHtml;
}

function getMemeberBodyHtml(dataType, type) {
    var mtTable = new Rui.LTemplate(
        '<table class="L-table-types">',
        '{rows}',
        '</table>'
    );

    var mtRow = new Rui.LTemplate(
        '<tr class="L-table-types-row {css}">',
        '{tds}',
        '</tr>'
    );
    
    var html = '<td style="width: 100px;">속 성</td><td style="width: 100px;">이 름</td><td style="min-width:500px">설 명</td>';
    var rowsHtml = mtRow.apply({ tds: html, css: 'L-table-types-header' });
    var checkDupData = {};
    var rowData = getMemeberBodyRowHtml(mtRow, dataType, type, type.type, checkDupData);
    rowData.rowsHtml = rowData.rowsHtml.sort(function(v1, v2) {
        ret = (v1.name > v2.name ? 1 : -1);
        return ret;
    });
    for(var i = 0 ; i < rowData.rowsHtml.length; i++) {
        rowsHtml += rowData.rowsHtml[i].html;
    }
    var memberCnt = rowData.memberCnt;
    
    var dataTypeName = dataType;
    if(dataTypeName === 'propertys') dataTypeName = 'properties';

    var bodyHtml = '<h4 class="L-table-types-title">' + Rui.util.LString.firstUpperCase(dataTypeName) + ' : ' + memberCnt + '개</h4>';

    bodyHtml += mtTable.apply({ rows: rowsHtml });
    return bodyHtml;
}

function getMemeberBodyRowHtml(mtRow, dataType, type, currClassName, checkDupData) {
    var className = type.type;
    var dataTypeName = dataType.substring(0, dataType.length - 1);
    var isPublicOnly = Rui.get('publicOnly').dom.checked;
    var memberCnt = 0;
    var rowsHtml = []; 
    for(var i = 0, len = type[dataType].length; i < len; i++) {
        if(dataType == 'constructors' && currClassName != type.type) continue;
        var memberData = type[dataType][i];
        if(memberData.visibility == 'private') continue;;
        if(isPublicOnly && memberData.visibility == 'protected') continue;
        memberCnt++;
        var name = memberData.name;
        var dupName = name.replace(/[.]/g, '');
        if(checkDupData[dupName]) continue;
        //if(name == 'serializeModified') debugger;
        checkDupData[dupName] = true;
        var description = memberData.description;
        description = Rui.util.LString.simpleReplace(description,'&amp;lt;', '<');
        description = Rui.util.LString.simpleReplace(description,'&amp;gt;', '>');
        var isStatic = memberData.isStatic;
        var visibility = memberData.visibility;
        var plugin = memberData.plugin;
        var staticHtml = '';
        if(isStatic)
            staticHtml = 'L-data-static';
        var pluginHtml = '';
        if(plugin) {
            pluginHtml = 'L-data-plugin';
        }
        var visibilityHtml = '';
        if(visibility && visibility != 'public' && visibility != '') {
            visibilityHtml = 'L-data-' + visibility;
        }
        
        var superClassHtml = '';
        if(type.type !== currClassName) {
            superClassHtml = '<span class="L-super-class-info"> - ' + type.type + '</span>';
        }

        var icon = '<span class="L-data-type-' + dataTypeName + '"><span class="' + staticHtml + '"></span><span class="' + pluginHtml + '"></span><span class="' + visibilityHtml + '"></span>&nbsp;</span>';            
        
        var tdHtml = '<td class="L-table-types-td L-table-types-icon">' + icon + '</td>';
        tdHtml += '<td class="L-table-types-td L-table-types-name L-visibility-' + visibility + '">';
        tdHtml += '<a href="javascript:loadMemberBody(\'' + dataType + '\', \'' + className + '\', \'' + currClassName + '\', \'' + name + '\')">';
        tdHtml += name;
        tdHtml += '</a>' + superClassHtml + '</td>';
        tdHtml += '<td class="L-table-types-td L-table-types-description">' + description + '</td>';
        
        rowsHtml.push({ name: name, html: mtRow.apply({ tds: tdHtml, css: '' }) });
    }
    
    if(dataType != 'constructors' && type.superclass) {
        var rowData = getMemeberBodyRowHtml(mtRow, dataType, getType(type.superclass), currClassName, checkDupData);
        rowsHtml = Rui.util.LArray.concat(rowsHtml, rowData.rowsHtml);
        memberCnt += rowData.memberCnt;
    }
    return {rowsHtml: rowsHtml, memberCnt: memberCnt };
}

function loadMemberBody(dataType, className, currClassName, memberName) {
    var row = -1;
    for(var i = 0, ilen = dataSet.getCount(); i < ilen; i++){
        var record = dataSet.getAt(i);

        if(dataType == 'constructors'){
            var temp = memberName.split(".");
            memberName = temp[temp.length-1];
            if(record.get('className') == className && record.get('dataType') == dataType.substring(0, dataType.length - 1)&& record.get('name') == memberName){
                row = i;
                break;
            }
        }else if(record.get('className') == className && record.get('name') == memberName && record.get('dataType') == dataType.substring(0, dataType.length - 1)){
            if(record.get('currClassName') && record.get('currClassName') == currClassName){
                row = i;
                break;
            }else if(!record.get('currClassName') && record.get('className') == currClassName){
                row = i;
                break;
            }else{
                row = i;
                continue;
            }
        }     
    };
    if(row > -1) {
        grid.getView().expand(row);
        dataSet.setRow(row);
    }
}

function toogleShow(obj) {
    alert(obj);
}

function getBodyEvent(type, memberName, currClassName) {
    var mt = new Rui.LTemplate(
        '<h3>Event:</h3>',
        '{plugin}',
        '<div class="L-member-title">{visibility}',
        '<span class="L-member-return-type">{returnType}</span> ',
        '<span class="L-member-name {deprecated}">{name}</span>',
        '<div class="L-member-description">{description}</div>',
        '{defaultSample}',
        '</div>',
        '<div class="L-member-body">',
        '<h4>Parameters:</h4>',
        '<div class="L-member-parameter-detail">{parameterDetail}</div>',
        '<h4>Returns:</h4>',
        '<div class="L-member-return-detail">{returnDetail}</div>',
        '<div class="L-member-sample">{sample}</div>',
        '</div>'
    );
    var bodyHtml = '';
    for(var i = 0 ; i < type.events.length ; i++) {
        if(type.events[i].name == memberName) {
            var event = type.events[i];
            var plugin = getPluginHtml(type, event);
            var instanceName = (currClassName || type.type);

            var visibility = event.visibility == 'protected' ? ('<font color="red" title="외부 메소드로 호출할 수 없습니다.">' + event.visibility + '</font>') : event.visibility;

            if(visibility === 'public') {
                var defaultSample = '';
                defaultSample = '<br/><br/>' + getInstanceName(instanceName) + '.on(\'' + event.name + '\', function(e) {<br/>';
                for(var j = 0 ; j < event.parameters.length; j++) {
                	defaultSample += '&nbsp;&nbsp;&nbsp;&nbsp;e.' + event.parameters[j].name + '; //' + event.parameters[j].description + '<br/>';
                }
                defaultSample += '});';
            }

            bodyHtml = mt.apply({
                plugin: plugin,
                visibility: visibility,
                name: event.name,
                description: replaceTag(event.description),
                returnType: getTypeLink(event.returnType),
                sample: getSample(type, event, 'event_' + event.name),
                deprecated: (type.events[i].deprecated ? 'L-deprecated' : ''),
                defaultSample: defaultSample,
                parameterDetail: getParameterDetailHtml(type, 'event_' + event.name, event.parameters),
                returnDetail: Rui.isEmpty(event.returnType) ? 'void' : getTypeLink(event.returnType)
            });
            break;
        }
    }
    
    // var width = Rui.select('.L-view-body').getAt(0).getWidth(false) - 60;
    // var boardName = ('events_' + type.type + '_' + memberName).replace(/[.]/g, '_');
    // bodyHtml += getMoonBoardHtml({
    //     boardName: boardName,
    //     width: width
    // });
    return bodyHtml;
}

function getBodyConstructor(type, memberName, currClassName) {
    var packageName = getSelectedName('package');
    var mt = new Rui.LTemplate(
        '<h3>Constructor:</h3>',
        '<div class="L-member-title">{visibility} ',
        '<span class="L-member-name {deprecated}">{name}</span>',
        '</div>',
        '<div class="L-member-body">',
        '<div class="L-member-description">{description}</div>',
        '<div class="L-member-sample">{sample}</div>',
        '<h4>Parameters:</h4>',
        '<div class="L-member-parameter-detail">{parameterDetail}</div>',
        '</div>'
    );
    var bodyHtml = '';
    if(0 < type.constructors.length) {
        var constructor = type.constructors[0];
        bodyHtml = mt.apply({
            visibility: constructor.visibility,
            name: constructor.name,
            description: replaceTag(constructor.description),
            sample: getSample(type, constructor, 'constructor_' + constructor.name),
            deprecated: (constructor.deprecated ? 'L-deprecated' : ''),
            parameterDetail: getParameterDetailHtml(type, 'constructor_' + constructor.name, constructor.parameters)
        });
    }
    // var width = Rui.select('.L-view-body').getAt(0).getWidth(false) - 60;
    // var boardName = ('constructors_' + type.type + '_' + memberName).replace(/[.]/g, '_');
    // bodyHtml += getMoonBoardHtml({
    //     boardName: boardName,
    //     width: width
    // });

    return bodyHtml;
}

function getBodyConfig(type, memberName, currClassName){
    var mt = new Rui.LTemplate(
        '<h3>Config:</h3>',
        '{plugin}',
        '<div class="L-member-title">{visibility} ',
        '<span class="L-member-name {deprecated}">{name}</span>',
        '<div class="L-member-description">{description}</div>',
        '<div class="L-default-sample">{defaultSample}</div>',
        '</div>',
        '<div class="L-member-body">',
        '<div class="L-member-sample">{sample}</div>',
        '<h4>Type:</h4>',
        '<div class="L-member-object-type">{objectType}</div>',
        '<h4>Default Value:</h4>',
        '<div class="L-member-default-value">{defaultValue}</div>',
        '</div>'
    );

    var isPublicOnly = Rui.get('publicOnly').dom.checked;
    var bodyHtml = '';
    for(var i = 0 ; i < type.configs.length ; i++) {
        if(type.configs[i].name == memberName) {
            var config = type.configs[i];
            if(isPublicOnly && config.visibility != 'public') continue;
            var plugin = getPluginHtml(type, config);
            var defaultSample = '<br/><br/>new ' + (currClassName || type.type) + '({ ';
            defaultSample += type.configs[i].name + ': ' + type.configs[i].defaultValue + ' });<br/><br/>';
 
            var visibility = config.visibility == 'protected' ? ('<font color="red" title="외부 메소드로 호출할 수 없습니다.">' + config.visibility + '</font>') : config.visibility;
            bodyHtml = mt.apply({
                plugin: plugin,
                visibility: visibility,
                name: config.name,
                description: replaceTag(config.description),
                sample: getSample(type, config, 'config_' + config.name),
                deprecated: (config.deprecated ? 'L-deprecated' : ''),
                defaultValue: config.defaultValue,
                objectType: config.type,
                defaultSample: defaultSample
            });
            break;
        }
    }
    
    // var width = Rui.select('.L-view-body').getAt(0).getWidth(false) - 60;
    // var boardName = ('configs_' + type.type + '_' + memberName).replace(/[.]/g, '_');
    // bodyHtml += getMoonBoardHtml({
    //     boardName: boardName,
    //     width: width
    // });
    return bodyHtml;
}

function getBodyProperty(type, memberName, currClassName){
    var mt = new Rui.LTemplate(
        '<h3>Property:</h3>',
        '{plugin}',
        '<div class="L-member-title">',
        '<span class="L-member-return-type">{visibility} {returnType}</span> ',
        '<span class="L-member-name {deprecated}">{name}</span>',
        '</div>',
        '<div class="L-member-body">',
        '<div class="L-member-description">{description}</div>',
        '<h4>Type:</h4>',
        '<div class="L-member-object-type">{objectType}</div>',
        '<div>{defaultSample}</div>',
        '<div class="L-member-sample">{sample}</div>',
        '</div>'
    );
    var isPublicOnly = Rui.get('publicOnly').dom.checked;
    var bodyHtml = '';
    for(var i = 0 ; i < type.propertys.length ; i++) {
        if(type.propertys[i].name == memberName) {
            var property = type.propertys[i];
            if(isPublicOnly && property.visibility != 'public') continue;
            var plugin = getPluginHtml(type, property);

            var visibility = property.visibility == 'protected' ? ('<font color="red" title="외부 메소드로 호출할 수 없습니다.">' + property.visibility + '</font>') : property.visibility;

            var defaultSample = '';
            if(visibility === 'public') {
                var instanceName = (currClassName || type.type);
                instanceName = getInstanceName(instanceName);
                var defaultSample = '';
                if(property.scope === 'static') {
                    defaultSample += '<br/><br/>alert(' + (currClassName || type.type) + '.' + type.propertys[i].name + ');<br/><br/>';
                } else {
                    defaultSample += '<br/><br/>var ' + instanceName + ' = new ' + (currClassName || type.type) + '();<br/><br/>';
                    defaultSample += 'alert(' + instanceName + '.' + type.propertys[i].name + ');<br/><br/>';
                }
            }

            bodyHtml = mt.apply({
                plugin: plugin,
                visibility: visibility,
                name: property.name,
                description: replaceTag(property.description),
                sample: getSample(type, property, 'property_' + property.name),
                deprecated: (property.deprecated ? 'L-deprecated' : ''),
                returnType: getTypeLink(property.returnType),
                objectType: getTypeLink(property.type),
                defaultSample: defaultSample
            });
            break;
        }
    }
    
    // var width = Rui.select('.L-view-body').getAt(0).getWidth(false) - 60;
    // var boardName = ('propertys_' + type.type + '_' + memberName).replace(/[.]/g, '_');
    // bodyHtml += getMoonBoardHtml({
    //     boardName: boardName,
    //     width: width
    // });

    return bodyHtml;
}

function getBodyMethod(type, memberName, currClassName) {
    var mt = new Rui.LTemplate(
        '<h3>Method:</h3>',
        '{plugin}',
        '<div class="L-member-title">',
        '<span class="L-member-scope">{visibility} {scope}</span> ',
        '<span class="L-member-return-type">{returnType}</span> ',
        '<span class="L-member-name {deprecated}">{name}</span>',
        '({parameterHtml})',
        '</div>',
        '<div class="L-member-body">',
        '<div class="L-member-description">{description}</div>',
        '<div class="L-member-sample">{sample}</div>',
        '<h4>Parameters:</h4>',
        '<div class="L-member-parameter-detail">{parameterDetail}</div>',
        '<h4>Returns:</h4>',
        '<div class="L-member-return-detail">{returnDetail}</div>',
        '</div>'
    );
    var bodyHtml = '';
    for(var i = 0 ; i < type.methods.length ; i++) {
        if(type.methods[i].name == memberName) {
            var method = type.methods[i];
            var plugin = getPluginHtml(type, method);
            var returnDetail = Rui.isEmpty(method.returnType) ? '{void}' : '{' + getTypeLink(method.returnType) + '}';
            if(method.returnDescription) {
                returnDetail += ' ' + method.returnDescription;
            }
            var visibility = method.visibility == 'protected' ? ('<font color="red" title="외부 메소드로 호출할 수 없습니다.">' + method.visibility + '</font>') : method.visibility;
            bodyHtml = mt.apply({
                plugin: plugin,
                visibility: visibility,
                scope: method.scope == 'instance' ? '' : method.scope,
                name: method.name,
                description: replaceTag(method.description),
                returnType: getTypeLink(method.returnType),
                sample: getSample(type, method, 'method_' + method.name),
                deprecated: (method.deprecated ? 'L-deprecated' : ''),
                parameterHtml: getParameterHtml(method.parameters),
                parameterDetail: getParameterDetailHtml(type, 'method_' + method.name, method.parameters),
                returnDetail: returnDetail
            });
            break;
        }
    }
    
    // var width = Rui.select('.L-view-body').getAt(0).getWidth(false) - 60;
    // var boardName = ('methods_' + type.type + '_' + memberName).replace(/[.]/g, '_');
    // bodyHtml += getMoonBoardHtml({
    //     boardName: boardName,
    //     width: width
    // });

    return bodyHtml;
}

function getPluginHtml(type, obj) {
    var html = '';
    if(obj) {
        if(type.plugin) {
            var plugins = type.plugin.split(',');
            var pluginHtml = '';
            for(var i = 0, len = plugins.length; i < len ; i++) {
                pluginHtml = plugins[i];
                var pluginType = pluginHtml;
                if(pluginHtml == 'plugin' || pluginType == 'js' || pluginType == 'css') {
                    pluginHtml = '/' + type.type.replace(/[.]/g, '/').replace('Rui', 'plugins') + '.' + (pluginHtml == 'plugin' ? 'js' : pluginType);
                }
                if(pluginType === 'css')
                	html += '<div class="L-plugin">Plugin style : &lt;link type="text/css" rel="stylesheet" href="' + ruiPath + pluginHtml + '"/&gt;</div>';
                else
                	html += '<div class="L-plugin">Plugin script : &lt;script type="text/javascript" src="' + ruiPath + pluginHtml + '"&gt;&lt;/script&gt;</div>';
            }
        } else if(obj.plugin){
            var plugins = obj.plugin.split(',');
            var pluginHtml = '';
            for(var i = 0, len = plugins.length; i < len ; i++) {
                pluginHtml = plugins[i];
                if(pluginHtml == 'plugin') {
                    pluginHtml = '/' + type.type.replace(/[.]/g, '/').replace('Rui', 'plugins') + '.js';
                }
                html += '<div class="L-plugin">Plugin script : &lt;script type="text/javascript" src="' + ruiPath + pluginHtml + '"&gt;&lt;/script&gt;</div>';
            }
        }
    } else {
        if (type.plugin) {
            var plugins = type.plugin.split(',');
            var pluginHtml = '';
            for (var i = 0, len = plugins.length; i < len; i++) {
                pluginHtml = plugins[i];
                var pluginType = '';
                if (pluginHtml == 'plugin' || pluginHtml == 'js' || pluginHtml == 'css') {
                    pluginHtml = '/' + type.type.replace(/[.]/g, '/').replace('Rui', 'plugins');
                   
                    pluginType = plugins[i] === 'css' ? '.css' : '.js';
                }
                if(plugins[i] === 'css' || (plugins[i].length > 2 && plugins[i].substring(plugins[i].length - 3) == 'css')) {
                    html += '<div class="L-plugin">Plugin style : &lt;link type="text/css" rel="stylesheet" href="' + ruiPath + pluginHtml + pluginType + '"/&gt;</div>';
                } else {
                    html += '<div class="L-plugin">Plugin script : &lt;script type="text/javascript" src="' + ruiPath + pluginHtml + pluginType + '"&gt;&lt;/script&gt;</div>';
                }
            }
        }
    }
    return html;
}

// function getMoonBoardHtml(options) {
// 	//return '';
// 	options = options || { };
// 	options = Rui.applyIf(options, { width: 500, height: 0, boardName: 'default'});
//     var boardId = params.boardId || '';
//     var url = 'http://' + MOONBOARD_HOST + MOONBOARD_PORT + ruiPath + '/moonboard/boards/boardList.dev?boardType=' + options.boardName + '&boardId=' + boardId + '&category=qna&isMenu=N&thema=api&mainDomain=' + document.location.host;
//     return '<iframe src="' + url + '" height="' + options.height + 'px" width="' + options.width + 'px" style="border: 0px solid #fff;" class="moonBoard"></iframe>';
// }

function resizeBoardIframe( height ) {
	if(height < 400) height = 400;
    Rui.select('.moonBoard').setHeight(height);
}

function getInstanceName(obj) {
	var name = obj.substring(obj.lastIndexOf('.') + 2);
	return Rui.util.LString.firstLowerCase(name);
}

function updateBodyTitle(title, typeName) {
    var title = '<a href="javascript:searchType(\'' + typeName + '\')">' + typeName + '</a>';
	$S('.L-body .L-view-header h2').html(title);
}