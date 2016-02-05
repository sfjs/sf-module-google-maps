# Spiral Google Maps wrapper

## Usage Example

At frontend (dark template required), simply add virtual tag to your form:

```html
<dark:use bundle="spiral:google-maps-bundle"/>
...
<form:google-maps key="yourGoogleMapsAPIKey"
                    style="width: 100%; height: 300px;"
                    lat="53.9045398" lng="27.561524400000053"
                    name-lat="location[latitude]" name-lng="location[longitude]"
                    zoom="14" marker="true" editable="true" search="true"/>
```
The code above will be transformed into html and will add required javascript.
Result html:
```html
<div class="js-sf-google-maps"
data-key="yourGoogleMapsAPIKey"
style="width: 100%; height: 300px;"
data-lat="53.9045398" data-lng="27.561524400000053"
data-name-lat="location[latitude]" data-name-lng="location[longitude]"
data-zoom="10" data-marker="true" data-editable="true" data-search="true">...google's code...</div>
```
Browser output:  
![google map](https://cloud.githubusercontent.com/assets/5582266/12549495/b3946bb0-c36e-11e5-98eb-c67b0baee2e9.png)

## Options

* key (required) -- Google Maps API key
* lat (required) -- latitude
* lng (required) -- longitude
* name-lat (required) -- name for latitude data in hidden input (to send in form)
* name-lng (required) -- name for longitude data in hidden input (to send in form)
* zoom (optional, default = 13) -- initial zoom level
* marker (optional, default = false) -- show marker
* editable (optional, default = false) -- allow marker to be dragged
* search (optional, default = false) -- show search input on map

## Note
Please provide container size, because Google maps require some with and height of container.
`style="width: 100%; height: 300px;"`

## Local Development

### Installation

    npm install

### Building

    gulp build
    

## License

Copyright (c) 2016 Alex Chepura and contributors. Released under an [MIT license](https://github.com/spiral-modules/google-maps/blob/master/LICENSE).
