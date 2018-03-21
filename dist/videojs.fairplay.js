/**
 * videojs-fairplay v0.2.0
 * 
 * @author: Carey Hinoki <carey.hinoki@gmail.com> (http://www.careyhinoki.me/)
 * @date: 2018-03-21
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _util = __webpack_require__(21);

	var _fairplay = __webpack_require__(22);

	var _fairplay2 = _interopRequireDefault(_fairplay);

	var _errorType = __webpack_require__(23);

	var _errorType2 = _interopRequireDefault(_errorType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var certificate = void 0; /* global videojs, WebKitMediaKeys */

	var logToBrowserConsole = false;

	var Html5Fairplay = function () {
	  (0, _createClass3.default)(Html5Fairplay, null, [{
	    key: 'setLogToBrowserConsole',
	    value: function setLogToBrowserConsole() {
	      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      logToBrowserConsole = value;
	    }
	  }]);

	  function Html5Fairplay(source, tech, options) {
	    (0, _classCallCheck3.default)(this, Html5Fairplay);

	    options = options || tech.options_;

	    if (!source.src) {
	      return;
	    }

	    this.el_ = tech.el();
	    this.player_ = videojs(options.playerId);
	    this.protection_ = source && source.protection;
	    this.tech_ = tech;

	    this.onCertificateError = this.onCertificateError.bind(this);
	    this.onCertificateLoad = this.onCertificateLoad.bind(this);
	    this.onKeySessionWebkitKeyAdded = this.onKeySessionWebkitKeyAdded.bind(this);
	    this.onKeySessionWebkitKeyError = this.onKeySessionWebkitKeyError.bind(this);
	    this.onKeySessionWebkitKeyMessage = this.onKeySessionWebkitKeyMessage.bind(this);
	    this.onLicenseError = this.onLicenseError.bind(this);
	    this.onLicenseLoad = this.onLicenseLoad.bind(this);
	    this.onVideoError = this.onVideoError.bind(this);
	    this.onVideoWebkitNeedKey = this.onVideoWebkitNeedKey.bind(this);

	    tech.isReady_ = false;

	    this.src(source);

	    tech.triggerReady();
	  }

	  (0, _createClass3.default)(Html5Fairplay, [{
	    key: 'createKeySession',
	    value: function createKeySession(keySystem, initData) {
	      this.log('createKeySession()');

	      if (!this.el_.webkitKeys) {
	        if (WebKitMediaKeys.isTypeSupported(keySystem, 'video/mp4')) {
	          this.el_.webkitSetMediaKeys(new WebKitMediaKeys(keySystem));
	        } else {
	          throw new Error('Key System not supported');
	        }
	      }

	      if (!this.el_.webkitKeys) {
	        throw new Error('Could not create MediaKeys');
	      }

	      var keySession = this.el_.webkitKeys.createSession('video/mp4', initData);

	      if (!keySession) {
	        throw new Error('Could not create key session');
	      }

	      return keySession;
	    }
	  }, {
	    key: 'fetchCertificate',
	    value: function fetchCertificate(_ref) {
	      var _this = this;

	      var callback = _ref.callback;

	      this.log('fetchCertificate()');

	      var certificateUrl = this.protection_.certificateUrl;


	      var request = new XMLHttpRequest();

	      request.responseType = 'arraybuffer';

	      request.addEventListener('error', this.onCertificateError, false);
	      request.addEventListener('load', function (event) {
	        _this.onCertificateLoad(event, {
	          callback: callback
	        });
	      }, false);

	      request.open('GET', certificateUrl, true);
	      request.send();
	    }
	  }, {
	    key: 'fetchLicense',
	    value: function fetchLicense(_ref2) {
	      var target = _ref2.target,
	          message = _ref2.message;

	      this.log('fetchLicense()');

	      var licenseUrl = this.protection_.licenseUrl;


	      var request = new XMLHttpRequest();

	      request.responseType = 'arraybuffer';
	      request.session = target;

	      request.addEventListener('error', this.onLicenseError, false);
	      request.addEventListener('load', this.onLicenseLoad, false);

	      request.open('POST', licenseUrl, true);
	      request.setRequestHeader('Content-type', 'application/octet-stream');
	      request.send(message);
	    }
	  }, {
	    key: 'getErrorResponse',
	    value: function getErrorResponse(response) {
	      if (!response) {
	        return 'NONE';
	      }

	      return String.fromCharCode.apply(null, new Uint8Array(response));
	    }
	  }, {
	    key: 'hasProtection',
	    value: function hasProtection() {
	      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	          certificateUrl = _ref3.certificateUrl,
	          keySystem = _ref3.keySystem,
	          licenseUrl = _ref3.licenseUrl;

	      this.log('hasProtection()');

	      return certificateUrl && keySystem && licenseUrl;
	    }
	  }, {
	    key: 'log',
	    value: function log() {
	      var _console;

	      if (!logToBrowserConsole) {
	        return;
	      }

	      (_console = console).log.apply(_console, arguments);
	    }
	  }, {
	    key: 'onCertificateError',
	    value: function onCertificateError() {
	      this.log('onCertificateError()');

	      this.player_.error({
	        code: 0,
	        message: 'Failed to retrieve the server certificate.'
	      });
	    }
	  }, {
	    key: 'onCertificateLoad',
	    value: function onCertificateLoad(event, _ref4) {
	      var callback = _ref4.callback;

	      this.log('onCertificateLoad()');

	      var _event$target = event.target,
	          response = _event$target.response,
	          status = _event$target.status;


	      if (status !== 200) {
	        this.onRequestError(event.target, _errorType2.default.FETCH_CERTIFICATE);

	        return;
	      }

	      certificate = new Uint8Array(response);

	      callback();
	    }
	  }, {
	    key: 'onRequestError',
	    value: function onRequestError(request) {
	      var errorType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _errorType2.default.UNKNOWN;

	      this.log('onRequestError()');

	      var errorMessage = errorType + ' - DRM: com.apple.fps.1_0 update,\n      XHR status is \'' + request.statusText + '(' + request.status + ')\', expected to be 200.\n      readyState is \'' + request.readyState + '\'.\n      Response is ' + this.getErrorResponse(request.response);

	      this.player_.error({
	        code: 0,
	        message: errorMessage
	      });
	    }
	  }, {
	    key: 'onKeySessionWebkitKeyAdded',
	    value: function onKeySessionWebkitKeyAdded() {
	      this.log('onKeySessionWebkitKeyAdded()');

	      this.log('Decryption key was added to the session.');
	    }
	  }, {
	    key: 'onKeySessionWebkitKeyError',
	    value: function onKeySessionWebkitKeyError() {
	      this.log('onKeySessionWebkitKeyError()');

	      this.player_.error({
	        code: 0,
	        message: 'A decryption key error was encountered.'
	      });
	    }
	  }, {
	    key: 'onKeySessionWebkitKeyMessage',
	    value: function onKeySessionWebkitKeyMessage(event) {
	      this.log('onKeySessionWebkitKeyMessage()');

	      var message = event.message;
	      var target = event.target;

	      this.fetchLicense({
	        message: message,
	        target: target
	      });
	    }
	  }, {
	    key: 'onLicenseError',
	    value: function onLicenseError() {
	      this.log('onLicenseError()');

	      this.player_.error({
	        code: 0,
	        message: 'The license request failed.'
	      });
	    }
	  }, {
	    key: 'onLicenseLoad',
	    value: function onLicenseLoad(event) {
	      this.log('onLicenseLoad()');

	      var _event$target2 = event.target,
	          response = _event$target2.response,
	          session = _event$target2.session,
	          status = _event$target2.status;


	      if (status !== 200) {
	        this.onRequestError(event.target, _errorType2.default.FETCH_LICENCE);

	        return;
	      }

	      session.update(new Uint8Array(response));
	    }
	  }, {
	    key: 'onVideoError',
	    value: function onVideoError() {
	      this.log('onVideoError()');

	      this.player_.error({
	        code: 0,
	        message: 'A video playback error occurred.'
	      });
	    }
	  }, {
	    key: 'onVideoWebkitNeedKey',
	    value: function onVideoWebkitNeedKey(event) {
	      this.log('onVideoWebkitNeedKey()');

	      var keySystem = this.protection_.keySystem;


	      var contentId = (0, _util.getHostnameFromURI)((0, _util.arrayToString)(event.initData));

	      var initData = (0, _fairplay2.default)(event.initData, contentId, certificate);

	      var keySession = this.createKeySession(keySystem, initData);

	      keySession.contentId = contentId;

	      keySession.addEventListener('webkitkeyadded', this.onKeySessionWebkitKeyAdded, false);
	      keySession.addEventListener('webkitkeyerror', this.onKeySessionWebkitKeyError, false);
	      keySession.addEventListener('webkitkeymessage', this.onKeySessionWebkitKeyMessage, false);
	    }
	  }, {
	    key: 'src',
	    value: function src(_ref5) {
	      var _this2 = this;

	      var _src = _ref5.src;

	      if (!this.hasProtection(this.protection_)) {
	        this.tech_.src(_src);

	        return;
	      }

	      // NOTE: videojs should handle video errors already
	      // this.el_.addEventListener('error', this.onVideoError, false);

	      // NOTE: videojs must be reset every time a source is changed (to remove existing media keys).
	      // WIP: this means that `webkitneedkey` must also be reattached for the license to trigger?
	      this.el_.addEventListener('webkitneedkey', this.onVideoWebkitNeedKey, false);

	      if (certificate) {
	        this.tech_.src(_src);

	        return;
	      }

	      this.fetchCertificate({
	        callback: function callback() {
	          _this2.tech_.src(_src);
	        }
	      });
	    }
	  }]);
	  return Html5Fairplay;
	}();

	videojs.fairplaySourceHandler = function fairplaySourceHandler() {
	  return {
	    canHandleSource: function canHandleSource(source) {
	      if (!window.WebKitMediaKeys) {
	        return '';
	      }

	      var keySystem = source && source.protection && source.protection.keySystem;

	      var isTypeSupported = WebKitMediaKeys.isTypeSupported(keySystem, 'video/mp4');

	      if (isTypeSupported) {
	        return 'probably';
	      }

	      return '';
	    },
	    handleSource: function handleSource(source, tech, options) {
	      return new Html5Fairplay(source, tech, options);
	    },
	    canPlayType: function canPlayType(type) {
	      return videojs.fairplaySourceHandler.canPlayType(type);
	    }
	  };
	};

	videojs.fairplaySourceHandler.canPlayType = function canPlayType(type) {
	  var fairplayTypeRE = /application\/x-mpegURL/i;

	  if (fairplayTypeRE.test(type)) {
	    return 'maybe';
	  }

	  return '';
	};

	if (window.MediaSource) {
	  videojs.getTech('Html5').registerSourceHandler(videojs.fairplaySourceHandler(), 0);
	}

	videojs.Html5Fairplay = Html5Fairplay;

	exports.default = Html5Fairplay;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(3);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	var $Object = __webpack_require__(8).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(16), 'Object', { defineProperty: __webpack_require__(12).f });


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var core = __webpack_require__(8);
	var ctx = __webpack_require__(9);
	var hide = __webpack_require__(11);
	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.3' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(12);
	var createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(16) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(13);
	var IE8_DOM_DEFINE = __webpack_require__(15);
	var toPrimitive = __webpack_require__(19);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function () {
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	var document = __webpack_require__(7).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.arrayToString = arrayToString;
	exports.base64DecodeUint8Array = base64DecodeUint8Array;
	exports.base64EncodeUint8Array = base64EncodeUint8Array;
	exports.getHostnameFromURI = getHostnameFromURI;
	exports.stringToArray = stringToArray;
	function arrayToString(array) {
	  return String.fromCharCode.apply(null, new Uint16Array(array.buffer));
	}

	function base64DecodeUint8Array(input) {
	  var raw = atob(input);

	  var rawLength = raw.length;

	  var array = new Uint8Array(new ArrayBuffer(rawLength));

	  for (var i = 0; i < rawLength; i++) {
	    array[i] = raw.charCodeAt(i);
	  }

	  return array;
	}

	function base64EncodeUint8Array(input) {
	  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	  var chr1 = void 0;
	  var chr2 = void 0;
	  var chr3 = void 0;
	  var enc1 = void 0;
	  var enc2 = void 0;
	  var enc3 = void 0;
	  var enc4 = void 0;
	  var i = 0;
	  var output = '';

	  while (i < input.length) {
	    chr1 = input[i++];
	    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
	    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

	    enc1 = chr1 >> 2;
	    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
	    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
	    enc4 = chr3 & 63;

	    if (isNaN(chr2)) {
	      enc3 = enc4 = 64;
	    } else if (isNaN(chr3)) {
	      enc4 = 64;
	    }

	    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
	  }

	  return output;
	}

	function getHostnameFromURI(uri) {
	  var link = document.createElement('a');

	  link.href = uri;

	  return link.hostname;
	}

	function stringToArray(string) {
	  var length = string.length;

	  // 2 bytes for each char
	  var buffer = new ArrayBuffer(length * 2);

	  var array = new Uint16Array(buffer);

	  for (var i = 0; i < length; i++) {
	    array[i] = string.charCodeAt(i);
	  }

	  return array;
	}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = concatInitDataIdAndCertificate;

	var _util = __webpack_require__(21);

	function concatInitDataIdAndCertificate(initData, id, certificate) {
	  if (typeof id === 'string') {
	    id = (0, _util.stringToArray)(id);
	  }

	  // Format:
	  // [initData]
	  // [4 byte: idLength]
	  // [idLength byte: id]
	  // [4 byte:certificateLength]
	  // [certificateLength byte: certificate]

	  var size = initData.byteLength + 4 + id.byteLength + 4 + certificate.byteLength;
	  var offset = 0;

	  var buffer = new ArrayBuffer(size);

	  var dataView = new DataView(buffer);

	  var initDataArray = new Uint8Array(buffer, offset, initData.byteLength);
	  initDataArray.set(initData);
	  offset += initDataArray.byteLength;

	  dataView.setUint32(offset, id.byteLength, true);
	  offset += 4;

	  var idArray = new Uint16Array(buffer, offset, id.length);
	  idArray.set(id);
	  offset += idArray.byteLength;

	  dataView.setUint32(offset, certificate.byteLength, true);
	  offset += 4;

	  var certificateArray = new Uint8Array(buffer, offset, certificate.byteLength);
	  certificateArray.set(certificate);

	  return new Uint8Array(buffer, 0, buffer.byteLength);
	}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  FETCH_CERTIFICATE: 'FETCH CERTIFICATE',
	  FETCH_LICENCE: 'FETCH LICENCE',
	  UNKNOWN: 'UNKNOWN'
	};

/***/ })
/******/ ])
});
;