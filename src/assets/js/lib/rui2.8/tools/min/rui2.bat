echo off

rem ----- paths -----
set JSMIN_PATH=%~dp0
set RUI_HOME=%JSMIN_PATH%..\..\

echo JSMIN_PATH = %JSMIN_PATH%
echo RUI_HOME = %RUI_HOME%

set JS_PLUGIN_FORM="\plugins\form\"
set JS_PLUGIN_FX="\plugins\fx\"
set JS_PLUGIN_LAYOUT="\plugins\layout\"
set JS_PLUGIN_MENU="\plugins\menu\"
set JS_PLUGIN_TAB="\plugins\tab\"
set JS_PLUGIN_TREE="\plugins\tree\"
set JS_PLUGIN_VALIDATE="\plugins\validate\"


rem ----- execute -----

echo on

%JSMIN_PATH%jsmin.exe < %RUI_HOME%js\rui_base.js > %RUI_HOME%js\rui_base-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%js\rui_core.js > %RUI_HOME%js\rui_core-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%js\rui_ui.js > %RUI_HOME%js\rui_ui-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%js\rui_form.js > %RUI_HOME%js\rui_form-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%js\rui_grid.js > %RUI_HOME%js\rui_grid-min.js

rem %JSMIN_PATH%jsmin.exe < %RUI_HOME%js\rui_bootstrap.js > %RUI_HOME%js\rui_bootstrap-min.js

%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_FORM%rui_form.js > %RUI_HOME%%JS_PLUGIN_FORM%rui_form-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_FX%rui_fx.js > %RUI_HOME%%JS_PLUGIN_FX%rui_fx-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_LAYOUT%rui_layout.js > %RUI_HOME%%JS_PLUGIN_LAYOUT%rui_layout-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_MENU%rui_menu.js > %RUI_HOME%%JS_PLUGIN_MENU%rui_menu-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_TAB%rui_tab.js > %RUI_HOME%%JS_PLUGIN_TAB%rui_tab-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_TREE%rui_tree.js > %RUI_HOME%%JS_PLUGIN_TREE%rui_tree-min.js
%JSMIN_PATH%jsmin.exe < %RUI_HOME%%JS_PLUGIN_VALIDATE%rui_validate.js > %RUI_HOME%%JS_PLUGIN_VALIDATE%rui_validate-min.js

pause