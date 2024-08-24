import { createMachine } from 'xstate';

export const asAnimationMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QENYEEB2BLAtsgLlgPYYB0WGAblrFgEYA2YAxKgApG2GUDaADAF1EoAA6cshEsJAAPRAFoAzABYATKUUB2TQE5FqgGx8+ARgAchgKwAaEAE9Eq5WdKG+O3c5Oqzly5oBfANtUTFwCYjJqWkYwUmQRETBkACcKKFZsPEkMAFEMCH4hJBAxLkjpOQR9UjNTC1VGky1tRVsHBEtG0i7NAxVVbwNLZSCQ9CyIklJo+iZ4xOS0jAzUADkwKAjKAHkUtaIUvAYi6TKJCpKqmrrzRqaWzTb7RBVlWqMdHUNFE0sDEx-MYgUKTHIzGhzOIJJKpdLMCDJfAAC1OJXOOUqr3UtwaD20T3arx0lg0nzMWm8mj4mhGwNB4XBs1i5AgTFYsA2W24ewOR2QJ0EZ3EmKu2PUJgBg3+BjUrSJnUlpEB7l0qks+jqZnpE0ZkQhMXmWDZLERBFRQvRIsuoGu3Ul3j+BllqnlL06ztIANVfEUb1dqh1YWy+uZ8wgNBhS3hyDBkXyhUtomtUjFCCUag02j0bnqVgVyk0ypM7i6-k0ZjqFaDcemYbiEdgUbhKw5HHKvCTpRTGCx1S+yqaJPMljMOhMCsa7xVOmdal8b21wIwRER8BKDJDqeT5W3sgUo4MpC+lklPhMTwsZgV8mUfA0Y99zrHlf8Nb10wo9eFu97afkGouCeZ5mBeihXpO7gaMoag6MoBh1IofC9O+W5RJCsQ-hce5VPIjRHoWcEeCYOhjoW3gKmOXolqRF66KRaqoVM6GGtCiwtlAWGiraCgXi4hHKMRpFwZoFHuo0pJuLOvikZYxiKExTIYUaJpcTa+4IKo4FelKlIwfhOgKl0iikHwrr9GoQx0sEIK6mhBpQqQjbNssnFWr+faAaZqh8P0yFmKJPwKlo7xmOSoEAiYzg6EEQRAA */
  id: "asAnimation",
	initial: "invisible",
	states: {
		invisible: {
			on: {
				asPositiv: {
					target: "visible.appearing",
				},
			},
			entry: "onInvisible",
		},
		visible: {
			initial: "appearing",
			entry: "onVisible",
			states: {
				appearing: {
					on: {
						animationEnd: "idle",
						asNegativOrNormal: "disappearing",
						death: "disappearing",
					},
					entry: "onAppear",
				},
				idle: {
					on: {
						asNegativOrNormal: "disappearing",
						death: "disappearing",
					}
				},
				disappearing: {
					on: {
						animationEnd: "#asAnimation.invisible",
						asPositiv: "appearing",
					},
					entry: "onDisappear",
				},
			},
		},
	},
});