<%@ include file="./../common/include/doctype.jspf"%>
<html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%--
/**
 *------------------------------------------------------------------------------
 * PROJ : Package Based Framework
 * Copyright 2008 LG CNS All rights reserved
 *------------------------------------------------------------------------------
 */
--%>
<head>
<%@ include file="./../common/include/head.jspf" %>
<%@ include file="./../common/include/rui.jspf" %>
<script type="text/javascript" src="<c:url value="/rui2/plugins/tab/rui_tab.js"/>"></script>
<link rel="stylesheet" type="text/css" href="<c:url value="/rui2/plugins/tab/rui_tab.css"/>"></link>

<title></title>

<style type="text/css">
.LblockDetail input {
    width: 250px; 
}
.LblockDetail input.Lradio {
    width: 50px; 
}

</style>

<script type="text/javascript">
	var tabView, dataSet01, dataSet02, btnRetrieve, btnCreate, btnDelete, btnSave;
	var queryUseFlagCombo;
	var errorMsg;
		
	Rui.onReady(function() {
		/* TAB 영역  */
		tabView = new Rui.ui.tab.LTabView({
			tabs: [{
				id: 'tab1',
				label: 'Locale Master'
			}, {
				id: 'tab2',
				label: 'Locale Code'
			}]
		});

		tabView.render('LTabview');

		tabView.on('activeTabChange', function(e) {
        	var index = tabView.getActiveIndex();
        	if(index == 0) {
        		Rui.get('aCode').html("Java Locale Code");
        	} else {
        		Rui.get('aCode').html("Locale Code");
        	}
        	btnRetrieve.click();
		});

		/* 검색 영역  */
        /* Combo - queryUseFlagDataSet */
		queryUseFlagCombo = new Rui.ui.form.LCombo({
			id: 'queryUseFlag',
			applyTo: 'queryUseFlag',
			selectedIndex:0,
			width:130,
			listWidth:130, 
			listHeight:60,
			url: './../data/RetrieveCodeList.json',
			params : { 
				codeGroup : 'USEF000000'
			}
		});
		
		/* tab1  영역 */
        dataSet01 = new Rui.data.LJsonDataSet({
            id: 'dataSet01',
            fields: [
				{ id: 'javaLocaleCode' },
				{ id: 'localeCode' },
				{ id: 'countryCode' },
				{ id: 'countryName' },
				{ id: 'languageCode' },
				{ id: 'languageName' },
				{ id: 'useFlag' }
        	]
        });

		var columnModel01 = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "javaLocaleCode", label: "Java", width: 120, sortable: true, editor: new Rui.ui.form.LTextBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: "localeCode", label: "Locale", width: 100, sortable: true, editor: new Rui.ui.form.LTextBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: "countryCode", label: "Country", width: 120, sortable: true, editor: new Rui.ui.form.LTextBox() },
                { field: "languageCode", label: "Language", width: 120, sortable: true, editor: new Rui.ui.form.LTextBox() },
                { field: "useFlag", label: "Use Flag", width: 130, sortable: false, editor: new Rui.ui.form.LRadioGroup({
                    items:[
                           {
                               label : 'Y',
                               value:'Y'
                           },
                           {
                               label : 'N',
                               value:'N',
                               checked:true
                           }
                       ]
                   })
                }
                ]
        });

        dataSet01.on('rowPosChanged', function(e){
            if(e.row > -1) {
        		if(dataSet01.getState(e.row) == 1) {
        			Rui.get('javaLocaleCode01').enable();
                    Rui.get('localeCode01').enable();
        		} else { 
        			Rui.get('javaLocaleCode01').disable();
                    Rui.get('localeCode01').disable();
        		}         	
        	}
        });

        var grid01 = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel01,
            height: 300,
            dataSet: dataSet01,
            autoWidth: true
        });
        
        grid01.render('LGridPanel01');

        var validatorManager01 = new Rui.validate.LValidatorManager({
            validators:[
	            {id:'javaLocaleCode', validExp:'Java:true'},
	            {id:'localeCode', validExp:'Locale:true'},
	            {id:'countryCode', validExp:'Country:true'},
	            {id:'languageCode', validExp:'Language:true'},
	            {id:'useFlag', validExp:'Use Flag:true'}
            ]
        });

        var bind01 = new Rui.data.LBind( 
        {
            groupId:'tab1',
            dataSet:dataSet01,
            bindInfo: [
                {id:'javaLocaleCode', ctrlId:'javaLocaleCode', value:'value'},
                {id:'localeCode', ctrlId:'localeCode', value:'value'},
                {id:'languageCode', ctrlId:'languageCode', value:'value'},
                {id:'languageName', ctrlId:'languageName', value:'value'},
                {id:'countryCode', ctrlId:'countryCode', value:'value'},
                {id:'countryName', ctrlId:'countryName', value:'value'},
                {id:'useFlag', ctrlId:'useFlag', value:'value'}
            ]
        });

        /* tab2 영역  */
        dataSet02 = new Rui.data.LJsonDataSet({
            id: 'dataSet02',
            fields: [
	           	{ id: 'localeCode' },
				{ id: 'regionCode' },
				{ id: 'countryCode' },
				{ id: 'languageCode' },
	           	{ id: 'javaLocaleCode' },
	           	{ id: 'timezoneName' },
	            { id: 'displayOrderNo' },
	            { id: 'useFlag' },
	           	{ id: 'localeAlias' },
	            { id: 'bandwidthCode' },
	            { id: 'wasInstance' },
	            { id: 'siteUrl' },
	            { id: 'charset' }
        	]
        });

        var columnModel02 = new Rui.ui.grid.LColumnModel({
            columns: [
      			new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "localeCode", label: "Locale", width: 100, sortable: true, editor: new Rui.ui.form.LTextBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: "javaLocaleCode", label: "Java", width: 120, sortable: true, editor: new Rui.ui.form.LTextArea() },
                { field: "countryCode", label: "Country", width: 120, sortable: true, editor: new Rui.ui.form.LTextArea() },
                { field: "languageCode", label: "Language", width: 100, sortable: true, editor: new Rui.ui.form.LTextBox() },
                { field: "bandwidthCode", label: "Bandwidth Code", width: 120, sortable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "wasInstance", label: "Was Instance", width: 120, sortable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "useFlag", label: "Use Flag", width: 130, sortable: false, editor: new Rui.ui.form.LRadioGroup({
                    items:[
                           {
                               label : 'Y',
                               value:'Y'
                           },
                           {
                               label : 'N',
                               value:'N',
                               checked:true
                           }
                       ]
                   })
                }
                ]
        });

        dataSet02.on('rowPosChanged', function(e){
        	if(e.row > -1) {
        		if(dataSet02.getState(e.row) == 1) Rui.get('localeCode02').enable(); 
        		else Rui.get('localeCode02').disable();         	
        	}
        });

        var grid02 = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel02,
            height: 300,
            dataSet: dataSet02,
            autoWidth: true
        });
        grid02.render('LGridPanel02');

        var validatorManager02 = new Rui.validate.LValidatorManager({
            validators:[
	            {id:'localeCode', validExp:'Locale:true'},
	            {id:'javaLocaleCode', validExp:'Java:true'},
	            {id:'countryCode', validExp:'Country:true'},
	            {id:'languageCode', validExp:'Language:true'},
	            {id:'regionCode', validExp:'Region:true'},
	            {id:'timezoneName', validExp:'Timezone:true'},
	            {id:'useFlag', validExp:'Use Flag:true'}
            ]
        });

        var bind02 = new Rui.data.LBind( 
        {
            groupId:'tab2',
            dataSet:dataSet02,
            bindInfo: [
                {id:'localeCode', ctrlId:'localeCode', value:'value'},
                {id:'javaLocaleCode', ctrlId:'javaLocaleCode', value:'value'},
                {id:'regionCode', ctrlId:'regionCode', value:'value'},
                {id:'countryCode', ctrlId:'countryCode', value:'value'},
                {id:'countryName', ctrlId:'countryName', value:'value'},
                {id:'languageCode', ctrlId:'languageCode', value:'value'},
                {id:'languageName', ctrlId:'languageName', value:'value'},
                {id:'timezoneName', ctrlId:'timezoneName', value:'value'},
                {id:'localeAlias', ctrlId:'localeAlias', value:'value'},
                {id:'bandwidthCode', ctrlId:'bandwidthCode', value:'value'},
                {id:'wasInstance', ctrlId:'wasInstance', value:'value'},
                {id:'useFlag', ctrlId:'useFlag', value:'value'},
                {id:'displayOrderNo', ctrlId:'displayOrderNo', value:'value'},
                {id:'siteUrl', ctrlId:'siteUrl', value:'value'},
                {id:'charset', ctrlId:'charset', value:'value'}
            ]
        });

		/* 트랙젝션 영역  */
		var tm = new Rui.data.LDataSetManager();

		tm.on('beforeUpdate', function(e) {
    		var dataSet = null;
    		var validatorManager = null;
        	if(tabView.getActiveIndex() == 1) {
        		dataSet = dataSet02;
        		validatorManager = validatorManager02;
        	} else {
        		dataSet = dataSet01;
        		validatorManager = validatorManager01;
        	}

            if(validatorManager.validateDataSet(dataSet) == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '\r\n' + validatorManager.getMessageList().join('\r\n') );            	            	
                return false;
            }
		});
		
		tm.on('success', function(e) {
			errorMsg = '';
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});

		/* 버튼 영역  */
        btnRetrieve = new Rui.ui.LButton('btnRetrieve');
        btnRetrieve.on('click', function(e) {
        	var index = tabView.getActiveIndex();
        	//Rui.alert("////////////////" + index);
        	var params = Rui.util.LDom.getValues('.input input', 'LblockSearch');
        	params.tabIndex = index;
        	var dataSet = (index == 1) ? dataSet02 : dataSet01;
        	params.dataSetId = dataSet.id;
       		dataSet.load({
           		url : './../data/RetrieveLocaleList.json',
           		params : params
           	});
        });

        btnCreate = new Rui.ui.LButton('btnCreate');
        btnCreate.on('click', function(e) {
        	if(tabView.getActiveIndex() == 1) {
        		dataSet02.newRecord();
        	} else {
        		dataSet01.newRecord();
        	}
        });

        btnDelete = new Rui.ui.LButton('btnDelete');
        btnDelete.on('click', function(e) {
        	if(tabView.getActiveIndex() == 1) {
            	if(dataSet02.getRow() < 0) return;
            	dataSet02.removeAt(dataSet02.getRow());
        	} else {
            	if(dataSet01.getRow() < 0) return;
            	dataSet01.removeAt(dataSet01.getRow());
        	}
        });
        
        btnSave = new Rui.ui.LButton('btnSave');
        btnSave.on('click', function(e) {
    		var params = {
    			tabIndex : tabView.getActiveIndex()
    		}
    		var dataSet = null;
        	if(tabView.getActiveIndex() == 1) {
        		dataSet = dataSet02;
        	} else {
        		dataSet = dataSet01;
        	}

            tm.updateDataSet({
    			dataSets:[dataSet],
    			url:'pbf.system.locale.CudLocale.rui',
    			params:params
    		});
        });
        
        tabView.selectTab(0);
	});
	
</script>

</head>

<body>
<div id="LblockMain" class="LblockMain">
  <pbf:navigation/>
  
  <!--AREA search-->
  <div id="LblockSearch" class="LblockSearch">
	<div>
	<div>
		<table summary="검색조건을 입력하는 테이블">
		<tbody>
		<tr>
			<td class="label"><label id="aCode" for="queryCode">Java Locale Code</label></td>
			<td class="input">
				<input type="text" id="queryCode" name="queryCode"/>
			</td>
			<td class="label"><label for="queryUseFlag">Use Flag</label></td>
			<td class="input"><div id="queryUseFlag"></div></td>
			<td>
				<input id="btnRetrieve" class="btn" type="button" value="Search" />
			</td>
		</tr>
		</tbody>
		</table>
	</div>
	</div>
  </div>

  <!--AREA [View]-->
  <div id="LTabview"></div>
    <div id="tab1">
      <div id="LblockListTable01" class="LblockList">
      	<div id="LGridPanel01"></div>
      </div>
	  <form id="formDetail" method="post">
	    <div id="LblockDetail01" class="LblockDetail">
	    <input type="hidden" name="localeList"/>
		  <table summary="Locale Masterd 데이터 리스트 테이블">
		    <tr>
		      <th><span class="essential">*</span>Java</th>
		      <td>
		        <input type="text" id="javaLocaleCode01" name="javaLocaleCode"/>
		      </td>
		      <th><span class="essential">*</span>Locale</th>
		      <td>
		        <input type="text" id="localeCode01" name="localeCode"/>
		      </td>
		    </tr>
		    <tr>
		      <th><span class="essential">*</span>Country</th>
		      <td>
		        <input type="text" name="countryCode"/>
		      </td>
		      <th><span class="essential">*</span>Language</th>
		      <td>
		        <input type="text" name="languageCode"/>
		      </td>
		    </tr>
		    <tr>
		      <th>Country Name</th>
		      <td>
		        <input type="text" name="countryName"/><br>
		      </td>
		      <th>Language Name</th>
		      <td>
		        <input type="text" name="languageName"/><br>
		      </td>
		    </tr>
		    <tr>
		      <th>Use Flag</th>
		      <td>
		        <input type="radio" class="Lradio" id="useFlag1" name="useFlag" value="Y" /><label for="useFlag1">Use</label>
		        <input type="radio" class="Lradio" id="useFlag2" name="useFlag" value="N" /><label for="useFlag2">Not Use</label>
		      </td>
		      <th></th>
		      <td>
		      </td>
		    </tr>
		  </table>
		</div>
	  </form>
    </div>
    <div id="tab2">
      <div id="LblockListTable02" class="LblockList">
        <div id="LGridPanel02"></div>
      </div>
	  <form id="formDetail1" method="post">
		<div id="LblockDetail02" class="LblockDetail">
	    <input type="hidden" name="localeList"/>
		  <table summary="Locale Data 리스트 테이블">
		    <tr>
		      <th><span class="essential">*</span>Locale</th>
		      <td>
		        <input type="text" id="localeCode02" name="localeCode"/>
		      </td>
		      <th><span class="essential">*</span>Region</th>
		      <td>
		        <input type="text" name="regionCode"/>
		      </td>
		    </tr>
		    <tr>
		      <th><span class="essential">*</span>Country</th>
		      <td>
      			<textarea rows="2" id="countryCode" style="width:250px"/></textarea>
		      </td>
		      <th><span class="essential">*</span>Language</th>
		      <td>
		        <input type="text" name="languageCode"/>
		      </td>
		    </tr>
		    <tr>
		      <th><span class="essential">*</span>Java</th>
		      <td>
      			<textarea rows="2" id="javaLocaleCode" style="width:250px"/></textarea>
		      </td>
		      <th><span class="essential">*</span>Timezone</th>
		      <td>
		        <input type="text" name="timezoneName"/>
		      </td>
		    </tr>
		    <tr>
		      <th>Locale Alias</th>
		      <td>
		        <input type="text" name="localeAlias"/><br>
		      </td>
		      <th>Bandwidth Code</th>
		      <td>
		        <input type="text" name="bandwidthCode"/><br>
		      </td>
		    </tr>
		    <tr>
		      <th>Use Flag</th>
		      <td>
		        <input type="radio" class="Lradio" id="useFlag3" name="useFlag" value="Y" /><label for="useFlag3">Use</label>
		        <input type="radio" class="Lradio" id="useFlag4" name="useFlag" value="N" /><label for="useFlag4">Not Use</label>
		      </td>
		      <th>Order</th>
		      <td><input type="text" name="displayOrderNo"/></td>
		    </tr>
		    <tr>
		      <th>site url</th>
		      <td><input type="text" name="siteUrl"/></td>
		      <th>charset</th>
		      <td><input type="text" name="charset"/></td>
		    </tr>
		    <tr>
		    	<th>Was Instance</th>
		    	<td>
		    		<input type="text" name="wasInstance"/><br>
		    	</td>
		    </tr>
		  </table>
		</div>
	  </form>
    </div>
  

<div id="LblockButton" class="LblockButton">
   <div>
	   <input type="button" value="New" id="btnCreate"/>
	   <input type="button" value="Save" id="btnSave"/>
       <input type="button" value="Delete" id="btnDelete" />
   </div>
</div>

</div>

<!-- **************************************************************************
    화면영역 종료
*************************************************************************** -->
<%@include file="./../common/include/tail.jspf"%>

</body>
</html>
