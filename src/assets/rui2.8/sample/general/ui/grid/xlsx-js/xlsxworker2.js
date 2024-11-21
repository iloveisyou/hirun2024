/* xlsx.js (C) 2013-2014 SheetJS -- http://sheetjs.com */
/* uncomment the next line for encoding support */
//importScripts('dist/cpexcel.js');
importScripts('jszip.js');
importScripts('xlsx.js');
/* uncomment the next line for ODS support */
importScripts('ods.js');
importScripts('xlsxutil.js');
postMessage({t:"ready"});

onmessage = function (oEvent) {
  var v;
  try {
    v = XLSX.read(ab2str(oEvent.data), {type: 'binary'});
  } catch(e) { postMessage({t:"e",d:e.stack}); }
  var res = {t:"xlsx", d:JSON.stringify(v)};
  var r = s2ab(res.d)[1];
  postMessage(r, [r]);
};