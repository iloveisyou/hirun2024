<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript" class="script-code">
    Rui.onReady(function() {
        /*******************
         * 변수 및 객체 선언
         *******************/
        var dataSet = new Rui.data.LJsonDataSet({
            id: 'dataSet',
            fields: [
            { id: 'col1' },
            { id: 'col2' },
            { id: 'col3' },
            { id: 'col4' },
            { id: 'col5' },
            { id: 'col6' },
            { id: 'col7' },
            { id: 'col8', type: 'number' },
            { id: 'code' },
            { id: 'value' },
            { id: 'date1', type: 'date', defaultValue: new Date() }
            ]
        });

        var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
                new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LSelectionColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: 'col1', label: 'Col1', autoWidth: true, editor: new Rui.ui.form.LTextBox() },
                { field: 'col2', align: 'center', autoWidth: true },
                { field: 'code', align: 'center', autoWidth: true },
                { id: 'group1' },
                { field: 'col3', align: 'right', groupId: 'group1', autoWidth: true },
                { field: 'col5', align: 'center', groupId: 'group1', autoWidth: true },
                { id: 'btn', label: 'Detail', groupId: 'group1', autoWidth: true, renderer: function(val, p, record, row, i){
                    return "<button type='button' class='L-grid-button'>Detail</button>";
                }}
            ]
        });

        var grid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            dataSet: dataSet,
            // stopEventBubble을 true로 설정하지 않으면 해당 그리드 클릭시 에러가 발생한다.
            stopEventBubble: true,
            autoWidth: true,
            /*<b>*/
            view : new Rui.ui.grid.LExpandableView({
                dataSet: dataSet,
                columnModel: columnModel
            }),
            /*</b>*/
            width: 600,
            height: 200
        });

        var view = grid.getView();
        
        view.on('expand', function(e) {
            if(e.isFirst) {
                var targetEl = Rui.get(e.expandableTarget);
                var option = {
                    url: './gridpanelExpandableSubGridSample.jsp?domId=' + targetEl.id
                };
                targetEl.appendChildByAjax(option);
            }
        });
        
        grid.on('cellclick', function(e){
            var column = columnModel.getColumnAt(e.col, true);
            if(column.id == 'btn') {
                if (view.hasExpand(e.row)) {
                    view.setExpand(e.row, false);
                } else {
                    view.setExpand(e.row, true);
                }
            }
            else
                Rui.log('cellclick : row ' + e.row + ', col ' + e.col);
        });

        /*<b>*/
        grid.render('<%=request.getParameter("domId")%>');
        /*</b>*/
        dataSet.load({
            url: './../../../../sample/data/data.json'
        });
    });
</script>
