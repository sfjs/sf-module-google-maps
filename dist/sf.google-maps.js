/*!
 * Google Maps wrapper for Spiral and sf.js v0.1.0
 * https://github.com/spiral-modules/google-maps/
 * Copyright (c) 2016, Alex Chepura, spiralscout.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("sf"));
	else if(typeof define === 'function' && define.amd)
		define(["sf"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("sf")) : factory(root["sf"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	var _sfGmaps = __webpack_require__(2);
	
	var _sfGmaps2 = _interopRequireDefault(_sfGmaps);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//todo not use webpack's style loader here. just compile, minify and add to the page by our script
	__webpack_require__(3); //resolved by webpack's "externals"
	
	_sf2.default.registerInstanceType(_sfGmaps2.default, "js-sf-google-maps");
	module.exports = _sfGmaps2.default; // ES6 default export will not expose us as global

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//resolved by webpack's "externals"
	
	var GMaps = function GMaps(sf, node, options) {
	    this._construct(sf, node, options);
	};
	GMaps.prototype = _sf2.default.createModulePrototype();
	GMaps.prototype.name = "gmaps";
	GMaps.prototype._construct = function (sf, node, options) {
	    this.init(sf, node, options); //call parent
	    var that = this;
	    this.addMultipleMapsBinded = this.addMultipleMaps.bind(this);
	    if (!this._key) {
	        //todo check if script was already connected
	        //if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {}
	        //todo make prototype events to allow multiple instances
	        GMaps.prototype._key = this.options.key;
	        this.importScript("https://maps.googleapis.com/maps/api/js?key=" + this.options.key + (this.options.search ? "&libraries=places" : ""), function () {
	            that.initMaps();
	        });
	    } else {
	        this.addMultipleMapsBinded();
	    }
	    if (!this.form && (this.options.nameLat || this.options.nameLng)) {
	        this.form = this.sf.helpers.domTools.closest(this.node, 'form');
	    }
	    if (this.options.marker || this.options.markerLat || this.options.markerLng) {
	        this.options.marker = true;
	    }
	};
	
	GMaps.prototype._key = "";
	
	GMaps.prototype.addMultipleMaps = function () {
	    if (typeof google !== 'undefined') {
	        this.initMaps();
	    } else {
	        setTimeout(this.addMultipleMapsBinded, 1000);
	    }
	};
	
	var processorFloat = function processorFloat(node, val, self) {
	    if (!val) return self.value;
	    if (typeof val === "string") val = parseFloat(val);
	    return val;
	};
	
	/**
	 * @override
	 * @inheritDoc
	 * @enum {string|boolean}
	 */
	GMaps.prototype.optionsToGrab = {
	    nameLat: {
	        domAttr: "data-name-lat"
	    },
	    nameLng: {
	        domAttr: "data-name-lng"
	    },
	    key: {
	        domAttr: "data-key"
	    },
	    zoom: {
	        value: 13,
	        domAttr: "data-zoom",
	        processor: processorFloat
	    },
	    lat: {
	        value: 0,
	        domAttr: "data-lat",
	        processor: processorFloat
	    },
	    lng: {
	        value: 0,
	        domAttr: "data-lng",
	        processor: processorFloat
	    },
	    marker: {
	        domAttr: "data-marker"
	    },
	    editable: {
	        domAttr: "data-editable",
	        processor: function processor(node, val) {
	            return val === "true" || val === true;
	        }
	    },
	    markerLat: {
	        value: false,
	        domAttr: "data-marker-lat",
	        processor: processorFloat
	    },
	    markerLng: {
	        value: false,
	        domAttr: "data-marker-lng",
	        processor: processorFloat
	    },
	    form: {
	        domAttr: "data-form",
	        processor: function processor(node, val) {
	            this.form = val ? document.querySelectorAll(val)[0] : false;
	        }
	    },
	    search: {
	        domAttr: "data-search",
	        processor: function processor(node, val) {
	            return val = val === "true" || val === true;
	        }
	    }
	};
	
	//todo move it to the sf.js tools?
	GMaps.prototype.importScript = function (sSrc, fOnload) {
	    function loadError(oError) {
	        throw new URIError("The script " + oError.target.src + " is not accessible.");
	    }
	
	    var oScript = document.createElement("script");
	    oScript.type = "text\/javascript";
	    oScript.onerror = loadError;
	    if (fOnload) {
	        oScript.onload = fOnload;
	    }
	    document.head.appendChild(oScript);
	    oScript.src = sSrc;
	};
	
	GMaps.prototype.initMaps = function () {
	    var that = this;
	    this.map = new google.maps.Map(this.node, {
	        zoom: this.options.zoom,
	        center: { lat: this.options.lat, lng: this.options.lng }
	    });
	
	    if (this.options.marker) {
	        this.marker = new google.maps.Marker({
	            map: this.map,
	            draggable: this.options.editable,
	            position: {
	                lat: this.options.markerLat !== false ? this.options.markerLat : this.options.lat,
	                lng: this.options.markerLng !== false ? this.options.markerLng : this.options.lng
	            }
	        });
	        this.options.editable && google.maps.event.addListener(this.marker, 'dragend', this.saveMarkerCoordinates.bind(this));
	        this.saveMarkerCoordinates();
	    }
	
	    if (this.options.search) {
	        this.inputSearch = document.createElement("input");
	        this.inputSearch.type = "text";
	        this.inputSearch.className = "pac-input gm-control";
	        this.inputSearch.addEventListener("keydown", function (e) {
	            if (e.keyCode === 13) {
	                e.preventDefault();
	                return false;
	            }
	        });
	
	        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.inputSearch);
	
	        if (this.marker) {
	            this.btnMarkPlace = document.createElement("div");
	            this.btnMarkPlace.className = "gm-control gm-button";
	            this.btnMarkPlace.textContent = "Mark";
	            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.btnMarkPlace);
	            this.btnMarkPlace.addEventListener("click", function () {
	                var c = that.placeMarker.getVisible() ? that.placeMarker.getPosition() : that.map.getCenter();
	                that.marker.setPosition(c);
	                that.saveMarkerCoordinates();
	            });
	        }
	
	        this.autocomplete = new google.maps.places.Autocomplete(this.inputSearch);
	        this.autocomplete.bindTo('bounds', this.map);
	        this.autocomplete.setTypes([]); //all types: address, establishment, geocode
	        this.infowindow = new google.maps.InfoWindow();
	
	        var placeMarker = new google.maps.Marker({
	            map: this.map,
	            anchorPoint: new google.maps.Point(0, -29),
	            visible: false
	        });
	
	        this.placeMarker = placeMarker;
	
	        this.autocomplete.addListener('place_changed', function () {
	            that.infowindow.close();
	            placeMarker.setVisible(false);
	            var place = that.autocomplete.getPlace();
	            if (!place.geometry) {
	                //window.alert("Autocomplete's returned place contains no geometry");
	                return;
	            }
	
	            // If the place has a geometry, then present it on a map.
	            if (place.geometry.viewport) {
	                that.map.fitBounds(place.geometry.viewport);
	            } else {
	                that.map.setCenter(place.geometry.location);
	                that.map.setZoom(17); // Why 17? Because it looks good.
	                //that.checkMarkerVisibility() && that.markPlace();
	            }
	            placeMarker.setIcon( /** @type {google.maps.Icon} */{
	                url: place.icon,
	                size: new google.maps.Size(71, 71),
	                origin: new google.maps.Point(0, 0),
	                anchor: new google.maps.Point(17, 34),
	                scaledSize: new google.maps.Size(35, 35)
	            });
	            placeMarker.setPosition(place.geometry.location);
	            placeMarker.setVisible(true);
	
	            var address = '';
	            if (place.address_components) {
	                address = [place.address_components[0] && place.address_components[0].short_name || '', place.address_components[1] && place.address_components[1].short_name || '', place.address_components[2] && place.address_components[2].short_name || ''].join(' ');
	            }
	
	            that.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
	            that.infowindow.open(that.map, placeMarker);
	        });
	    }
	
	    if (!this.node.offsetHeight) {
	        this.onHashChangeBinded = this.onHashChange.bind(this);
	        window.addEventListener("hashchange", this.onHashChangeBinded, false);
	    }
	};
	
	GMaps.prototype.onHashChange = function () {
	    if (this.node.offsetHeight) {
	        google.maps.event.trigger(this.map, 'resize');
	        this.map.setCenter({ lat: this.options.lat, lng: this.options.lng });
	        window.removeEventListener("hashchange", this.onHashChangeBinded);
	    }
	};
	
	//GMaps.prototype.checkMarkerVisibility = function () {
	//    return this.map.getBounds().contains(this.marker.getPosition());
	//};
	//
	//GMaps.prototype.showBtnMarker = function () {
	//    this.btnMarkPlace.classList.remove("hide");
	//};
	
	GMaps.prototype.saveMarkerCoordinates = function () {
	    var pos = this.marker.getPosition();
	    this.markerLat = pos.lat();
	    this.markerLng = pos.lng();
	    if (this.form) {
	        if (!this.inputLat) {
	            this.inputLat = document.createElement("input");
	            this.inputLat.type = "hidden";
	            this.inputLat.name = this.options.nameLat;
	            this.form.appendChild(this.inputLat);
	        }
	        if (!this.inputLng) {
	            this.inputLng = document.createElement("input");
	            this.inputLng.type = "hidden";
	            this.inputLng.name = this.options.nameLng;
	            this.form.appendChild(this.inputLng);
	        }
	        this.inputLat.value = this.markerLat;
	        this.inputLng.value = this.markerLng;
	    }
	};
	
	GMaps.prototype.die = function () {};
	
	exports.default = GMaps;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?minimize!./../node_modules/less-loader/index.js!./gmaps.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?minimize!./../node_modules/less-loader/index.js!./gmaps.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, ".js-sf-google-maps{line-height:normal}.gm-control,input.gm-control{font-family:Roboto,Arial;margin:10px 0 0;padding:8px;border:0;border-radius:2px;box-sizing:border-box;-moz-box-sizing:border-box;outline:none;box-shadow:rgba(0,0,0,.3) 0 1px 4px -1px}.gm-control.hide,input.gm-control.hide{display:none}.gm-button{background-color:#fff;cursor:pointer;color:#565656;padding:8px;font-size:11px;margin-left:10px}.gm-button:hover{background-color:#ebebeb}input.pac-input{background-color:#fff;font-size:11px;font-weight:300;text-overflow:ellipsis;width:305px;max-width:calc(100% - 173px);line-height:normal}input.pac-input:focus:not([readonly]){border:0;box-shadow:rgba(0,0,0,.3) 0 1px 4px -1px}", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=sf.google-maps.js.map