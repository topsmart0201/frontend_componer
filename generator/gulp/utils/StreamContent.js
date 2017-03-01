/**
 * pipe plugin
 */

import through from "through2"
import {log} from "../loader"

export function StreamContent(factory) {
	return through.obj(function(file, endcoding, callback) {
		if(file.isNull()) {
			this.push(file)
			return callback()
		}

		if(file.isStream()) {
			log("streaming not supported", "error")
			return callback()
		}

		var content = file.contents.toString()

		content = factory(content, file.path) || content

		file.contents = new Buffer(content)
		this.push(file)
		callback()
	})
}