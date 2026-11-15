/* Tabs: show one section at a time instead of one long scrolling page. */
(function($) {
	$(function() {
		var $nav = $('#nav'),
			$links = $nav.find('a[href^="#"]'),
			$sections = $('#main > section.main'),
			ids = $sections.map(function() { return this.id; }).get();

		// Turn off the theme's scroll-to-section behavior.
		$links.off('click');
		if ($.fn.unscrollex) $sections.unscrollex();

		function show(id, scroll) {
			if (ids.indexOf(id) === -1) id = ids[0];
			$sections.hide().filter('#' + id).show();
			$links.removeClass('active active-locked')
				.filter('[href="#' + id + '"]').addClass('active');
			// Every tab opens at the very top of the page.
			if (scroll) window.scrollTo(0, 0);
		}

		// A link to something inside a tab (e.g. a case study): open that tab, then scroll to it.
		function showInner(id, smooth) {
			var el = document.getElementById(id);
			if (!el) return false;
			var $sec = $(el).closest('#main > section.main');
			if (!$sec.length) return false;
			show($sec.attr('id'), false);
			el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
			return true;
		}

		// Any link to a section (tabs, "See My Work", etc.) switches tabs.
		$(document).on('click', 'a[href^="#"]', function(e) {
			var id = this.getAttribute('href').slice(1);
			if (!id) return;
			if (ids.indexOf(id) !== -1) {
				e.preventDefault();
				if (history.replaceState) history.replaceState(null, '', '#' + id);
				show(id, true);
			} else if (document.getElementById(id)) {
				e.preventDefault();
				if (history.replaceState) history.replaceState(null, '', '#' + id);
				showInner(id, true);
			}
		});

		$(window).on('hashchange', function() {
			var id = location.hash.slice(1);
			if (ids.indexOf(id) === -1 && showInner(id, true)) return;
			show(id, true);
		});

		var startId = location.hash.slice(1),
			startInner = ids.indexOf(startId) === -1 && document.getElementById(startId);
		show(startInner ? $(startInner).closest('#main > section.main').attr('id') : startId, false);

		// Opening a shared link (e.g. #experience) shouldn't jump down the page,
		// but a link straight to a case study should land on it.
		if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
		$(window).on('load', function() {
			setTimeout(function() {
				if (startInner) startInner.scrollIntoView({ block: 'start' });
				else window.scrollTo(0, 0);
			}, 0);
		});
		if (!startInner) window.scrollTo(0, 0);
	});
})(jQuery);
