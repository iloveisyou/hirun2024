<%@page import="org.apache.poi.hssf.usermodel.HSSFCellStyle" %>
<%@page import="org.apache.poi.hssf.usermodel.HSSFFont" %>
<%@page import="org.apache.poi.hssf.usermodel.HSSFRichTextString" %>
<%@page import="org.apache.poi.hssf.usermodel.HSSFWorkbook" %>
<%@page import="org.apache.poi.hssf.util.CellRangeAddress" %>
<%@page import="org.apache.poi.hssf.util.HSSFColor" %>
<%@page import="org.apache.poi.ss.usermodel.Cell" %>
<%@page import="org.apache.poi.ss.usermodel.Row" %>
<%@page import="org.apache.poi.ss.usermodel.Sheet" %>
<%@page import="org.json.JSONArray" %>
<%@page import="org.json.JSONObject" %>
<%@page import="java.io.OutputStream"%>
<%
request.setCharacterEncoding("UTF-8"); 

String fileName = request.getParameter("LFileName");
String excelData = request.getParameter("LExcelData");
String LExcelType = request.getParameter("LExcelType");
if(excelData == null) excelData = "";

if("xml".equals(LExcelType)) {
%><?xml version="1.0" encoding="utf-8"?><%
} else if("json".equals(LExcelType)){
	fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
	
	response.reset();
	response.setContentType("application/vnd.ms-excel");
	response.setHeader("Content-Disposition","attachment;filename="+fileName+";");

	JSONObject joData = new JSONObject(excelData);
	OutputStream bao = null;

		try {

			JSONObject joMetaData = joData.getJSONObject("metaData");
			JSONArray joFields = joMetaData.getJSONArray("fields");
			HSSFWorkbook workBook = new HSSFWorkbook();

			out.clear();
			out = pageContext.pushBody();
	
			Sheet sheet = workBook.createSheet();

			int row = 0;
			int fieldCount = joFields.length();
			HSSFCellStyle hcs = getTitleStyle(workBook);
			short width = 50;

			String types[] = new String[fieldCount];
			String aligns[] = new String[fieldCount];
			HSSFCellStyle dcs[] = new HSSFCellStyle[fieldCount];

			org.json.JSONObject joMultiheaderInfos = null;
			if(joMetaData.has("multiheaderInfos")) {
				joMultiheaderInfos = joMetaData.getJSONObject("multiheaderInfos");
				int rowCount = joMultiheaderInfos.getInt("rowCount");
				int colCount = joMultiheaderInfos.getInt("colCount");
				org.json.JSONArray colInfos = joMultiheaderInfos.getJSONArray("colInfos");
				
				int createRow = row;
				int currRow = row;
				int currCol = 0;
				for(int col = 0 ; col < colInfos.length(); col++) {
					JSONObject joField = joFields.getJSONObject(col);
					JSONArray colInfoList = colInfos.getJSONArray(col);
					currRow = 0;
					currCol = col;
					for(int hrow = 0 ; hrow < rowCount; ) {
						JSONObject colInfo = colInfoList.getJSONObject(hrow);
						boolean exist = colInfo.getBoolean("exist");
						int colspan = colInfo.getInt("colspan");
						int rowspan = colInfo.getInt("rowspan");
						Row sheetRow = null;
						if(col == 0) {
							sheetRow = sheet.createRow(currRow);
							sheetRow.setHeight((short) 400);
							createRow = currRow;
						} else {
							sheetRow = sheet.getRow(currRow);
						}
						
						if(sheetRow == null) {
							sheetRow = sheet.createRow(currRow);
							sheetRow.setHeight((short) 400);
						}
						Cell currCell = sheetRow.createCell(currCol);
						currCell.setCellStyle(hcs);

						if(colspan > 0 && rowspan > 0 && exist == true) {
							String label = colInfo.getString("label");

							if(joField.has("width"))
								sheet.setColumnWidth(currCol, joField.getInt("width") * width);
							currCell.setCellValue(label);
							if(colspan > 1 || rowspan > 1) {
								int startRow = currRow;
								int startCol = currCol;
								int endRow = currRow + (rowspan > 1 ? rowspan - 1 : 0);
								int endCol = currCol + (colspan > 1 ? colspan - 1: 0);
								if(endRow > createRow) {
									sheetRow = sheet.createRow(endRow);
									sheetRow.setHeight((short) 400);
									createRow = endRow;
								}
								for(int i = startRow; i <= endRow; i++) {
									Row mSheetRow = sheet.getRow(i);
									if(mSheetRow == null) {
										mSheetRow = sheet.createRow(i);
									}
									Cell mCell = mSheetRow.getCell(currCol);
									if(mCell == null) {
										mCell = mSheetRow.createCell(currCol);
										mCell.setCellStyle(hcs);
									}
								}
								sheet.addMergedRegion(new CellRangeAddress(startRow, endRow, startCol, endCol));
								currRow = endRow + 1;
//								currCol++;
								hrow = currRow;
								continue;
							}
						}
						currRow++;
//						currCol++;
						hrow++;
					}
				}
				row = currRow;
			} else {

				Row sheetRow = sheet.createRow(row++);
				sheetRow.setHeight((short) 400);

				for (int col = 0; col < fieldCount; col++) {
					JSONObject joField = joFields.getJSONObject(col);
					sheet.setColumnWidth(col, joField.getInt("width") * width);
					types[col] = (joField.has("type")) ? joField.getString("type")
							.toLowerCase() : "String";
					String value = joField.getString("label");
					Cell cell = sheetRow.createCell(col);
					cell.setCellValue(new HSSFRichTextString(value));
					cell.setCellStyle(hcs);
					aligns[col] = (joField.has("align")) ? joField.getString("align").toLowerCase() : "left";
				}
			}
			

			for (int col = 0; col < fieldCount; col++) {
				JSONObject joField = joFields.getJSONObject(col);
				aligns[col] = (joField.has("align")) ? joField.getString("align")
						.toLowerCase() : "left";
				dcs[col] = getTextStyle(workBook);
				if("center".equals(aligns[col]))
					dcs[col].setAlignment(HSSFCellStyle.ALIGN_CENTER);
				else if("right".equals(aligns[col]))
					dcs[col].setAlignment(HSSFCellStyle.ALIGN_RIGHT);
				else
					dcs[col].setAlignment(HSSFCellStyle.ALIGN_LEFT);
			}
			JSONArray joRecords = joData.getJSONArray("records");
			int rowCount = joRecords.length();
			
			for (int dataRow = 0; dataRow < rowCount; dataRow++, row++) {
				Row currRow = sheet.createRow(row);
				currRow.setHeight((short) 300); 
				JSONArray jaRows = joRecords.getJSONArray(dataRow);
				for (int col = 0; col < fieldCount; col++) {
					Cell cell = currRow.createCell(col);
					String value = jaRows.getString(col);
					cell.setCellValue(new HSSFRichTextString(value));
					cell.setCellStyle(dcs[col]);
				}
			}
			bao = response.getOutputStream();
			workBook.write(bao);
			
		} finally {
			bao.close();
		}

    return;
} else {
%><!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Cache-Control" content="no-cache; no-store; no-save"/>
<meta http-equiv="Content-Type" content="application/vnd.ms-excel;charset=UTF-8"/><%
}
response.setHeader("Content-Description", "JSP Generated Data");
response.setContentType("application/vnd.ms-excel;charset=UTF-8");

fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
response.setHeader("Content-Disposition","attachment;filename="+fileName+";");

out.print(excelData);
%><%!
private static HSSFCellStyle getTitleStyle(HSSFWorkbook wb) {
	// font
	HSSFFont hf = wb.createFont();
	hf.setFontHeightInPoints((short) 10);
	hf.setColor((short) HSSFColor.BLACK.index);
	hf.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

	// Header style setting
	HSSFCellStyle hcs = wb.createCellStyle();
	hcs.setFont(hf);
	hcs.setAlignment(HSSFCellStyle.ALIGN_CENTER);

	// set border style
	hcs.setBorderBottom(HSSFCellStyle.BORDER_THICK);
	hcs.setBorderRight(HSSFCellStyle.BORDER_THIN);
	hcs.setBorderLeft(HSSFCellStyle.BORDER_THIN);
	hcs.setBorderTop(HSSFCellStyle.BORDER_THIN);
	hcs.setBorderBottom(HSSFCellStyle.BORDER_THIN);

	// set color
	// hcs.setFillBackgroundColor((short) HSSFColor.WHITE.index);
	hcs.setFillForegroundColor((short) HSSFColor.GREY_25_PERCENT.index);
	hcs.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
	hcs.setLocked(true);
	hcs.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

	return hcs;
}

private static HSSFCellStyle getTextStyle(HSSFWorkbook wb) {
	HSSFFont hf = wb.createFont();
	hf.setFontHeightInPoints((short) 10);
	hf.setColor((short) HSSFColor.BLACK.index);

	HSSFCellStyle hcs = wb.createCellStyle();
	hcs.setFont(hf);
	hcs.setAlignment(HSSFCellStyle.ALIGN_CENTER);

	// set border style
	hcs.setBorderBottom(HSSFCellStyle.BORDER_THICK);
	hcs.setBorderRight(HSSFCellStyle.BORDER_THIN);
	hcs.setBorderLeft(HSSFCellStyle.BORDER_THIN);
	hcs.setBorderTop(HSSFCellStyle.BORDER_THIN);
	hcs.setBorderBottom(HSSFCellStyle.BORDER_THIN);

	// set color
	hcs.setFillBackgroundColor((short) HSSFColor.WHITE.index);
	hcs.setFillForegroundColor((short) HSSFColor.WHITE.index);
	hcs.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

	hcs.setLocked(true);
	hcs.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

	return hcs;
}
%>





