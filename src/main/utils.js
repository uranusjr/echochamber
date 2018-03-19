import crypto from 'crypto'
import fs from 'fs'
import path from 'path'


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
 * Electron is still on 8.2(?) so we need to make do.
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


export function saveTempSync(data, rootDir) {
	const tempDir = path.join(rootDir, '.temp')
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir)
	}
	const filename = crypto.createHash('md5').update(data).digest('hex')
	const target = path.join(tempDir, filename)
	fs.writeFileSync(target, data)

	return target
}
