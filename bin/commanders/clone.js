import {dash} from '../libs/convert'
import {check, fixname, config} from '../libs/componer'
import {log, execute} from '../libs/process'

export default function(commander) {
    commander
    .command("clone [name]")
    .description("clone a componout from github.com/componer")
    .option("-u, --url [url]", "use your own registry url")
    .action((name, options) => {
		name = dash(name)
		name = fixname(name)
        check(name)

        let configs = config()
		let url = options.url
		if(!url && configs.defaults.registries) url = `${configs.defaults.registries}/${name}.git`
		if(!url) url = `https://github.com/componer/${name}.git`

		execute(`cd "${cwd}" && cd componouts && git clone ${url} ${name}`, true, () => log("Fail! You can enter componouts directory and run `git clone`.", 'error'))
        execute(`cd "${cwd}" && componer prepare ${name}`, true)
        log("Done! Componout has been added to componouts directory.", "done")
	})
}