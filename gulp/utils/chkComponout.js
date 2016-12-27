import {logger, exit} from "../loader"
import {dashlineName} from "./index"

export function chkComponout(name) {

	name = dashlineName(name)

	if(!name) {
		logger.error("Error: You should input a name. e.g. `--name=your-component`")
		return false
	}

	if(!name.substr(0,1).match(/[a-z]/)) {
		logger.error("Error: component name's first letter must be in [a-z].")
		return false
	}

	return true

}