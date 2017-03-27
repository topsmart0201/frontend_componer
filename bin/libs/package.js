import {exists, readJSON, scandir} from './file'
import {root} from './componer'
import {execute} from './process'

export function getLocalPackages() {
    var packages = []
	var cwd = root()

    if(exists(cwd + '/bower_components')) scandir(cwd + '/bower_components').forEach(item => {
        if(item.substr(0, 1) === '.') return
        let info = readJSON(cwd + '/bower_components/' + item + '/bower.json')
        packages.push({
            name: item,
            version: info.version,
            type: 'bower',
        })
    })
    scandir(cwd + '/node_modules').forEach(item => {
        if(item.substr(0, 1) === '.') return
        let info = readJSON(cwd + '/node_modules/' + item + '/package.json')
        packages.push({
            name: item,
            version: info.version,
            type: 'npm',
        })
    })
    return packages
}

export function getLocalPackagesByType(type) {
    var pkgs = getLocalPackages()
    pkgs = pkgs.filter(pkg => pkg.type === type)
    var results = {}
    if(pkgs.length > 0) pkgs.forEach(pkg => results[pkg.name] = pkg)
    return results
}

// get version from version string such as `~1.3.0`, `^2.0.1`, >=6.2.1
export function getVersion(ver) {
	var i = ver.search(/\d/)
	if(i > -1 && i < 3) return ver.substr(i)
	return ver
}

// get suitable item from a list
export function getSuitable(list) {
	return list[0]
}

// get packages not repetitive/unique
export function PackagesPicker() {
	var _ = {}
	var packages = {}

	_.add = (obj, driver) => {
		let names = Object.keys(obj)
		names.forEach(name => {
			if(!packages[name]) {
				packages[name] = []
			}
			let item = obj[name]
			packages[name].push({
				name: name,
				version: obj[name],
				driver,
			})
		})
		return _
	}
	_.get = (name) => {
		if(name === undefined) {
			return packages
		}
		return packages[name]
	}
	_.use = () => {
		let names = Object.keys(packages)
		let results = []
		names.forEach(name => {
			let items = _.get(name)
			let item = getSuitable(items) // TODO: find out the most suitable version
			results.push(item)
		})
		return results
	}

	return _
}

export function installPackages(pkgs) {
	var localBowerPkgs = getLocalPackagesByType('bower')
	var localNpmPkgs = getLocalPackagesByType('npm')
	var install = (name, version, driver) => {
        if(driver === 'bower') {
            driver = root() + '/node_modules/.bin/bower'
        }
		// version is a url or path
		if(version.indexOf('/') > -1) {
			execute(`cd "${cwd}" && "${driver}" install ${version}`)
			return
		}
		// install by npm and bower when fail
		execute(`cd "${cwd}" && "${driver}" install ${name}@${version}`)
	}

	pkgs.forEach(pkg => {
		let name = pkg.name
		let version = getVersion(pkg.version)
		let driver = pkg.driver

		let localPkgVer = driver === 'bower' ? localBowerPkgs[name] : driver === 'npm' ? localNpmPkgs[name] : null

		// if exists this package in local, do not install it
		if(localPkgVer) {
			// if get it by git or path
			if(version.indexOf('/') > -1) return
			// if local version is bigger then wanted
			if(localPkgVer >= version) return
		}

		install(name, version, driver)
	})
}