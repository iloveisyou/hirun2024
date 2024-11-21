<%@ page language="java" contentType="text/javascript; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %><%
try {
	// commons-codec-1.3.jar
    // commons-httpclient-3.1.jar
	boolean isJsonp = false;
	String tId = request.getParameter("tId");
	String callback = request.getParameter("callback");
	if (callback != null) {
	    response.setContentType("text/javascript");
        isJsonp = true;
	} else {
        response.setContentType("application/x-json");
	}

	if (isJsonp) 
	    out.write(callback + "(");
	out.print("'2.0 beta3'");
	if (isJsonp)
	    out.write(");");
} catch (Exception e) {
	out.print(e.getMessage());
    //throw new IOException("call url exception : " + e.getMessage());
}
%>