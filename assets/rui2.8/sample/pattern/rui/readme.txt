아래 내용은 d-kit 적용을 원칙으로 하여 작성되었습니다. 

프로젝트에 포함해야 할 라이브러리 추가
json.jar

devon 프로젝트에 포함해야 할 내용 (4.2 이상 기준)
devon-framework.xml 적용 내용

    <navigation name="rui">
      <directory>#home/navigation/rui</directory>
      <encoding-type>UTF-8</encoding-type>
      <default-handler>null</default-handler>
    </navigation>
    

  <!-- Web Path 를 지정할 경우 사용하는 directory 정보  -->
  <content-path>
    <path name="root">/</path>
    <path name="image">/images</path>
    <path name="css">/css</path>
    <path name="js">/js</path>
    <path name="include">/jsp/common/include</path>
    <path name="rui">/rui</path>
  </content-path>
  


web.xml 적용 내역

  <servlet>
    <servlet-name>DefaultRuiChannelServlet</servlet-name>
    <servlet-class>devonsample.channel.DefaultRuiChannelServlet</servlet-class>
  </servlet>

  <servlet-mapping>
    <servlet-name>DefaultRuiChannelServlet</servlet-name>
    <url-pattern>*.rui</url-pattern>
  </servlet-mapping>

샘플 패턴 소스 적용
pt01.jsp ~ ptx01.jsp (서버 소스 포함)


개발환경 구성
    iframe 적용에 대한 소스 구성
        Rui 메뉴로 교체
    화면패턴 추가(웹패턴/페이지패턴)
    디자인 적용(rui_skin.css / 프로젝트용으로 적용시 css안에 있는 이미지 상대경로를 바꿔야 함)

    지원툴
        ruisample.url

체크 사항
    서버에 http gzip(압축) 적용
    데모 정상 여부 확인
    엑셀 다운로드 정상 여부 확인