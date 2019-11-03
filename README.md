# Electron OOPIF Webview Mouse Event Issues

Saved from an Electron Fiddle, but needed to add a couple extra files.

```shell script
$ npm install
$ npm start
```  

Page contains a webview with a draggable Mapbox map that exhibits the problem
and a checkbox to enable messaging events that resolve the issue.

Behavior is not exactly the same as with an in-process iframe in that mousemove is not captured by the 
webview when mousing outside the browser window, but it's a start.

---

Tested with:
- Ubuntu 18.04.2, Windows 10
- Electron 7.0.0
