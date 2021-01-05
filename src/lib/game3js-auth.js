
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.G3JSAuth = {}));
}(this, (function (exports) { 'use strict';

    const CONSTANTS = 
    { 
        SERVER_TYPES : 
        {
            NAKAMA: "nakama"
        }, 
        
        SDK_STATES: 
        {
            UNINITIALIZED: "uninitialized",
            INITIALIZED: "initialized"
        },
        
        LOGIN_STATES:
        {
            LOGGED_IN: "logged in",
            LOGGED_OUT: "logged out"
        }
    };

    class Auth {

      sdkState = CONSTANTS.SDK_STATES.UNINITIALIZED;
      authOptions = null;

      constructor(options) {
        this.authOptions = options;
        this.sdkState = CONSTANTS.SDK_STATES.INITIALIZED;
      }

      getSdkState() {
        return this.sdkState
      }

      connect() {
        return CONSTANTS.LOGIN_STATES.LOGGED_IN
      }


    }

    const DEFAULT_NAKAMA_CONFIG = {
    	type: "nakama",
    	url: "http://127.0.0.1",
    	port: 7350,
    	key: "defaultkey"
    };


    const NakamaConfig = (options) => {

        // TODO
        if (options === undefined)
            return DEFAULT_NAKAMA_CONFIG;
    };

    const init = (options) => {

    	if (options === undefined)
    		options = DEFAULT_NAKAMA_CONFIG;

    	return new Auth(options);
    };

    exports.CONSTANTS = CONSTANTS;
    exports.NakamaConfig = NakamaConfig;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=game3js-auth.js.map
