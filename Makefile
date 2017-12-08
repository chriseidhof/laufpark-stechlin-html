default: map.js

%.js: %.ts
	tsc $<
