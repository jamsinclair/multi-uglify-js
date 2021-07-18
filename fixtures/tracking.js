function trackPageView(url, data) {
	window.navigator.sendBeacon(url, JSON.stringify(data));
}
