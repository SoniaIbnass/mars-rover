.PHONY: test run fix-start fix-end

test:
	node --test build/mars-rover-simulator/simulation.test.mjs

run:
	node build/mars-rover-simulator/demo.mjs

fix-start:
	mkdir -p .claude
	touch .claude/fix-mode

fix-end:
	rm -f .claude/fix-mode
