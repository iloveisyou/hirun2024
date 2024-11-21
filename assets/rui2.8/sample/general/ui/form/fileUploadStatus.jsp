<%
String fileUploadStatus = (String) session.getAttribute("fileUploadStatus");
if(fileUploadStatus == null) fileUploadStatus = "0";
out.println(fileUploadStatus);
/*
	uip.channel.LProgressListener listener = (uip.channel.LProgressListener) session.getAttribute("PROGRESS_LISTENER");
	String progress = null;
	if(listener != null){
	    System.out.println("listener " + listener.getBytesRead());
	    long bytesRead = listener.getBytesRead();
	    long contentLength = listener.getContentLength();
	    double rate = (double)bytesRead / (double)contentLength;
	    progress = String.valueOf(Math.round(rate * (double)100));
	}else{
	    System.out.println("listener " + listener);
	    progress = "0";
	}
	out.print(progress);
*/
%>