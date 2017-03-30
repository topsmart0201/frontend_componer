import path from 'path'
import {log} from '../libs/process'
import {exists, readJSONTMPL, getFileExt} from '../libs/file'
import webpack from '../drivers/webpack'
import sass from '../drivers/sass'

export default function(commander) {
    commander
    .command('build')
	.description('link local componout as package')
	.action(() => {
        let cwd = process.cwd()
        let jsonfile = path.join(cwd, 'componer.json')

        if(!exists(jsonfile)) {
            log('There is no componer.json in current directory.', 'error')
            return
        }

        let info = readJSONTMPL(jsonfile, {
            'path': cwd,
        })
        let items = info.build

        if(!items) {
            log('Build option is not found in componer.json.', 'error')
            return
        }

        items.forEach(item => {
            let from = path.join(cwd, item.from)
            let to = path.join(cwd, item.to)
            let ext = getFileExt(item.from)
            if(ext === '.js') {
                webpack(from, to, item.options, item.settings)
            }
            else if(ext === '.scss') {
                sass(from, to, item.options, item.settings)
            }
        })

        log('Build complete!', 'done')
    })
}