<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %><%
String searchType = request.getParameter("searchType");
if(searchType != null)
	searchType = new String(searchType.getBytes("8859_1"), "utf-8");

if("".equals(searchType)) 
	searchType = "ALL";
String keyword = request.getParameter("keyword");
if(keyword != null)
	keyword = new String(keyword.getBytes("8859_1"), "utf-8");

Connection conn = null;
Statement stmt = null;
ResultSet rs = null;
String selectSql = "select * from rui_keyword where keyword = '" + keyword + "' and search_type = '" + searchType + "'";
try {
	stmt = conn.createStatement();
	rs = stmt.executeQuery(selectSql);
	if(rs.next()) {
		int count = rs.getInt("search_count");
		String updateSql = "update rui_keyword set search_count = " + count + " where keyword = '" + keyword + "' and search_type = '" + searchType + "'";
		stmt.executeUpdate(updateSql);
	} else {
		String insertSql = "insert into rui_keyword (keyword, search_type, reg_dtime, search_count) values ";
		insertSql += "('" + keyword + "', '" + searchType + "', to_char(sysdate, 'YYYYMMDDHHMI24SS'), 1)";
		stmt.executeUpdate(insertSql);
	}
} catch(Exception e) {
	e.printStackTrace();
} finally {
	if(rs != null) try { rs.close(); } catch(Exception e1) {};
	if(stmt != null) try { stmt.close(); } catch(Exception e1) {};
	if(conn != null) try { conn.close(); } catch(Exception e1) {};
}
%>