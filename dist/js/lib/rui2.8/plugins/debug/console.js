Rui.ui.LLogger = function(){
    if(Rui.ui.LLogger.caller != Rui.ui.LLogger.getInstance){
        throw new Rui.LException("Can't call the constructor method.", this);
     }
};

Rui.ui.LLogger.instanceObj = null;

Rui.ui.LLogger.getInstance = function() {
    if(Rui.ui.LLogger.instanceObj == null){
        Rui.ui.LLogger.instanceObj = new Rui.ui.LLogger();
    }
    return Rui.ui.LLogger.instanceObj ;
};

Rui.applyObject(Rui.ui.LLogger.prototype, {
    logs: [],
    sources: {},
    active: true,
    lastLogDate: new Date(),
    lastSourceDate: new Date(),
    log: function(msg, cat, src) {
        if(this.active == false) return;
        var fSrc = 'source' + (src || 'Global');
        if(!this.sources[fSrc]) {
            this.sources[fSrc] = true;
            if (this.sourceFn) {
                this.lastSourceDate = new Date();
                if(!this.sourceLater)
                    this.sourceLater = Rui.later(500, this, this.refreshSource, [], true);
            }
        }
        this.logs.push({ id: Rui.id(), time: new Date(), msg:msg, cat:cat, src:src });
        if (this.noticeFn) {
            this.lastLogDate = new Date();
            if(!this.noticeLater)
                this.noticeLater = Rui.later(500, this, this.refreshNotice, [], true);
        }
    },
    updateLog: function(message, filename, lineno) {
        for(var i = this.logs.length - 1; i >= 0 ; i--) {
            var data = this.logs[i];
            if(data.cat == 'error' && data.msg == msg) {
                data.msg = 'filename : ' + filename + '\r\nlineno : ' + lineno + '\r\nmessage : ' + data.msg;
            }
        }
    },
    putAllLog: function(logs) {
        this.logs = logs;
        for(var i = 0, len = logs.length ; i < len ; i++) {
            var fSrc = 'source' + (logs[i].src || 'Global');
            if(!this.sources[fSrc]) {
                this.sources[fSrc] = true;
            }
        }
        if(this.sourceFn)
            this.sourceFn.call(this, this.sources);
    },
    getLogs: function(cat, src) {
        var logs = [];
        
        for(var i = 0, len = this.logs.length ; i < len; i++) {
            if(cat && this.logs[i].cat != cat)
                 continue;
            if(src && this.logs[i].src != src)
                 continue;
            logs.push(this.logs[i]);
        }
        return logs;
    },
    onNotice: function(fn, cat, src) {
        this.noticeFn = fn;
    },
    onSource: function(fn) {
        this.sourceFn = fn;
    },
    getLog: function(id) {
        for(var i = 0, len = this.logs.length ; i < len; i++) {
            if(this.logs[i].id == id) {
                return this.logs[i];
            }
        }
        return null;
    },
    notice: function() {
        if(this.noticeFn) this.noticeFn.call(this, this.getLogs());
    },
    setActive: function(isActive) {
        this.active = isActive;
    },
    setActiveEvent: function(type, isActive) {
        if (!opener) {
            alert('메인 창이 없습니다.');
            return;
        }
        opener.Rui['isDebug' + type] = isActive;
    },
    clear: function() {
        this.logs = [];
        this.notice();
    },
    refreshSource: function() {
        var compTime = new Date() - this.lastSourceDate;
        if (compTime < 500) {
            return;
        } 
        this.sourceLater.cancel();
        this.sourceLater = null;
        if(this.sourceFn)
            this.sourceFn.call(this, this.sources);
    },
    refreshNotice: function() {
        var compTime = new Date() - this.lastLogDate;
        if (compTime < 500) {
            return;
        } 
        this.noticeLater.cancel();
        this.noticeLater = null;
        if(this.noticeFn)
            this.noticeFn.call(this, this.getLogs());
    }
});