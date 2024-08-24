import { createMachine } from 'xstate';

export const cardAnimationMachine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnCBBAdgSwFtUAXPAexwFlVkALPHMAOgYDc9Y8AjAGzAGIADjxqQA2gAYAuolCCynUhVkgAHogBMAZgAcTAGwBGAOwmALPo2GdOgKwmANCACeiW1oCcTQ4Y-GPGgEmGvoAvqFOaJi4hCTkVDT0jEzsnLwCEGAktJIySCDyivEq6gi6EkzuhtoSEnYB+rZOrgiNXjr6fjq+Oh6GWgPhkRjY+ERKCXQMzKncfEIiyOLSKoV4EyWI5ZVa1Vq19SFNLohm1kxanToSurZmu3a2QyBRo7ET1FPJs+n8sMQYYhYYgA5AAa1yqwU62K+VK2yqNTqtgaxxal2MTA6HmuNw0EjMthRxmerxi43inySMw4c2YqEEgiy6AYUH4qDGcQoAFEcBBIfk1hs4YhjIEsQT9DoLMZbHZDGZmm4NGYmDd9GZkSE7B1SSNyVzJtSUrT0kwSKCwaz2ZyJrz+StBdDhaBSmL2pLpfpZfLFScyjoNEwPIjqiZjDcPGY9dFbZTEtMTWk+OaQTQrTg2f9AcDLQK5M7Ya63HdvBI7sZTIZ9BIjGjNHLKrVanL9ForJ4Y28KRQqYmfimIBwGUyMNaOe94vb8wVC8oRQhtHojKZjBYrDZ7MYlQhuk3m1YzoF+mFnjgyJl4PkyXHewnGFCivPiwgALT6HfvrsGj735hsU0+EfGFnzUU4NB3WxaiYfFdgVbVTBCb9byNftALAYCXTAsp2x2PYDhRI4d2qVVmxbb17DuCRDGQyc7y+Glk3pRlmVZTCi2w9wKmo-YFVMSwbkMSDqLVS4zDMYwa3xCxaJ7VDvnQlgICAp0nxwTZdwCbxbDbLQzHxKwpSE-0txgjp1w8TpDC3WTDT7BSmNTS02NUkD1IXdxVWJNsrKMTo-XRFFgyqPTel0e4ngiF59RQ+zGLpJgh1gEdWMzdjQNKWwNFsJhZWMXENEkzwsp3HysSuKxa3ufESXCUIgA */
	id: "cardAnimationMachine",
	initial: "invisible",
	states: {
		invisible: {
			on: {
				placed: "visible.appearing",
			},
			entry: "onInvisible",
		},
		visible: {
			initial: "appearing",
			entry: "onVisible",
			on: {
				death: "visible.disappearing",
				placed: "visible.appearing",
				startAttack: {
					target: "visible.attacking",
					reenter: true,
				},
			},
			states: {
				appearing: {
					on: {
						animationEnd: "idle",
					},
					entry: "onAppear",
				},
				idle: {
					on: {
					},
					entry: "onIdle",
				},
				attacking: {
					on: {
						animationEnd: "idle",
					},
					entry: "onAttack",
				},
				disappearing: {
					on: {
						animationEnd: "#cardAnimationMachine.invisible",
					},
					entry: "onDisappear",
				},
			},
		},
	},
});