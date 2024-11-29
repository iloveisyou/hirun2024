var ruiVersion = '2.0.0';

//util

Rui.defineLegacy('Rui.util.LEventProvider', {
	alias: 'eventProvider',
    packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LAttribute', {
	alias: 'attribute',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LAttributeProvider', {
	extend: 'Rui.util.LEventProvider',
	alias: 'attributeProvider',
    packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LCustomEvent', {
	alias: 'customEvent',
    packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LSubscriber', {
	alias: 'subscriber',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LPlugin', {
	extend: 'Rui.util.LEventProvider',
	alias: 'plugin',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LCollection', {
	alias: 'collection',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LDelayedTask', {
	alias: 'delayedTask',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LKeyListener', {
	alias: 'keyListener',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LRegion', {
	alias: 'region',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LPoint', {
	extend: 'Rui.util.LRegion',
	alias: 'point',
	packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.util.LResizeMonitor', {
	extend: 'Rui.util.LEventProvider',
	alias: 'resizeMonitor',
	packing: 'util'
}, ruiVersion);

//base

Rui.defineLegacy('Rui.LElement', {
	alias: 'element',
    packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.LElementList', {
	alias: 'elementList',
    packing: 'util'
}, ruiVersion);

Rui.defineLegacy('Rui.LTemplate', {
	alias: 'template',
	packing: 'base'
}, ruiVersion);

Rui.defineLegacy('Rui.LException', {
	alias: 'template',
	packing: 'base'
}, ruiVersion);

//webdb
Rui.defineLegacy('Rui.webdb.LWebStorage', {
	alias: 'webStorage',
	packing: 'webdb'
}, ruiVersion);

Rui.defineLegacy('Rui.webdb.LAbstractProvider', {
	extend: 'Rui.util.LEventProvider',
	alias: 'abstractProvider',
	packing: 'webdb'
}, ruiVersion);

Rui.defineLegacy('Rui.webdb.LCookieProvider', {
	extend: 'Rui.webdb.LAbstractProvider',
	alias: 'cookieProvider',
	packing: 'webdb'
}, ruiVersion);

//config
Rui.defineLegacy('Rui.config.LConfigurationProvider', {
	extend: 'Rui.webdb.LAbstractProvider',
	alias: 'configurationProvider',
	packing: 'config'
}, ruiVersion);

Rui.defineLegacy('Rui.config.LConfiguration', {
	extend: 'Rui.webdb.LWebStorage',
	alias: 'configuration',
	packing: 'config'
}, ruiVersion);

//data
Rui.defineLegacy('Rui.data.LBind', {
	extend: 'Rui.util.LEventProvider',
	alias: 'bind',
	packing: 'data'
}, ruiVersion);

Rui.defineLegacy('Rui.data.LDataSet', {
	extend: 'Rui.util.LEventProvider',
	alias: 'dataSet',
	packing: 'data'
}, ruiVersion);

Rui.defineLegacy('Rui.data.LDataSetManager', {
	extend: 'Rui.util.LEventProvider',
	alias: 'dataSetManager',
	packing: 'data'
}, ruiVersion);

Rui.defineLegacy('Rui.data.LDelimiterDataSet', {
	extend: 'Rui.data.LDataSet',
	alias: 'delimiterDataSet',
	packing: 'data'
}, ruiVersion);

Rui.defineLegacy('Rui.data.LJsonDataSet', {
	extend: 'Rui.data.LDataSet',
	alias: 'jsonDataSet',
	packing: 'data'
}, ruiVersion);

Rui.defineLegacy('Rui.data.LField', {
	alias: 'dataSetField',
	packing: 'data'
}, ruiVersion);

Rui.defineLegacy('Rui.data.LRecord', {
	alias: 'dataSetRecord',
	packing: 'data'
}, ruiVersion);

//dd
Rui.defineLegacy('Rui.dd.LDragDrop', {
	extend: 'Rui.util.LEventProvider',
	alias: 'dragDrop',
	packing: 'dd'
}, ruiVersion);

Rui.defineLegacy('Rui.dd.LDD', {
	extend: 'Rui.dd.LDragDrop',
	alias: 'dd',
	packing: 'dd'
}, ruiVersion);

Rui.defineLegacy('Rui.dd.LDDProxy', {
	extend: 'Rui.dd.LDD',
	alias: 'ddProxy',
	packing: 'dd'
}, ruiVersion);

Rui.defineLegacy('Rui.dd.LDDTarget', {
	extend: 'Rui.dd.LDragDrop',
	alias: 'ddTarget',
	packing: 'dd'
}, ruiVersion);

//fx
Rui.defineLegacy('Rui.fx.LAnim', {
	extend: 'Rui.util.LEventProvider',
	alias: 'anim',
	packing: 'fx'
}, ruiVersion);

Rui.defineLegacy('Rui.fx.LMotionAnim', {
	extend: 'Rui.fx.LAnim',
	alias: 'motionAnim',
	packing: 'fx'
}, ruiVersion);

//message
Rui.defineLegacy('Rui.message.LMessageManager', {
	extend: 'Rui.util.LEventProvider',
	alias: 'messageManager',
	packing: 'message'
}, ruiVersion);

//ui
Rui.defineLegacy('Rui.ui.LUIComponent', {
	extend: 'Rui.util.LEventProvider',
	alias: 'uiComponent',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LButton', {
	extend: 'Rui.LElement',
	alias: 'button',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LConfig', {	//LConfig이 ui인 이유는?
	extend: 'Rui.util.LEventProvider',
	alias: 'config',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LPanel', {
	extend: 'Rui.util.LEventProvider',
	alias: 'panel',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LDialog', {
	extend: 'Rui.ui.LPanel',
	alias: 'dialog',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LScroller', {
	extend: 'Rui.ui.LUIComponent',
	alias: 'scroller',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LSimpleDialog', {
	extend: 'Rui.ui.LDialog',
	alias: 'simpleDialog',
	packing: 'ui'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.LWaitPanel', {
	alias: 'waitPanel',
	packing: 'ui'
}, ruiVersion);

//ui-calendar
Rui.defineLegacy('Rui.ui.calendar.LCalendar', {
	alias: 'calendar',
	packing: 'ui-calendar'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.calendar.LCalendarGroup', {
	alias: 'calendarGroup',
	packing: 'ui-calendar'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.calendar.LCalendarNavigator', {
	alias: 'calendarNavigator',
	packing: 'ui-calendar'
}, ruiVersion);

//ui-form
Rui.defineLegacy('Rui.ui.form.LField', {
	alias: 'formField',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LCheckBox', {
	extend: 'Rui.ui.form.LField',
	alias: 'checkBox',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LCheckBoxGroup', {
	extend: 'Rui.ui.form.LField',
	alias: 'checkBoxGroup',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LTextBox', {
	extend: 'Rui.ui.form.LField',
	alias: 'textBox',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LCombo', {
	extend: 'Rui.ui.form.LTextBox',
	alias: 'combo',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LDateBox', {
	extend: 'Rui.ui.form.LTextBox',
	alias: 'dateBox',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LForm', {
	extend: 'Rui.ui.LUIComponent',
	alias: 'form',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LNumberBox', {
	extend: 'Rui.ui.form.LTextBox',
	alias: 'numberBox',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LRadio', {
	extend: 'Rui.ui.form.LCheckBox',
	alias: 'radio',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LRadioGroup', {
	extend: 'Rui.ui.form.LCheckBoxGroup',
	alias: 'radioGroup',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LTextArea', {
	extend: 'Rui.ui.form.LTextBox',
	alias: 'textArea',
	packing: 'ui-form'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.form.LTimeBox', {
	extend: 'Rui.ui.form.LTextBox',
	alias: 'timeBox',
	packing: 'ui-form'
}, ruiVersion);

//ui-grid
Rui.defineLegacy('Rui.ui.grid.LBufferGridView', {
	extend: 'Rui.ui.LUIComponent',
	alias: 'bufferGridView',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LColumn', {
	extend: 'Rui.util.LEventProvider',
	alias: 'column',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LColumnDD', {
	extend: 'Rui.dd.LDDProxy',
	alias: 'columnDD',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LColumnModel', {
	extend: 'Rui.util.LEventProvider',
	alias: 'columnModel',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LColumnResizer', {
	extend: 'Rui.dd.LDDProxy',
	alias: 'columnResizer',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LEditorPanel', {
	extend: 'Rui.ui.LUIComponent',
	alias: 'editorPanel',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LGridPanel', {
	extend: 'Rui.ui.LPanel',
	alias: 'gridPanel',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LGridScroller', {
	extend: 'Rui.ui.LScroller',
	alias: 'gridScroller',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LTriggerColumn', {
	extend: 'Rui.ui.grid.LColumn',
	alias: 'triggerColumn',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LNumberColumn', {
	extend: 'Rui.ui.grid.LTriggerColumn',
	alias: 'numberColumn',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LPager', {
	extend: 'Rui.ui.LUIComponent',
	alias: 'pager',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LRowModel', {
	extend: 'Rui.util.LEventProvider',
	alias: 'rowModel',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LSelectionColumn', {
	extend: 'Rui.ui.grid.LTriggerColumn',
	alias: 'selectionColumn',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LSelectionModel', {
	extend: 'Rui.util.LEventProvider',
	alias: 'selectionModel',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LStateColumn', {
	extend: 'Rui.ui.grid.LTriggerColumn',
	alias: 'stateColumn',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LSummary', {
	extend: 'Rui.util.LPlugin',
	alias: 'summary',
	packing: 'ui-grid'
}, ruiVersion);

Rui.defineLegacy('Rui.ui.grid.LTableBufferedView', {
	extend: 'Rui.ui.grid.LBufferGridView',
	alias: 'tableBufferedView',
	packing: 'ui-grid'
}, ruiVersion);

//validator
Rui.defineLegacy('Rui.validate.LValidator', {
	alias: 'validator',
	packing: 'validator'
}, ruiVersion);

Rui.defineLegacy('Rui.validate.LValidatorManager', {
	alias: 'validatorManager',
	packing: 'validator'
}, ruiVersion);




