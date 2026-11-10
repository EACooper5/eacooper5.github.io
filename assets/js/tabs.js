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
			if (scroll) {
				var top = $nav.offset().top;
				if ($(window).scrollTop() > top) $('html, body').scrollTop(top);
			}
		}

		// Any link to a section (tabs, "Get in Touch", etc.) switches tabs.
		$(document).on('click', 'a[href^="#"]', function(e) {
			var id = this.getAttribute('href').slice(1);
			if (ids.indexOf(id) === -1) return;
			e.preventDefault();
			if (history.replaceState) history.replaceState(null, '', '#' + id);
			show(id, true);
		});

		$(window).on('hashchange', function() { show(location.hash.slice(1), true); });

		show(location.hash.slice(1), false);
	});
})(jQuery);
