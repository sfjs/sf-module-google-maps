"use strict";
import sf from 'sf';//resolved by webpack's "externals"

var GMaps = function (sf, node, options) {
    this._construct(sf, node, options);
};
GMaps.prototype = sf.createModulePrototype();
GMaps.prototype.name = "gmaps";
GMaps.prototype._construct = function (sf, node, options) {
    this.init(sf, node, options);//call parent
    var that = this;
    this.addMultipleMapsBinded = this.addMultipleMaps.bind(this);
    if (!this._key) {
        //todo check if script was already connected
        //if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {}
        //todo make prototype events to allow multiple instances
        GMaps.prototype._key = this.options.key;
        this.importScript("https://maps.googleapis.com/maps/api/js?key=" + this.options.key +
            (this.options.search ? "&libraries=places" : ""), function () {
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
        this.initMaps()
    } else {
        setTimeout(this.addMultipleMapsBinded, 1000);
    }
};

var processorFloat = function (node, val, self) {
    if (!val) return self.value;
    if (typeof val === "string") val = parseFloat(val);
    return val
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
        processor: function (node, val) {
            return val === "true" || val === true
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
        processor: function (node, val) {
            this.form = val ? document.querySelectorAll(val)[0] : false;
        }
    },
    search: {
        domAttr: "data-search",
        processor: function (node, val) {
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
        center: {lat: this.options.lat, lng: this.options.lng}
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
            this.btnMarkPlace.addEventListener("click", function() {
                var c = that.placeMarker.getVisible() ? that.placeMarker.getPosition() : that.map.getCenter();
                that.marker.setPosition(c);
                that.saveMarkerCoordinates();
            });
        }

        this.autocomplete = new google.maps.places.Autocomplete(this.inputSearch);
        this.autocomplete.bindTo('bounds', this.map);
        this.autocomplete.setTypes([]);//all types: address, establishment, geocode
        this.infowindow = new google.maps.InfoWindow();

        var placeMarker = new google.maps.Marker({
            map: this.map,
            anchorPoint: new google.maps.Point(0, -29),
            visible: false
        });

        this.placeMarker = placeMarker;

        this.autocomplete.addListener('place_changed', function() {
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
                that.map.setZoom(17);  // Why 17? Because it looks good.
                //that.checkMarkerVisibility() && that.markPlace();
            }
            placeMarker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            placeMarker.setPosition(place.geometry.location);
            placeMarker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            that.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            that.infowindow.open(that.map, placeMarker);
        });
    }
    this.map.addListener('click', function(e) {
        that.marker.setPosition(e.latLng);
        that.saveMarkerCoordinates();
    });
    if (!this.node.offsetHeight) {
        this.onHashChangeBinded = this.onHashChange.bind(this);
        window.addEventListener("hashchange", this.onHashChangeBinded, false);
    }

};

GMaps.prototype.onHashChange = function () {
    if (this.node.offsetHeight) {
        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter({lat: this.options.lat, lng: this.options.lng});
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

GMaps.prototype.die = function () {

};

export {GMaps as default};