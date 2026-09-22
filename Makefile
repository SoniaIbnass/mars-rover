.PHONY: test run

test:
	node --test build/mars-rover-simulator/simulation.test.mjs

run:
	node build/mars-rover-simulator/demo.mjs
