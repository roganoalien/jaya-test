const UTILS = (function() {
	const _$alerts = document.getElementById('alerts-holder');
	let notyf = new Notyf({
		duration: 4000
	});
	const _animateObject = () => {
		let _timeout;
		let $img = document.querySelectorAll('.inside-animate');
		let $load = document.querySelectorAll('.viewport-img');
		let $bg = document.querySelectorAll('.bg-img-inside');
		if (_timeout) {
			clearTimeout(_timeout);
		}
		if ($img.length == 0 && $load.length == 0 && $bg.length == 0) {
			document.removeEventListener('scroll', _animateObject);
			window.removeEventListener('resize', _animateObject);
			window.removeEventListener('orientationchange', _animateObject);
		}
		_timeout = setTimeout(() => {
			$img.forEach(img => {
				if (_isInsideViewport(img)) {
					img.classList.remove('inside-animate');
				}
			});
			$load.forEach(load => {
				if (_isInsideViewport(load)) {
					let delay = load.dataset.delay;
					let _img = new Image();
					_img.onload = () => {
						setTimeout(function() {
							load.src = _img.src;
						}, delay);
					};
					load.classList.remove('viewport-img');
					_img.src = load.dataset.url;
				}
			});
			$bg.forEach(bg => {
				if (_isInsideViewport(bg)) {
					let delay = bg.dataset.delay;
					let _img = new Image();
					_img.onload = () => {
						setTimeout(function() {
							bg.style.background = `url(${_img.src}) no-repeat center`;
						}, delay);
					};
					let parent = bg.parentNode;
					parent.classList.remove('viewport-container');
					bg.classList.remove('bg-img-inside');
					_img.src = bg.dataset.url;
				}
			});
		}, 0);
	};
	const _isInsideViewport = object => {
		// Gets window scroll position
		let scroll = window.scrollY || window.pageYOffset;
		// Gets object.top position and adds it to scroll inside var
		let boundsTop = object.getBoundingClientRect().top + scroll;
		// Easier way to acces data as object
		let viewport = {
			top: scroll,
			bottom: scroll + window.innerHeight
		};
		let bounds = {
			top: boundsTop,
			bottom: boundsTop + object.clientHeight
		};
		// Returns true or false if object is inside viewport
		return (
			(bounds.bottom >= viewport.top &&
				bounds.bottom <= viewport.bottom) ||
			(bounds.top <= viewport.bottom && bounds.top >= viewport.top)
		);
	};

	const _clearLoader = object => {
		setTimeout(function() {
			object.classList.remove('active');
			setTimeout(function() {
				let url = window.location.href;
				if (url.indexOf('#') < 0) {
					document
						.querySelector('body')
						.classList.remove('no-scroll');
				} else {
					setTimeout(function() {
						document
							.querySelector('body')
							.classList.remove('no-scroll');
					}, 1500);
				}
				document
					.getElementById('this-header')
					.classList.add('animate-section');
			}, 500);
		}, 500);
	};

	const _notyf = () => {
		if (_$alerts) {
			if (_$alerts.classList.contains('multiple')) {
				// Cuando existen multiples alertas
				for (let i = 0; i < _$alerts.childNodes.length; i++) {
					setTimeout(function() {
						_makeAlert(_$alerts.childNodes[i].textContent, false);
					}, 250);
				}
			} else {
				// Cuando solo existe una alerta
				let _success = false;
				if (_$alerts.classList.contains('success')) {
					// Si es success
					_success = true;
				}
				_makeAlert(_$alerts.childNodes[0].textContent, _success);
			}
		}
	};

	const _makeAlert = (text, success) => {
		if (!success) {
			notyf.error(text);
		} else {
			notyf.success(text);
		}
	};

	return {
		alert: function() {
			_notyf();
		},
		clear: function(obj) {
			_clearLoader(obj);
		},
		insideAnimate: function() {
			document.addEventListener('scroll', _animateObject);
			window.addEventListener('resize', _animateObject);
			window.addEventListener('orientationchange', _animateObject);
		},
		wysiwyg: function(content) {
			let data = content;
			console.log(data);
			var editor = new EditorJS({
				// autofocus: true,
				holder: 'editorjs',
				tools: {
					header: {
						class: Header,
						inlineToolbar: ['link'],
						config: {
							placeholder: 'Header'
						}
					},
					image: {
						class: SimpleImage,
						inlineToolbar: true,
						config: {
							placeholder: 'Paste image URL'
						}
					},
					code: {
						class: CodeTool,
						inlineToolbar: true
					},
					delimiter: Delimiter,
					inlineCode: {
						class: InlineCode
					},
					embed: Embed
				},
				onReady: function() {
					// saveButton.click();
				},
				onChange: function() {
					editor.save().then(savedData => {
						document.getElementById('quill').value = JSON.stringify(
							savedData
						);
					});
				},
				data
			});
		}
	};
})();
