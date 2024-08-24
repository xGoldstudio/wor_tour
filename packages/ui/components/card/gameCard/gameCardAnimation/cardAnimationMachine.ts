import { createMachine } from 'xstate';

export const cardAnimationMachine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnCBBAdgSwFtUAXPAexwFlVkALPHMAOgYDc9Y8AjAGzAGIADjxqQA2gAYAuolCCynUhVkgAHogBMAZgAcTAGwBGAOyGAnGcMBWbRquH9AGhABPRFYAsHphYvGrZjr6Wh5mWgC+4c5omLiEJORUNPSMTOycvAIQYCS0kjJIIPKKiSrqCLoSTFZahhr6EoaGOhrmVk6uiPo6ev4S-Wb1A1rGkdEY2PhESkl0DMzp3HxCIsji0irFeDNliJXVtUNNLW0dbggeGt5XFvphEp7+OmMgMZPxM9RzqYuZ-LDEDDELDEQHIADW+U2Cm2pUK5X2NTqDWOrTM7Wc5w0OkMTFCFh0Hmsniu+hebzi00SXxSCw4S2YqEEghy6AYUH4qCmCQoAFEcBAoYUtjt4YgmhpjNV+hIelpgg5rJjEB4tGYmFpNVoNGZjKZsYTyRNKTzZrS0vTMkwSGDwezOdyZvzBRthTDRaBysYdUwdBIPMZ9F4rBJdDrlQhsbj8YEiVYSR4yVFXsbHdTkvMLRk+EwuDRwQAVMgABXdiQdH0SzqFcjLyjFCAlUpD-TlCqMVgjUbxvjMjWMsqCVyNsTTFBpmd+OYgHCZLIw9q5lb5AprRTrOF2kd0BhM5ksNm19jOiBx0v6TX0eqMDzMkWTODI2XghQpY7N82hJXrnsQAFoTwQACR3eKlxwzVI2EtPgv1hH81BVDQIxDfQmFlLUrD9f0dGMMIQJNT4ILpbMwFgj0EIqbUDmRRpmjRDFOkbK40JlQwtFbVVVXw98Jx+aDGWZVl2TIuFfwQPtUMJMMrw0K49R0CMiVQrV2NqYxCRMDxuOXD8+JIlgIBgt1v03Bs6h0dUdGPGogk8QwvC7YwtGqHQtQ8CQ7gCJztLA3TiIZa1QXzYTjLg0yxJqbwvKcjQJD1b17C7TDz36doh0TO9kzfHTeP8q08whItSxMkT4PKCyNCYaxgh1dF6i0TCkr0FtUu6fRSUy8ZRxyoiswCmdYDnIScCgUrwoomwrCYfx1KDQJXKvQD9H0KbjHxFplu9WTnnvIA */
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
						animationEnd: "backToPosition",
					},
					entry: "onAttack",
				},
				backToPosition: {
					on: {
						animationEnd: "idle",
					},
					entry: "onBackToPosition",
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