/*
 * 
 */


/**
 * 막히지 않은 큐의 연속된 callback들을 실행하기 위한 메커니즘.  
 * 각각의 callback은 음수 타임아웃으로 설정되지 않는 한 설정된 타임아웃을 통해 실행되며,
 * 이 경우 그것은 이전 callback과 동일한 실행 스레드에서 blocking 모드로 실행된다.
 * callback들은 다음과 같은 함수 참조나 object literal이 될 수 있다:
 * <ul>
 *    <li><code>method</code> - {Function} REQUIRED callback 함수.</li>
 *    <li><code>scope</code> - {Object} callback을 실행하기 위한 scope. 기본적으로 global window scope 이다.</li>
 *    <li><code>argument</code> - {Array} 개별의 argument들로서 method에 전달될 parameter들.</li>
 *    <li><code>timeout</code> - {number} 이전 callback의 완료 이후와 해당 callback을 실행하기 전에 기다리기 위한 밀리초 지연시간. 음수값은 즉시 실행 차단을 일으킨다. 기본값은 0.</li>
 *    <li><code>until</code> - {Function} 각각의 반복 이전에 실행될 boolean 함수. 완료를 표시하고 다음 callback으로 진행하기 위해서 true를 반환한다.</li>
 *    <li><code>iterations</code> - {Number} chain에서 다음 callback으로 진행하기 이전에 callback을 실행하기 위한 번호. <code>until</code>과 호환되지 않는다.</li>
 * </ul>
 *
 * @namespace Rui.util
 * @class LChain
 * @constructor
 * @param {Function|Object} callback 큐를 초기화 하기 위한 callback의 개수
 */
Rui.util.LChain = function () {
    /**
     * The callback queue
     * @property q
     * @type {Array}
     * @private
     */
    this.q = [].slice.call(arguments);

    /**
     * callback 큐가 실행을 통해 비게되면 event가 발생한다.(chain.stop()에 대한 호출을 통해서가 아님)
     * @event end
     */
    this.createEvent('end');
};

Rui.util.LChain.prototype = {
    /**
     * timeout은 실행을 일시정지하거나 종료하기 위해 사용되며, Chain의 실행 상태를 표시한다.
     * 0은 일시정지나 종료를 표시, -1은 실행의 blocking을 표시, 다른 양의 숫자들은 non-blocking 실행을 표시한다. 
     * @property id
     * @type {number}
     * @private
     */
    id: 0,

    /**
     * chain 실행을 시작하거나 마지막 일시정지 위치로부터 실행을 재개한다.
     * @method run
     * @return {Chain} the Chain instance
     */
    run: function () {
        debugger; //미사용 컴포넌트 제거 (문혁찬) 
        // Grab the first callback in the queue
        var c  = this.q[0],
            fn;

        // If there is no callback in the queue or the Chain is currently
        // in an execution mode, return
        if (!c) {
            this.fireEvent('end');
            return this;
        } else if (this.id) {
            return this;
        }

        fn = c.method || c;

        if (typeof fn === 'function') {
            var o    = c.scope || {},
                args = c.argument || [],
                ms   = c.timeout || 0,
                me   = this;
                
            if (!(args instanceof Array)) {
                args = [args];
            }

            // Execute immediately if the callback timeout is negative.
            if (ms < 0) {
                this.id = ms;
                if (c.until) {
                    for (;!c.until();) {
                        // Execute the callback from scope, with argument
                        fn.apply(o,args);
                    }
                } else if (c.iterations) {
                    for (;c.iterations-- > 0;) {
                        fn.apply(o,args);
                    }
                } else {
                    fn.apply(o,args);
                }
                this.q.shift();
                this.id = 0;
                return this.run();
            } else {
                // If the until condition is set, check if we're done
                if (c.until) {
                    if (c.until()) {
                        // Shift this callback from the queue and execute the next
                        // callback
                        this.q.shift();
                        return this.run();
                    }
                // Otherwise if either iterations is not set or we're
                // executing the last iteration, shift callback from the queue
                } else if (!c.iterations || !--c.iterations) {
                    this.q.shift();
                }

                // Otherwise set to execute after the configured timeout
                this.id = setTimeout(function () {
                    // Execute the callback from scope, with argument
                    fn.apply(o,args);
                    // Check if the Chain was not paused from inside the callback
                    if (me.id) {
                        // Indicate ready to run state
                        me.id = 0;
                        // Start the fun all over again
                        me.run();
                    }
                },ms);
            }
        }

        return this;
    },
    
    /**
     * 큐의 끝에 callback을 추가한다.
     * @method add
     * @param c {Function|Object} callback 함수 참조나 object literal
     * @return {Chain} the Chain instance
     */
    add: function (c) {
        debugger; //미사용 컴포넌트 제거 (문혁찬) 
        this.q.push(c);
        return this;
    },

    /**
     * 현재 callback의 현재 실행 이후에 Chain의 실행 일시정지를 완료한다.
     * 간헐적으로 호출되는 경우 보류중인 callback에 대한 timeout을 지운다.
     * 일시정지된 Chain들은 chain.run()으로 재시작될 수 있다.
     * @method pause
     * @return {Chain} the Chain instance
     */
    pause: function () {
        debugger; //미사용 컴포넌트 제거 (문혁찬) 
        clearTimeout(this.id);
        this.id = 0;
        return this;
    },

    /**
     * 현재 callback의 현재 실행 이후에 Chain의 큐를 종료하고 지우는 것을 완료한다.
     * @method stop
     * @return {Chain} the Chain instance
     */
    stop: function () { 
        debugger; //미사용 컴포넌트 제거 (문혁찬) 
        this.pause();
        this.q = [];
        return this;
    }
};
Rui.applyPrototype(Rui.util.LChain,Rui.util.LEventProvider);
