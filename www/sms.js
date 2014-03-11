var sms = {
    send: function(phone, message, method, successCallback, failureCallback) {
        var self = this;
    	// iOS plugin used to accept comma-separated phone numbers, keep the
    	// compatibility
    	if (typeof phone === 'string' && phone.indexOf(',') !== -1) {
    	    phone = phone.split(',');
    	}
        if (Object.prototype.toString.call(phone) !== '[object Array]') {
            phone = [phone];
        }

        if(this._currentCallbacks){
            return failureCallback('only one sms request at a time')
        } else {
            self._currentCallbacks = [successCallback, failureCallback]
            cordova.exec(
                function success(){
                    self._currentCallbacks = false;
                    successCallback.apply(this, arguments)
                },
                function failure(){
                    self._currentCallbacks = false;
                    failureCallback.apply(this, arguments)
                }
                'Sms',
                'send',
                [phone, message, method]
            );
        }


    },
    _currentCallbacks: false,
    _didFinishWithResult: function(status){
        if(status === 1){
            _currentCallbacks[0](status);
        } else {
            _currentCallbacks[1](status);
        }
        this._currentCallbacks = false;
    }
};

module.exports = sms;