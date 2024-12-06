/*
 * @(#) LPanelManager.js
 *
 * DevOn RUI
 * Build Version : 2.8
 * 
 * Copyright ⓒ LG CNS, Inc. All rights reserved.
 *
 * DevOn RUI의 모든 저작물은 LG CNS 의 지적재산입니다.
 * LG CNS로 부터 허가 받지 않은 경우 사용, 열람, 복사, 수정, 재배포 할 수 없으며 외부로의 유출을 금지합니다.
 * 특히 소스 코드를 수정하는 경우 기술 지원의 대상이 되지 않을 수 있습니다.
 * 자세한 사항은 계약사항에 따릅니다. 기타 사항은 devon@lgcns.com 으로 문의 하십시오.
 *
 * Do Not Erase This Comment!!! (이 주석문을 지우지 말것)
 *
 * rui/license.txt를 반드시 읽어보고 사용하시기 바랍니다. License.txt파일은 절대로 삭제하시면 안됩니다. 
 *
 * 1. 사내 사용시 KAMS를 통해 요청하여 사용허가를 받으셔야 소프트웨어 라이센스 계약서에 동의하는 것으로 간주됩니다.
 * 2. DevOn RUI가 포함된 제품을 판매하실 경우에도 KAMS를 통해 요청하여 사용허가를 받으셔야 합니다.
 * 3. KAMS를 통해 사용허가를 받지 않은 경우 소프트웨어 라이센스 계약을 위반한 것으로 간주됩니다.
 * 4. 별도로 판매될 경우는 LGCNS의 소프트웨어 판매정책을 따릅니다.
 * 
 * (추가) Plugin 하위 목록에 포함된 파일의 경우 프로젝트에서 임의로 customizing 해서 사용 가능합니다.
 * 단, 프로젝트에서 customizing 한 사항은 기술지원 대상 범위에서 제외됩니다.
 * 
 */
(function () {
    Rui.ui.LPanelManager = function (userConfig) {
        this.init(userConfig);
    };
    var Overlay = Rui.ui.LPanel,
        Event = Rui.util.LEvent,
        Dom = Rui.util.LDom,
        Config = Rui.ui.LConfig,
        LCustomEvent = Rui.util.LCustomEvent,
        LPanelManager = Rui.ui.LPanelManager;
    LPanelManager.CSS_FOCUSED = "focused";
    LPanelManager.prototype = {
        constructor: LPanelManager,
        overlays: null,
        initDefaultConfig: function () {
            this.cfg.addProperty("overlays", { suppressEvent: true } );
            this.cfg.addProperty("focus", { value: "mousedown" } );
        },
        init: function (userConfig) {
            this.cfg = new Config(this);
            this.initDefaultConfig();
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true);
            }
            this.cfg.fireQueue();
            var activeOverlay = null;
            this.getActive = function () {
                return activeOverlay;
            };
            this.focus = function (overlay) {
                var o = this.find(overlay);
                if (o) {
                    o.focus();
                }
            };
            this.remove = function (overlay) {
                var o = this.find(overlay), 
                        originalZ;
                if (o) {
                    if (activeOverlay == o) {
                        activeOverlay = null;
                    }
                    var bDestroyed = (o.element === null && o.cfg === null) ? true : false;
                    if (!bDestroyed) {
                        originalZ = Dom.getStyle(o.element, "zIndex");
                        o.cfg.setProperty("zIndex", -1000, true);
                    }
                    this.overlays.sort(this.compareZIndexDesc);
                    this.overlays = this.overlays.slice(0, (this.overlays.length - 1));
                    o.unOn('hide', o.blur, o);
                    o.unOn('destroy', this._onOverlayDestroy, o);
                    o.unOn('focus', this._onOverlayFocusHandler, o);
                    o.unOn('blue', this._onOverlayBlurHandler, o);
                    if (!bDestroyed) {
                        Event.removeListener(o.element, this.cfg.getProperty("focus"), this._onOverlayElementFocus);
                        o.cfg.setProperty("zIndex", originalZ, true);
                        o.cfg.setProperty("manager", null);
                    }
                }
            };
            this.blurAll = function () {
                var nOverlays = this.overlays.length, i;
                if (nOverlays > 0) {
                    i = nOverlays - 1;
                    do {
                        this.overlays[i].blur();
                    }
                    while (i--);
                }
            };
            this._manageBlur = function (overlay) {
                if(typeof overlay === "undefined") return; 
                var changed = false;
                if (activeOverlay == overlay) {
                    Dom.removeClass(activeOverlay.element, LPanelManager.CSS_FOCUSED);
                    activeOverlay = null;
                    changed = true;
                }
                return changed;
            };
            this._manageFocus = function(overlay) {
                if(typeof overlay === "undefined") return; 
                var changed = false;
                if (activeOverlay != overlay) {
                    if (activeOverlay) {
                        activeOverlay.blur();
                    }
                    activeOverlay = overlay;
                    this.bringToTop(activeOverlay);
                    Dom.addClass(activeOverlay.element, LPanelManager.CSS_FOCUSED);
                    changed = true;
                }
                return changed;
            };
            var overlays = this.cfg.getProperty("overlays");
            if (! this.overlays) {
                this.overlays = [];
            }
            if (overlays) {
                this.register(overlays);
                this.overlays.sort(this.compareZIndexDesc);
            }
        },
        _onOverlayElementFocus: function (p_oEvent) {
            var oTarget = Event.getTarget(p_oEvent),
                oClose = this.close;
            if (oClose && (oTarget == oClose || Dom.isAncestor(oClose, oTarget))) {
                this.blur();
            } else {
                this.focus();
            }
        },
        _onOverlayDestroy: function (p_sType, p_aArgs, p_oOverlay) {
            this.remove(p_oOverlay);
        },
        _onOverlayFocusHandler: function(p_sType, p_aArgs, p_oOverlay) {            
            this._manageFocus(p_oOverlay);
        },
        _onOverlayBlurHandler: function(p_sType, p_aArgs, p_oOverlay) {
            this._manageBlur(p_oOverlay);
        },
        _bindFocus: function(overlay) {
            var mgr = this;
            overlay.on('focus', mgr._onOverlayFocusHandler, this, true);
            Event.on(overlay.element, mgr.cfg.getProperty("focus"), mgr._onOverlayElementFocus, null, overlay);
            overlay.focus = function () {
                if (mgr._manageFocus(this)) {
                    if (this.cfg.getProperty("visible") && this.focusFirst) {
                        this.focusFirst();
                        }
                     this.fireEvent('focus', {target: this});
               }
            };
            overlay.focus._managed = true;
        },
        _bindBlur: function(overlay) {
            var mgr = this;
            overlay.on('blur', mgr._onOverlayBlurHandler, this, true);
            overlay.blur = function () {
                if (mgr._manageBlur(this)) {
                    this.fireEvent('blur', {target: this}); 
                    }
            };
            overlay.blur._managed = true;
            overlay.on('hide', overlay.blur, this, true);
        },
        _bindDestroy: function(overlay) {
            var mgr = this;
            overlay.on('destroy', mgr._onOverlayDestroy, mgr, true); 
        },
        _syncZIndex: function(overlay) {
            var zIndex = Dom.getStyle(overlay.element, "zIndex");
            if (!isNaN(zIndex)) {
                overlay.cfg.setProperty("zIndex", parseInt(zIndex, 10));
            } else {
                overlay.cfg.setProperty("zIndex", 0);
            }
        },
        register: function (overlay) {
            var registered = false,
                i,
                n;
            if (overlay instanceof Overlay) {
                overlay.cfg.addProperty("manager", { value: this } );
                this._bindFocus(overlay);
                this._bindBlur(overlay);
                this._bindDestroy(overlay);
                this._syncZIndex(overlay);
                this.overlays.push(overlay);
                this.bringToTop(overlay);
                registered = true;
            } else if (overlay instanceof Array) {
                for (i = 0, n = overlay.length; i < n; i++) {
                    registered = this.register(overlay[i]) || registered;
                }
            }
            return registered;
        },
        bringToTop: function (p_oOverlay) {
            var oOverlay = this.find(p_oOverlay),
                nTopZIndex,
                oTopOverlay,
                aOverlays;
            if (oOverlay) {
                aOverlays = this.overlays;
                aOverlays.sort(this.compareZIndexDesc);
                oTopOverlay = aOverlays[0];
                if (oTopOverlay) {
                    nTopZIndex = Dom.getStyle(oTopOverlay.element, "zIndex");
                    if (!isNaN(nTopZIndex)) {
                        var bRequiresBump = false;
                        if (oTopOverlay !== oOverlay) {
                            bRequiresBump = true;
                        } else if (aOverlays.length > 1) {
                            var nNextZIndex = Dom.getStyle(aOverlays[1].element, "zIndex");
                            if (!isNaN(nNextZIndex) && (nTopZIndex == nNextZIndex)) {
                                bRequiresBump = true;
                            }
                        }
                        if (bRequiresBump) {
                            oOverlay.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2));
                        }
                    }
                    aOverlays.sort(this.compareZIndexDesc);
                }
            }
        },
        find: function (overlay) {
            var isInstance = overlay instanceof Overlay,
                overlays = this.overlays,
                n = overlays.length,
                found = null,
                o,
                i;
            if (isInstance || typeof overlay == "string") {
                for (i = n-1; i >= 0; i--) {
                    o = overlays[i];
                    if ((isInstance && (o === overlay)) || (o.id == overlay)) {
                        found = o;
                        break;
                    }
                }
            }
            return found;
        },
        compareZIndexDesc: function (o1, o2) {
            var zIndex1 = (o1.cfg) ? o1.cfg.getProperty("zIndex") : null, 
                zIndex2 = (o2.cfg) ? o2.cfg.getProperty("zIndex") : null; 
            if (zIndex1 === null && zIndex2 === null) {
                return 0;
            } else if (zIndex1 === null){
                return 1;
            } else if (zIndex2 === null) {
                return -1;
            } else if (zIndex1 > zIndex2) {
                return -1;
            } else if (zIndex1 < zIndex2) {
                return 1;
            } else {
                return 0;
            }
        },
        showAll: function () {
            var overlays = this.overlays,
                n = overlays.length,
                i;
            for (i = n - 1; i >= 0; i--) {
                overlays[i].show();
            }
        },
        hideAll: function () {
            var overlays = this.overlays,
                n = overlays.length,
                i;
            for (i = n - 1; i >= 0; i--) {
                overlays[i].hide();
            }
        },
        toString: function () {
            return "LPanelManager";
        }
    };
}());