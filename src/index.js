"use strict";
import sf from 'sf';//resolved by webpack's "externals"
import GMaps from './sf-gmaps';

//todo not use webpack's style loader here. just compile, minify and add to the page by our script
require("style!css?minimize!less!./gmaps.less");

sf.registerInstanceType(GMaps,"js-sf-google-maps");
module.exports = GMaps;   // ES6 default export will not expose us as global