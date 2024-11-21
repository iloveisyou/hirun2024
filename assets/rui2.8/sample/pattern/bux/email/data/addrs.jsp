<%@ page language="java" contentType="text/plain; charset=UTF-8"pageEncoding="EUC-KR"
%><%@page import="java.util.*" 
%><%@page import="java.io.*" 
%><%@page import="org.json.JSONArray" 
%><%@page import="org.json.JSONObject" 
%><%
    List list = new ArrayList();
    Map data = null;
    int k = 65;
    for(int i = 0 ; i < 26; i++) {
        data = new HashMap();
        char[] ids = new char[4];
        for(int j = 0; j < ids.length; j++){
        	int kc = k + j;
        	if(kc > 90)
        		kc = 65 + (kc - 90) - 1;
        	ids[j] = (char)kc;
        }
        k++;
        data.put("value", new String(ids).toLowerCase() + "@test.com");
        list.add(data);
    }
    
    String value = request.getParameter("value");
    if(value == null)   
    	value = "";

    JSONArray jarr = new JSONArray();
   	for(int i=0; i<list.size(); i++){
	  	data = (HashMap)list.get(i);
	  	if(data != null){
	  		String _value = (String)data.get("value");
	  		if(_value != null && _value.indexOf(value) > -1){
	    		JSONObject obj = new JSONObject();
	    		obj.put("value", _value); 
	    		jarr.put(obj); 
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
