import shell from 'shelljs'

export function run(task, args) {
	var cmd = 'gulp ' + task

	if(args) {
		for(let key in args) {
			let value = args[key]
			cmd += ` --${key}`
			if(value !== true && value) {
				cmd += `='${value}'`
			}
		}
	}

	if(process.argv.indexOf('--color') > -1) {
		cmd += ' --color'
	}

	if(process.argv.indexOf('--silent') > -1) {
		cmd += ' --silent'
	}

	shell.exec(cmd)
}
