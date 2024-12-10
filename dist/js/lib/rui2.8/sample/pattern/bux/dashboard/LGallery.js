(function() {
    Rui.ui.LGallery = function(oConfig) {
        Rui.ui.LGallery.superclass.constructor.call(this, oConfig);
    };

    Rui.extend(Rui.ui.LGallery, Rui.ui.LUIComponent, {
        /**
         * @description 객체의 문자열
         * @property otype
         * @private
         * @type {String}
         */
        otype: 'Rui.ui.LGallery',
        /**
         * @description 기본 CSS명
         * @property CSS_BASE
         * @private
         * @type {String}
         */
        CSS_BASE: 'L-gallery',
        /**
         * @description 이미지를 출력할 갯수를 지정한다.
         * @config viewCount
         * @type {int}
         * @default 4
         */
         /**
         * @description 이미지를 출력할 갯수를 지정한다.
         * @property viewCount
         * @private
         * @type {int}
         */
        viewCount: 4,
        /**
         * @description 이미지를 출력할 갯수를 지정한다.
         * @config renderTime
         * @type {int}
         * @default 4
         */
         /**
         * @description 이미지를 출력할 갯수를 지정한다.
         * @property 200
         * @private
         * @type {int}
         */
        renderTime: 200,
         /**
         * @description 현재 출력된 이미지를 갯수.
         * @property totalPanelCount
         * @private
         * @type {int}
         */
        totalPanelCount: 0,
        startIndex: 0,
        /**
         * @description template 생성
         * @method createTemplate
         * @protected
         * @return {void}
         */
        createTemplate: function() {
            var ts = this.templates || {};
            if (!ts.master) {
                ts.master = new Rui.LTemplate(
                    '<a class="L-gallery-left"></a>',
                    '<div class="L-gallery-scroll">',
                        '<div class="L-gallery-view" style="margin-left:0px">',
                        '</div>',
                    '</div>',
                    '<a class="L-gallery-right"></a>'
                );
            }

            this.templates = ts;
            ts = null;
        },
        /**
         * @description 그리드를 모두 다시 그린다.
         * @method updateView
         * @protected
         * @return {void}
         */
        updateView: function() {
            Rui.ui.LGallery.superclass.updateView.call(this);
            var html = this.templates.master.apply({});
            this.el.html(html);
            this.scrollEl = this.el.select('.L-gallery-scroll').getAt(0);
            this.viewEl = this.el.select('.L-gallery-view').getAt(0);
            this.leftButton = this.el.select('.L-gallery-left').getAt(0);
            this.rightButton = this.el.select('.L-gallery-right').getAt(0);
            
            this.leftButton.on('click', this.onClick, this, true);
            this.rightButton.on('click', this.onClick, this, true);
            this.viewEl.on('mouseover', this.onMouseOver, this, true);
            this.viewEl.on('mouseout', this.onMouseOut, this, true);
        },
        /**
         * @description rendering
         * @method doRender
         * @protected
         * @return {void}
         */
        doRender: function(appendToNode){
            Rui.ui.LGallery.superclass.doRender.call(this, appendToNode);
            this.createTemplate();
            this.el.addClass(this.CSS_BASE);
            this.el.addClass('L-fixed');
            this.updateView();
            this._rendered = true;
            this.delayRR = Rui.later(this.renderTime, this, this.onItemRender, null, true);
        },
        onClick: function(e) {
            var buttonEl = Rui.get(e.target);
            var dir = buttonEl.hasClass('L-gallery-left') ? -1 : +1;
            var firstDom = this.viewEl.query('div:first-child');
            if(firstDom.length < 1) return;
            if(dir === -1 && this.startIndex === 0) return;
            this.doItemRender();
            if(dir === 1 && (this.totalPanelCount - this.startIndex) <= this.viewCount) return;
            this.startIndex += (dir * this.viewCount);
            if(this.startIndex < 0) this.startIndex = 0;
            var panelWidth = this.getPanelWidth();
            var left = this.startIndex * -(panelWidth * dir);
            this.scrollEl.setStyle('margin-left', left + 'px');
        },
        onMouseOver: function(e) {
            this.currPanelEl = Rui.get(e.target).findParent('.L-gallery-panel', 3);
            if(!this.currPanelEl) return;
            var idx = parseInt(this.currPanelEl.getAttribute('data-index'), 10);
            this.delayItemRR = Rui.later(500, this, this.onItemMouseOver, [idx], true);
        },
        onMouseOut: function(e) {
            if(this.delayItemRR) {
                this.delayItemRR.cancel();
                this.delayItemRR = null;
            }
        },
        onItemMouseOver: function(idx) {
            this.onMouseOut();
            this.doShowDetail(idx);
        },
        onItemRender: function(e) {
            this.doItemRender();
        },
        doItemRender: function() {
            if(this.renderer) {
                var len = 0;
                if(this.totalPanelCount < 1) {
                    var html = this.renderer({ index: this.totalPanelCount });
                    if(html) {
                        var pannelHtml = '<div class="L-gallery-panel" data-index="' + this.totalPanelCount + '">' + html + '</div>';
                        this.viewEl.appendChild(Rui.createElements(pannelHtml).getAt(0));
                        this.totalPanelCount++;

                        var elWidth = this.el.getWidth() + this.leftButton.getWidth() + this.rightButton.getWidth();
                        this.viewCount = Math.floor(elWidth / this.getPanelWidth()); 
                        len = this.viewCount - 1;
                    } 
                } else 
                      len = this.viewCount;

                for(var i = 0; i < len; i++) {
                    html = this.renderer({ index: this.totalPanelCount });
                    if(html) {
                        var pannelHtml = '<div class="L-gallery-panel" data-index="' + this.totalPanelCount + '">' + html + '</div>';
                        this.viewEl.appendChild(Rui.createElements(pannelHtml).getAt(0));
                        this.totalPanelCount++;
                    }
                }
            }
            if(this.delayRR && this.viewCount <= this.totalPanelCount) {
                this.delayRR.cancel();
                this.delayRR = null;
            }
        },
        onItemMouseOut: function(e) {
            var targetEl = Rui.get(e.target);
            if(!targetEl.hasClass('L-gallery-detail-panel')) return;
            if (this.detailPanelEl) {
                this.detailPanelEl.unOn('mouseout', this.onItemMouseOut, this);
                this.detailPanelEl.remove();
                this.detailPanelEl = null;
            }
        },
        doShowDetail: function(idx) {
            if(this.detailRenderer) {
                //TODO this.detailPanelEl 내부에 개발자의 메모리 릭 발생 가능성 있음.
                var html = this.detailRenderer({ index: idx });
                if(html) {
                    var pannelHtml = '<div class="L-gallery-detail-panel">' + html + '</div>';
                    this.detailPanelEl = Rui.createElements(pannelHtml).getAt(0);
                    Rui.getBody().appendChild(this.detailPanelEl);
                    this.detailPanelEl.on('mouseout', this.onItemMouseOut, this, true);
                    var top = this.currPanelEl.getTop();
                    var xy = this.currPanelEl.getXY();
                    var width = this.detailPanelEl.getWidth();
                    var height = this.detailPanelEl.getHeight();
                    var dpXY = [xy[0] - width / 4, xy[1] - height / 4];
                    this.detailPanelEl.setXY(dpXY);
                }
            }

        },
        getPanelWidth: function() {
            var firstDom = this.viewEl.query('div:first-child');
            if(firstDom.length < 1) return -1;
            firstDom = Rui.get(firstDom[0]);
            var width = firstDom.getWidth();
            width += parseInt(Rui.util.LString.simpleReplace(firstDom.getStyle('margin-left'), 'px', ''), 10);
            width += parseInt(Rui.util.LString.simpleReplace(firstDom.getStyle('margin-right'), 'px', ''), 10);
            return width;
        }
    });
})();
