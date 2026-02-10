(function(d, w) {
	function fwCurrentScript(e) {
		if (!e) {
			var scripts = d.getElementsByTagName('script');
			for (var i = scripts.length - 1; i >= 0; i--) {
				if (scripts[i].getAttribute("data-fw-param")) return scripts[i];
			}
		} else if (e.nodeName.toLowerCase() == 'script' && e.getAttribute("data-fw-param")) {
			return e;
		} else {
			return fwCurrentScript(e.lastChild);
		}
	}

	var fwScript = d.currentScript || fwCurrentScript(d);
	var fwparam = fwScript.getAttribute("data-fw-param");
	var preloader_text = fwScript.getAttribute("preloader-text");
	preloader_text = preloader_text ? 'preloader-text=\"' + preloader_text + "\"" : "";

	var loading_spinner = fwScript.getAttribute("loading_spinner");
	loading_spinner = loading_spinner ? 'loading_spinner=\"' + loading_spinner + "\"" : "";

	var _uid = 'fw-iframe' + (fwparam? fwparam.replace("/", '') : Math.floor(Math.random() * 9999999999));

	var use_shadow = fwScript.getAttribute("data-fw-shadowdom") === "true";
	if (use_shadow) {
		fwparam = fwparam.replace(/\/$/, '');
		fwScript.id = _uid;

		var container = document.createElement('div');
		container.className = 'fw-block';
		container.style.position = 'relative';
		container.style.width = '50%';
		var widget = d.createElement('feedwind-widget');
		widget.id = _uid;
		widget.setAttribute('feed-id', fwparam);
		if (preloader_text)    widget.setAttribute('preloader-text', preloader_text);
		if (loading_spinner)   widget.setAttribute('loading-spinner', loading_spinner);
		widget.style.display    = 'block';
		widget.style.width      = '50%';
		widget.style.minWidth   = '150px';
		widget.style.minHeight  = '150px';
		container.appendChild(widget);

		function insertContainer() {
			var root = fwScript.getRootNode();
			if (root instanceof ShadowRoot) {
				root.appendChild(container);
			} else {
				fwScript.parentNode.insertBefore(container, fwScript.nextSibling);
			}
		}
		if (d.readyState === 'loading') {
			d.addEventListener('DOMContentLoaded', insertContainer, { once: true });
		} else {
			insertContainer();
		}

		var shadowScript = d.createElement('script');
		shadowScript.src   = 'https://feed.mikle.com/js/fw-shadow.js';
		shadowScript.async = true;
		d.head.appendChild(shadowScript);
	} else {

	d.write(
		'\x3cdiv class=\'fw-block\' style=" display:inline-block;position:relative;width:50%;">'
		+ '\x3ciframe id="' + _uid + '" name="' + _uid + '" title="fw-iframe" style="position:relative;min-width:150px;min-height:150px;width:100%" class="fw-iframe" scrolling="no" frameborder="0" data-fw-params="' + fwparam + '"' + preloader_text + loading_spinner +'>\x3c/iframe>'
		+ '\x3cdiv id=\'preview-back\' style="position:absolute;top:0px;left:0px;"> \x3cimg tabindex=\'0\' role=\'button\' id=\'preview-back-image\' alt=\'back button icon\' class=\'fw-preview-button\' onKeyDown="javascript: if(event.keyCode == 8) onClickBack(this, \'' + _uid + '\', \'' + fwparam + '\')" onclick="onClickBack(this, \'' + _uid + '\', \'' + fwparam + '\')"/> \x3c/div>'
		+ '\x3cstyle> .fw-preview-button{cursor: pointer;height: 64px;opacity: 0;display: none;transition: display 1s linear, opacity 1s linear;} .fw-preview-button.active{opacity: 0.2;display: block;transition-delay: 1s;}.fw-preview-button:hover {opacity: 0.4;} \x3c/style>'
		+ '\x3cscript> function onClickBack(self,iframeid,id){var iframe=this.document.getElementById(iframeid);if(iframe){iframe.src=(\'https:\'==location.protocol?\'https:\':\'http:\')+\'//feed.mikle.com/widget/v2/\'+id+\'?id=\'+iframeid;} self.setAttribute("class","fw-preview-button");}\x3c/script>'
		+ '\x3c/div>'
	);

	addScript();
	function addScript() {
		try {
			if (!d.getElementById(_uid) || !d.getElementById(_uid).contentWindow) {
				setTimeout(function() {addScript();}, 300);
				return;
			}

			var f = d.getElementById(_uid).contentWindow.document;
			f.open();
			f.write('<body onload="'
				+ 'window.fwIframeId=\'' + _uid + '\';'
				+ 'document.body.appendChild(document.createElement(\'script\')).src =\'https://feed.mikle.com/js/fw-widget.js?v=1.2\';'
				+ '">');
			f.close();
		} catch(e) {
			console.log(e);
		}
	}

	if (typeof _fwMsg != "function") {
		_fwMsg = function(e) {
			if (e.origin.match(/^https?:\/\/.*?feed\.mikle\.com$/i)) {
				var iframes = this.document.getElementsByClassName('fw-iframe');
				var backs = this.document.getElementsByClassName('fw-preview-button');
				for (var i = 0; i < iframes.length; i++) {
					if (iframes[i].dataset.src) {
						var src_url = iframes[i].dataset.src;
						if (src_url && typeof e.data.uri !== "undefined" && unescape(e.data.uri.replace(/^https?:/i, '')) == unescape(src_url.replace(/^https?:/i, ''))) {
							iframes[i].style.width = e.data.width;
							iframes[i].style.height = e.data.height;
							if (iframes[i].parentElement.className == "fw-block") {
								iframes[i].parentElement.style.height = e.data.height;
							}
						}
					}

					if (e.data.action && e.data.action == 'C_OPEN_INIF') {
						if (e.data.iframeId && e.data.iframeId !== iframes[i].getAttribute('id')) {
							continue;
						}
						iframes[i].setAttribute("scrolling", "yes");
						iframes[i].src = e.data.linkUri;
						backs[i].src = "https://feed.mikle.com/images/back-icon.png";
						backs[i].setAttribute("class", "fw-preview-button active");
					}
				}
			}
		};

		if (w.addEventListener) {
			w.addEventListener("message", _fwMsg, false);
		} else if (w.attachEvent) {
			w.attachEvent("onmessage", _fwMsg, false);
		} else {
			w.onmessage = _fwMsg;
		}
	}

	}
}(document, window));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aparecer');
        }
    });
});

document.querySelectorAll('.oculto').forEach((el) => observer.observe(el));