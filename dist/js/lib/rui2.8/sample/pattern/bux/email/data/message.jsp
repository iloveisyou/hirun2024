<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%><%
String mailId = request.getParameter("mailId");
%>[{
"metaData":{
    "fields":[
        {"name":"mailId"},
        {"name":"important"},
        {"name":"clip"},
        {"name":"sender"},
        {"name":"receivers"},
        {"name":"cc"},
        {"name":"subject"},
        {"name":"message"},
        {"name":"date"},
        {"name":"size"},
        {"name":"files"}
    ]
},
"records":[
    {
    "mailId":"<%=mailId%>",
    "important":"N",
    "clip":"N",
    "sender":{"name":"최준호", "email":"jhchoi@test.com"},
    "receivers":[{"name":"박승군", "email":"skunpark@test.com"}, {"name":"이혁창", "email":"hclee@test.com"}],
    "cc":[{"name":"전성민", "email":"sungmin@test.com"}, {"name":"박후성", "email":"hspark@test.com"}, {"name":"정동임", "email":"dijung@test.com"}],
    "subject":"[Org FW]오픈소스 사용 문의",
    "message":"메일 본문은 공개할 수 없습니다.",
    "date":"2012-01-01",
    "size":"5",
    "files":[{"name":"license_1.txt", "size": 102039}, {"name":"license_2.txt", "size":57235}]
    }
]
}]
