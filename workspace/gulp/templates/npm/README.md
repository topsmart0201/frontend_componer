# {{Componout Name}}

## Install

```
$ npm install {{componout-name}} --save
```

## Usage


## Generator

This npm package is generated by [Componer](https://github.com/tangshuang/componer).
If you want to modify the source code, do like this:

```
npm i -g componer
mkdir componer-project
cd componer-project
componer init
npm install

componer pull {{componout-name}} -u https://github.com/{{author}}/{{componout-name}}.git
componer install {{componout-name}}
```

After you modified source code in src directory, run:

```
componer build {{componout-name}}
```

To learn more about componer, read [this](https://github.com/tangshuang/componer).