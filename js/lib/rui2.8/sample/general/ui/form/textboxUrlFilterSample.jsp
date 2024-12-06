<%@ page language="java" contentType="text/plain; charset=UTF-8" pageEncoding="EUC-KR"
%><%@page import="java.util.*" 
%><%@page import="java.io.*" 
%><%@page import="org.json.JSONArray" 
%><%@page import="org.json.JSONObject" 
%><%
    List list = new ArrayList();
    for(int i = 0 ; i < 10; i++) {
        HashMap data = new HashMap();
        data.put("text", "Value"  +  (i + 1));
        list.add(data);
    }
    for(int i = 0 ; i < 10; i++) {
        HashMap data = new HashMap();
        data.put("text", "Code"  +  (i + 1));
        list.add(data);
    }
    
    String text = request.getParameter("text");
    if(text == null)   
    	text = "";
    text = text.toLowerCase();

    JSONArray jarr = new JSONArray();
   	for(int i=0; i<list.size(); i++){
	  	HashMap data = (HashMap)list.get(i);
	  	if(data != null){
	  		String _text = (String)data.get("text");
	  		if(_text != null){
	  			_text = _text.toLowerCase();
	  			if(_text.indexOf(text) > -1){
		    		JSONObject obj = new JSONObject();
		    		obj.put("text", (String)data.get("text")); 
		    		jarr.put(obj); 
	  			}
	  		}
	  	}
   	}
    
	 StringBuilder jData = new StringBuilder();
	 jData.append("[{"); 
	 jData.append("\"metaData\": {"); 
	 jData.append("\"datasetId\":\"dataset1\"");
	 jData.append("},");
	 jData.append("\"records\": ");  
	 jData.append(jarr.toString()); 
	 jData.append("}]"); 
	 
%><%=jData.toString()%>	
