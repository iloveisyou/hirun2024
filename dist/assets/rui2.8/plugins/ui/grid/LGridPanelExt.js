/*
 * @(#) LGridPanelExt.js
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
(function() {
	var LXml = Rui.util.LXml;
      if(typeof Rui.ui.grid.LEditButtonColumn != 'undefined') {
      Rui.applyIf(Rui.ui.grid.LEditButtonColumn.prototype, {
           isCustomRender: false
      });
      Rui.applyObject(Rui.ui.grid.LEditButtonColumn.prototype, {
          buttonRenderer : function(button) {
              return function(val, p, record, row, i) {
                  p.editable = true;
                  val = (Rui.isEmpty(val)) ? '&nbsp;' : val;
                  if(!this.isCustomRender)
                  return '<div style="position:relative">' +
                      '<div class="L-popup-button">' + val + '</div>' +
                      '<span class="L-popup-button-icon L-ignore-event" style="position:absolute">&nbsp;</span>' +
                      '</div>';
                  else
                       return '<div>' +
                      '<div>' + val + '</div>' +
                      '</div>';
              };
          }
      });
  }
  Rui.applyIf(Rui.ui.grid.LColumnModel.prototype, {
      showStaticColumn: false,
      getBasicColumnInfo: function(){
          this.columnList = [];
          var merged = false;
          this.freezeIndex = -1;
          this.freezeColumnId = this.gridView.columnModel.freezeColumnId;
          var tempColumnMap = {};
          var columns = this.gridView.columnModel.columns;
          for (var i = 0, j = 0, len = columns.length; i < len; i++) {
              var column = null;
              if(Rui.isEmpty(columns[i])) continue;
              if(columns[i] instanceof Rui.ui.grid.LColumn)
                  column = columns[i];
              else
                  column = new Rui.ui.grid.LColumn(columns[i]);
              if (column.type == 'number' && column.defaultValue == null)
                  column.defaultValue = 0;
              if(column.renderer && Rui.ui.grid.LColumnModel.rendererMapper[column.renderer])
                  column.renderer = Rui.ui.grid.LColumnModel.rendererMapper[column.renderer];
              if(this.freezeColumnId == column.id)
                  this.freezeIndex = j;
              if(column.hidden !== true) j++;
              tempColumnMap[column.id] = column;
              if(column.groupId && tempColumnMap[column.groupId]) {
                  tempColumnMap[column.groupId].setColumnType('group');
              }
              column.setColumnModel(this);
              if (!column.sortable) column.sortable = this.defaultSortable;
              if (!column.width) column.width = this.defaultWidth;
              this.columnList.push(column);
              if(column.hidden !== true) this.showColumnList.push(column);
              this.columnMap[column.getId()] = column;
              this.columnIndex[column] = i;
              if(column.field) this.columnField[column.field] = column;
              if(!merged && (column.vMerge || column.hMerge)) {
                 merged = true;
              }
          }
          delete tempColumnMap;
          this.merged = merged;
          return this.columnList;
      },
      createExcelColumnModel: function(showStaticColumn) {
          showStaticColumn = showStaticColumn || false;
          var colList, colCount,column;
          if(this.isMultiheader()){
              colList = this.getMultiheaderAllColumns();
          } else {
              colList = this.columnList;
          }
          colCount = colList.length;
          var columns = [];
          for (var i = 0 ; i < colCount; i++) {
              column = colList[i];
              if(showStaticColumn == false && (column instanceof Rui.ui.grid.LSelectionColumn || column instanceof Rui.ui.grid.LStateColumn || column instanceof Rui.ui.grid.LNumberColumn)) continue;
              if(Rui.ui.grid.LEditButtonColumn && column instanceof Rui.ui.grid.LEditButtonColumn){
                  column.isCustomRender = true;
              }
              columns.push(column.clone());
          }
          if(!Rui.isUndefined(this.groupMerge) && this.groupMerge)
              return new Rui.ui.grid.LColumnModel({groupMerge: this.groupMerge, columns:columns, gridView:this.gridView});
          else
              return new Rui.ui.grid.LColumnModel({columns:columns,gridView:this.gridView});
      }
  });
  if(!Rui.ui.grid.LColumnModel.prototype.oldSetCellConfig) {
	  Rui.ui.grid.LColumnModel.prototype.oldSetCellConfig = Rui.ui.grid.LColumnModel.prototype.setCellConfig;
	  Rui.ui.grid.LColumnModel.prototype.setCellConfig = function(row, col, key, val) {
	      if(this.isExcel !== true)
	          this.oldSetCellConfig.call(this, row, col, key, val);
	  }
  }
  if(!Rui.ui.grid.LBufferGridView.prototype.oldGetRenderDummyCell) {
	  Rui.ui.grid.LBufferGridView.prototype.oldGetRenderDummyCell = Rui.ui.grid.LBufferGridView.prototype.getRenderDummyCell;
	  Rui.ui.grid.LBufferGridView.prototype.getRenderDummyCell = function(row) {
	      if(this.isExcel !== true)
	          return this.oldGetRenderDummyCell.call(this, row);
	      else
	          return '';
	  }
  }
  Rui.applyObject(Rui.ui.grid.LBufferGridView.prototype, {
      isTotalRow: false,
      getVisibleRowCount: function(excludeOver, rowHeight){
          if(this.isTotalRow){
              this.visibleRowCount = this.dataSet.getCount();
              return this.visibleRowCount;
          }
          var vrc = this._getVisibleRowCount(rowHeight);
          return (vrc < 1) ? 0 : (excludeOver === true ? Math.floor(vrc) : Math.ceil(vrc));
      },
      createTemplateForExcel: function() {
          var ts = this.templates || {};
          if (!ts.master) {
              ts.master = new Rui.LTemplate(
              '<div class="L-grid-header" style="{hstyle}">',
                  '<div class="L-grid-header-offset" style="{ostyle}">{header}</div>',
                  '<div class="L-grid-header-tool L-hide-display">▼</div>',
              '</div>',
              '<div class="L-grid-scroller" style="{sstyle}">',
                  '<div class="L-grid-body L-grid-col-line" style="{bstyle}"></div><a class="L-grid-focus" tabIndex="-1" style="position:absolute;"></a>',
              '</div>',
              '<div class="L-grid-resize-proxy">&#160;</div>',
              '<div class="L-grid-dd-proxy"><div>&#160;</div></div>',
              '<div class="L-grid-dd-target">&#160;</div>'
              );
          }
          if (!ts.header) {
              ts.header = new Rui.LTemplate(
               '{hrow2}'
              );
          }
          if (!ts.hrow) {
           ts.hrow = new Rui.LTemplate(
                      '<tr>{hcells}</tr>'
                      );
          }
          if (!ts.hcell) {
           ts.hcell = new Rui.LTemplate(
                      '<td style="background-color:#C0C0C0;" colspan="{colSpan}" rowSpan="{rowSpan}">',
                        '<div  style="{istyle}">',
                              '<a><div style="text-align:center;">{value}</div></a>',
                         '</div>',
                      '</td>'
                      );
          }
          if (!ts.hcellLabel) {
             ts.hcellLabel = new Rui.LTemplate(
                        '<td colspan="{colSpan}" rowSpan="{rowSpan}">',
                            '<div  style="{istyle}">',
                                '<a><div style="text-align:center;">{value}</div></a>',
                            '</div>',
                        '</td>'
                        );
          }
          if (!ts.body) {
              ts.body = new Rui.LTemplate(
              '<table border="1" cellspacing="0" cellpadding="0" style="{tstyle2}">{rows2}</table>'
              );
          }
          if (!ts.row) {
           ts.row = new Rui.LTemplate(
                      '<tr>{rowBody}</tr>'
                  );
          }
          if (!ts.rowBody) {
              ts.rowBody = new Rui.LTemplate(
                  '{cells}'
              );
          }
          if (!ts.cell) {
             ts.cell = new Rui.LTemplate(
                        '<td style=\"{style}\" colspan="{colspan}" rowspan="{rowspan}">',
                            '{bcell}<div style="{istyle}">{value}</div>',
                        '</td>'
                        );
          }
          this.templates = ts;
      }
  });
  Rui.applyIf(Rui.ui.grid.LGridPanel.prototype, {
	  showExcelDialog: true,
      saveExcel: function(fileName, config) {
          var currView = this.getView();
          currView.showLoadingMessage();
          config = config || {};
          var stylesTemplate = new Rui.LTemplate(
          '<style type="text/css"> ',
          'table { margin:0; padding:0; border-top: 1px solid black; border-left: 1px solid black; border-width: thin; } ',
          '</style>'
          );
          config.showStaticColumn = !Rui.isUndefined(config.showStaticColumn) ? ((this.columnModel.multiheaderHtml) ? true : false) : config.showStaticColumn;
          config = Rui.applyIf(config, {
              columnModel: this.columnModel.createExcelColumnModel(config.showStaticColumn),
              styles: stylesTemplate.apply(),
              url: Rui.getConfig().getFirst('$.ext.grid.excelDownLoadUrl')
          });
          if(Rui.isEmpty(fileName)) fileName = new Date().format('%Y%m%d') + '.xls';
          var fn = function(excelType, fileName) {
        	  config.excelType = excelType;
              var summary = ''; 
              if(!Rui.isUndefined(config.columnModel.gridView)){
                  var plugins = config.columnModel.gridView.plugins;
                  if(plugins) {
                      for (var i = 0, len = plugins.length; i < len; i++) {
                          plugins[i].useExcel = true;
                          plugins[i].initPlugin(plugins[i].gridView);
                          if(plugins[i].getRenderTotal) {
                              summary = plugins[i].getRenderTotal() || {};
                          }
                          plugins[i].useExcel = false;
                          plugins[i].initPlugin(plugins[i].gridView);
                          plugins[i].updatePlugin({});
                      }
                  }
              }
              config.columnModel.isExcel = true;
              var sm = new Rui.ui.grid.LSelectionModel();
              var tableGrid = new Rui.ui.grid.LGridPanel({
            	  id: 'excel_' + Rui.id(),
                  columnModel: config.columnModel,
                  selectionModel: sm,
                  height: 1000,
                  isExcel: true,
                  view: new Rui.ui.grid.LGridView({
                      dataSet: this.dataSet,
                      selectionModel: sm,
                      columnModel: config.columnModel,
                      hiddenColumnRender: true,
                      makeDummyCell: false,
                      isTotalRow : true,
                      isExcel : true,
                      excelSummary : summary
                  }),
                  dataSet: this.dataSet
              });
              sm.init(tableGrid);
              config.columnModel.bindEvent(tableGrid);
              var view = tableGrid.getView();
              view.gridPanel = tableGrid;
              var ts = view.templates || {};
                  ts.master = new Rui.LTemplate(
                      '<table border="1" cellspacing="0" cellpadding="0" >',
                      '{header}',
                      '{body}',
                      '</table>'
                   );
                  ts.header = new Rui.LTemplate(
                      '{hrow2}'
                  );
                  ts.hcell = new Rui.LTemplate(
                  '<td class="L-grid-header-cell L-grid-cell L-grid-cell-{id} {first_last} {hidden} {sortable} {css}" style="{style};background-color:#C0C0C0;" colspan="{colSpan}" rowSpan="{rowSpan}">',
                      '<div class="L-grid-header-inner L-grid-header-{id}" style="{istyle}">',
                          '<a class="L-grid-header-btn" >{value}</a>',
                      '</div>',
                  '</td>'
                  );
                  ts.hcellLabel = new Rui.LTemplate(
                     '<td style="background-color:#C0C0C0;" colspan="{colSpan}" rowSpan="{rowSpan}">',
                     '<div style="text-align:center;">',
                         '{value}',
                     '</div>',
                     '</td>'
                  );
                  ts.body = new Rui.LTemplate(
                  '{rows2}'
                  );
              view.templates = ts;
              var template = new Rui.LTemplate(
	              '<form name="LExcelDataForm" method="post" action="{url}" >',
	              '<div id="L-hidden-grid"></div>',
	              '<input type="text" id="LFileName" name="LFileName">',
	              '<input type="text" id="LExcelType" name="LExcelType" value="{excelType}">',
	              '<textarea id="LExcelData" name="LExcelData" rows="20" cols="80"></textarea>',
	              '</div>'
              );
              var html = template.apply({
                  url: config.url,
                  excelType: config.excelType != 'html' ? (tableGrid.excelType || 'xml') : 'html'
              });
              if(!Rui.ui.grid.LGridPanel.excelFrame) {
                  var hiddenDiv = document.createElement('iframe');
                  hiddenDiv.style.width = '100%';
                  hiddenDiv.style.height = '300px';
                  hiddenDiv.id = 'L-excel-container';
                  hiddenDiv.style.display = 'none';
                  document.body.appendChild(hiddenDiv);
                  hiddenDiv.src = 'about:blank';
                  Rui.ui.grid.LGridPanel.excelFrame = hiddenDiv;
              }
              var hiddenDiv = Rui.ui.grid.LGridPanel.excelFrame;
              var me = this;
              var thread = setInterval(function(){
                  var body = hiddenDiv.contentWindow.document.body?hiddenDiv.contentWindow.document.body:hiddenDiv.contentWindow.document.documentElement;
                  if(body) {
                      clearInterval(thread);
                      body.innerHTML = html;
                      var frameDocument = hiddenDiv.contentWindow.document?hiddenDiv.contentWindow.document:hiddenDiv.contentWindow.document;
                      me.resetEditButtonColumn(config);
                      var excelDataDom = frameDocument.getElementById('LExcelData');
                      var fileNameDom = frameDocument.getElementById('LFileName');
                      var gridHtml = '';
                      if(config.excelType == 'xml') {
                    	  gridHtml = me.getXmlForExcel(view, config);
                          excelDataDom.value = gridHtml;
                      } else if(config.excelType == 'json') {
                    	  gridHtml = me.getJsonForExcel(view, config);
                          excelDataDom.value = gridHtml;
                      } else {
                    	  gridHtml = me.getHtmlForExcel(view, config);
                          excelDataDom.value = config.styles + ' ' + gridHtml;
                      }
                      fileNameDom.value = fileName;
                      tableGrid.destroy();
                      frameDocument.LExcelDataForm.submit();
                      excelDataDom.value = '';
                      fileNameDom.value = '';
                      currView.hideLoadingMessage();
                      config.columnModel.bindEvent(me);
                  }
              }, 500);
          };
          var mm = Rui.getMessageManager();
          var text = '<p>' + mm.get('$.base.msg131', [this.dataSet.getCount().format({ thousandsSeparator: ',' })]) + '<p/>';
          text += '<p>※ ' + mm.get('$.base.msg132') + '<p/>';
          var maxCount = Rui.browser.msie ? 5000 : 5000;
          if(this.dataSet.getCount() > maxCount) text += '<p>' + mm.get('$.base.msg133') + '<p/>';
          var me = this;
          if(this.showExcelDialog && !this.excelDialog) {
              this.excelDialog = new Rui.ui.LDialog( {
                  id: Rui.id(),
                  width : 300,
                  visible : false,
                  postmethod:'none',
                  defaultCss: 'L-excel-dialog',
                  header: mm.get('$.base.msg001'),
                  body: text,
                  buttons : [
                      { text: mm.get('$.base.msg134'), handler: function() {
                    	  fn.call(me, 'html', this.fileName || fileName);
                    	  this.submit();
                      }, isDefault:true },
                      { text: mm.get('$.base.msg135'), handler: function() {
                    	  fn.call(me, me.excelType, this.fileName || fileName);
                    	  this.submit();
                      } },
                      { text: mm.get('$.base.msg124'), handler: function() {
                    	  this.cancel();
                      } }
                  ]
              });
              this.excelDialog.render(document.body);
    		  this.excelDialog.fileName = fileName;
              this.excelDialog.on('hide', function() {
            	  currView.hideLoadingMessage();
              });
          } else {
        	  if(this.showExcelDialog) {
        		  this.excelDialog.fileName = fileName;
        		  this.excelDialog.setBody(text);
        	  }
          }
          if(this.showExcelDialog) this.excelDialog.show();
          else fn.call(this, me.excelType, fileName);
      },
      resetEditButtonColumn: function(config){
           for (var i = 0, len = config.columnModel.columns.length; i < len; i++) {
              if(Rui.ui.grid.LEditButtonColumn && config.columnModel.columns[i].editor != null &&
                       config.columnModel.columns[i].editor instanceof Rui.ui.grid.LEditButtonColumn)
                   config.columnModel.columns[i].editor.isCustomRender = false;
              else if(Rui.ui.grid.LEditButtonColumn && config.columnModel.columns[i] instanceof Rui.ui.grid.LEditButtonColumn)
                  config.columnModel.columns[i].isCustomRender = false;
           }
      },
      getHtmlForExcel: function(viewObj, config){
           viewObj.createTemplateForExcel();
           var headerHtml = viewObj.getRenderHeader();
           var bodyHtml = viewObj.getRenderBody();
           bodyHtml += viewObj.excelSummary;
           var contentWidth = viewObj.columnModel.getTotalWidth(true);
           var offsetWidth = contentWidth + viewObj.scrollBarWidth;
           var gridHtml = viewObj.templates.master.apply({
               header: headerHtml,
               body: bodyHtml,
               ostyle: 'width:' + offsetWidth + 'px',
               bstyle: 'width:' + contentWidth + 'px'
           });
           return gridHtml;
      },
      getXmlForExcel: function(viewObj, config) {
          var cm = viewObj.columnModel, ds = viewObj.dataSet;
      	  var columnCount = cm.getColumnCount(true);
    	  var xmlDoc = LXml.createDocument('table');
      	  var datagrid = xmlDoc.firstChild;
    	  var xRow = LXml.createChild(datagrid, 'row');
      	  for (var i = 0; i < columnCount; i++) {
      		  var c = cm.getColumnAt(i, true);
      		  var xCol = LXml.createChild(xRow, c.id);
      		  LXml.createTextValue(xCol, c.label);
      	  }
      	  for (var row = 0, len = ds.getCount(); row < len; row++) {
      		  if(config.markedOnly && !ds.isMarked(row)) continue;
      		  xRow = LXml.createChild(datagrid, 'row');
          	  for (var i = 0; i < columnCount; i++) {
          		  var c = cm.getColumnAt(i, true);
          		  var xCol = LXml.createChild(xRow, c.id);
          		  var r = ds.getAt(row);
          		  var val = viewObj.getRenderCellValue({ css: [] }, r, c, row, i);
          		if(val === null || val === undefined) val = '';
          		  if(cm.skipTags === true && val && typeof val === 'string')  val = Rui.util.LString.skipTags(val);
          		  LXml.createTextValue(xCol, val ? val + '' : '');
          	  }
      	  }
      	  return LXml.serialize(xmlDoc);
      },
      getJsonForExcel: function(viewObj, config) {
          var cm = viewObj.columnModel, ds = viewObj.dataSet, bcm = cm.getBasicColumnModel();
      	  var columnCount = cm.getColumnCount(true);
          var data = {
              metaData: {
            	  fields: []
              },
              records: []
          };
          for (var i = 0, len = columnCount; i < len; i++) {
        	  var c = cm.getColumnAt(i, true);
        	  var colInfo = {};
        	  colInfo.id = c.id;
        	  colInfo.field = c.getField();
        	  colInfo.label = c.getLabel();
        	  colInfo.width = c.getWidth();
        	  colInfo.align = c.align;
        	  colInfo.type = c.field ? ds.getFieldById(c.field).type : 'string';
        	  colInfo.columnType = c.columnType;
        	  colInfo.groupId = c.groupId;
        	  if(c.groupId) {
        		  colInfo.groupLabel = bcm.getColumnById(c.groupId).label;
        	  }
        	  data.metaData.fields.push(colInfo)
          }
          if(cm.multiheaderInfos && cm.multiheaderInfos.length > 0) {
              var multiheaderInfos = {
                  colCount: cm.multiheaderInfos[0].colCount,
                  colInfos: cm.multiheaderInfos[0].colInfos,
                  rowCount: cm.multiheaderInfos[0].rowCount
              };
              multiheaderInfos.columns = [];
              for (var i = 0, len = cm.multiheaderInfos[0].columns.length; i < len ; i++) {
            	  multiheaderInfos.columns.push({
            		  id: cm.multiheaderInfos[0].columns[i].id,
            		  groupId: cm.multiheaderInfos[0].columns[i].groupId,
            		  label: cm.multiheaderInfos[0].columns[i].label
            	  });
              }
              multiheaderInfos.dataColumns = [];
              for (var i = 0, len = cm.multiheaderInfos[0].dataColumns.length; i < len ; i++) {
            	  multiheaderInfos.dataColumns.push({
            		  id: cm.multiheaderInfos[0].dataColumns[i].id,
            		  groupId: cm.multiheaderInfos[0].dataColumns[i].groupId,
            		  label: cm.multiheaderInfos[0].dataColumns[i].label
            	  });
              }
              data.metaData.multiheaderInfos = multiheaderInfos;
          }
  		  var records = [];
      	  for (var row = 0, len = ds.getCount(); row < len; row++) {
      		  if(config.markedOnly && !ds.isMarked(row)) continue;
      		  var rowData = [];
          	  for (var i = 0; i < columnCount; i++) {
          		  var c = cm.getColumnAt(i, true);
          		  var r = ds.getAt(row);
          		  var val = viewObj.getRenderCellValue({ css: [] }, r, c, row, i);
          		  if(val === null || val === undefined) val = '';
          		  if(cm.skipTags === true && val && typeof val === 'string')  val = Rui.util.LString.skipTags(val);
          		  rowData.push(val);
          	  }
      		  records.push(rowData);
      	  }
      	  data.records = records;
          return Rui.util.LJson.encode(data);
      }
  });
})();
