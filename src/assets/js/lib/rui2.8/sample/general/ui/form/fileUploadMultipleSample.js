
var MultiFileUploadManager = function(form, el, config){
	config = config || {};
    this.formEl = Rui.get(form);
    this.el = Rui.get(el);
    Rui.applyIf(this, config, true);
    
    if(config.message)
    	this.message = config.message;
    this.init();
};

MultiFileUploadManager.prototype = {
    fileEls: [],
    deletedFileSeqs: [],
    addedFileSeq: 0,
    locked: false,
    delayTime: 500,
    message: '파일을 업로드 중 입니다. 잠시만 기다려주세요.',
    
    init: function(){
        this.bodyEl = Rui.get(document.body);
        
        this.activeTaskDelegate = Rui.util.LFunction.createDelegate(this.activeTask, this);
        this.updateProgressDelegate = Rui.util.LFunction.createDelegate(this.updateProgress, this);
        
        this.dialogEl = Rui.get(document.createElement('div'));
        this.dialogEl.addClass('file-upload-dialog');
        
        this.el.appendChild(this.dialogEl.dom);

    	var template = new Rui.LTemplate(
            '<div class="file-upload-message">{message}</div>',
            '<div class="file-upload-progress-stopper"><a>닫기</a></div>',
        	'<div class="file-upload-progressbar"' + (Rui.useAccessibility() ? ' aria-valuemin="0" aria-valuemax="100"' : '') + '><div class="file-upload-progressbar-mask" style="margin-left: 0%"></div></div>',
            '<div class="file-upload-progress">100%</div>'
        );
    	this.dialogEl.html(template.apply({message: this.message}));
    	
    	this.cancelButtonEl = this.dialogEl.select('.file-upload-progress-stopper a').getAt(0);
        this.progressBarEl = Rui.select('.file-upload-progressbar').getAt(0);
        this.progressMaskEl = this.progressBarEl.select('.file-upload-progressbar-mask').getAt(0);
        this.progressEl = Rui.select('.file-upload-progress').getAt(0);
        
    	this.cancelButtonEl.on('click', function(){
    		this.stopProgress();
    	}, this, true);
    	
    	this.setProgressValue(0);
    },
    
    addFile: function(fn){
        if(this.isLocked())
            return;
            
        this.lock();
        if(!this.fileContainerEl){
            this.fileContainerEl = Rui.get(document.createElement('div'));
            this.formEl.appendChild(this.fileContainerEl);
        }
        var inputEl = Rui.get(document.createElement('input'));
        inputEl.dom.type = 'file';
        inputEl.dom.id = 'file'+this.addedFileSeq;
        inputEl.dom.name = 'file'+this.addedFileSeq;
        this.fileContainerEl.appendChild(inputEl);
        
        if(fn)
            fn(inputEl);
        
        this.fileEls.push({
            el: inputEl,
            index: this.addedFileSeq++
        });
    },
    
    deleteFile: function(row, storedFileSeq){
        var fileEl = this.fileEls[row];
        if(fileEl){
            this.fileEls.splice(row, 1);
            if(fileEl.el)
                this.fileContainerEl.removeChild(fileEl.el.dom);
        }
        if(storedFileSeq && storedFileSeq > -1)
            this.deletedFileSeqs.push(storedFileSeq);
    },
    
    //private
    reset: function(){
        this.updateStatus(false);
        for(var i = 0, len = this.fileEls.length; i < len; i++){
            var fileEl = this.fileEls[i];
            if(fileEl.el){
                this.fileContainerEl.removeChild(fileEl.el.dom);
                this.fileEls[i].el = null;
            }
        }
        this.fileEls = [];
        this.addedFileSeq = 0;
        this.deletedFileSeqs = [];
    },
    
    getDeletedFileSeqs: function(){
        return this.deletedFileSeqs;
    },
    
    isLocked: function(){
        return this.locked;
    },
    
    lock: function(){
        this.locked = true;
    },
    
    unlock: function(){
        this.locked = false;
    },
    
    activeTask: function() {
        var uri = this.statusUrl;
        uri = Rui.util.LString.getTimeUrl(uri);
        Rui.LConnect.asyncRequest('GET', uri, {
            success: this.updateProgressDelegate,
            failure: Rui.util.LFunction.createDelegate(function(e) {
                 Rui.log('active task update failure');
            }, this)
        });
    },
    
    setProgressValue: function(percent) {
        this.progressMaskEl.setStyle('margin-left', percent + '%');
        this.progressEl.html(percent + '%');
        if(Rui.useAccessibility()){
        	this.progressBarEl.setAttribute('aria-valuenow', '' + percent);
        }
    },
    
    updateProgress : function(e) {
        try {
            var isUpdateStatus = this.isUpdateStatus() ;
            var percent = isUpdateStatus ? parseInt(e.responseText) : 100;
            console.log(e.responseText);
            this.setProgressValue(percent); 
            if(percent < 100 && isUpdateStatus)
                this.activeDelayedTask.delay(this.delayTime);
        } catch(e) {}
    },
    
    updateStatus: function(status) {
        if (status){
        	this.bodyEl.mask();
        	this.el.addClass('upload-status');
        }else{
        	this.bodyEl.unmask();
        	this.el.removeClass('upload-status');
        }
    },
    
    isUpdateStatus: function() {
        return this.el.hasClass('upload-status');
    },
    
    startProgress: function(statusUrl) {
    	this.statusUrl = statusUrl;
    	this.setProgressValue(0);
    	this.updateStatus(true);
        if(!this.activeDelayedTask)
            this.activeDelayedTask = new Rui.util.LDelayedTask(this.activeTaskDelegate);
        
        this.activeDelayedTask.delay(500);
    },
    
    stopProgress: function(){
    	this.updateStatus(false);
    }, 
    
    full: function(){
    	this.setProgressValue(100);
    }
    
};
