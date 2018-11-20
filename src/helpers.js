export const isBetween = (value, min, max) => value >= min && value <= max

export async function findAsync(array, callback) {
	for (let index = 0; index < array.length; index++) {
		const finded = await callback(array[index], index, array)
		if (finded)
			return finded
	}
}

export const getMeasureFromRef = ref =>
	new Promise((resolve) => {
		ref.current.measure((fx, fy, width, height, pageX, pageY) =>
			resolve({ fx, fy, width, height, pageX, pageY, }))
	})

export const isFunction = tested => typeof tested === 'function'

export const throttle = (fn, wait) => {
	let inThrottle, lastFn, lastTime

	return (...args) => {
		if (!inThrottle) {
			fn.apply(this, args)
			lastTime = Date.now()
			inThrottle = true
		}
		else {
			window.clearTimeout(lastFn)
			lastFn = window.setTimeout(function () {
				if (Date.now() - lastTime >= wait) {
					fn.apply(this, args)
					lastTime = Date.now()
				}
			}, Math.max(wait - (Date.now() - lastTime), 0))
		}
	}
}