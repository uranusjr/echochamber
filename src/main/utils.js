import fs from 'fs'


export function promisify(towrap, opts) {
	const multiArgs = !!(opts && opts.multiArgs)

	return function wrapped(...inargs) {
		return new Promise((resolve, reject) => {
			towrap(...inargs, (err, ...cbargs) => {
				if (err) {
					reject(err)
				} else if (multiArgs) {
					resolve(cbargs)
				} else {
					resolve(cbargs[0])
				}
			})
		})
	}
}


/** Backport(?) fs.copyFile from Node 8.5.
 *
 * Electron is still on 8.3 so we need to make do.
 */
export function copyFile(source, target, callback) {
	let done = false

	function completionHandler(...args) {
		if (!done) {
			done = true
			callback(...args)
		}
	}

	const sourceStream = fs.createReadStream(source)
	sourceStream.on('error', completionHandler)

	const targetStream = fs.createWriteStream(target)
	targetStream.on('error', completionHandler)
	targetStream.on('close', completionHandler)

	sourceStream.pipe(targetStream)
}
