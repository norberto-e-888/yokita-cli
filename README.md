# yokita-cli

Builds express.js boilerplate and generates schematics for it

<!-- toc -->
* [yokita-cli](#yokita-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @yokita/cli
$ yokita COMMAND
running command...
$ yokita (-v|--version|version)
@yokita/cli/1.1.0 win32-x64 node-v14.15.0
$ yokita --help [COMMAND]
USAGE
  $ yokita COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`yokita help [COMMAND]`](#yokita-help-command)
* [`yokita new [NAME]`](#yokita-new-name)

## `yokita help [COMMAND]`

display help for yokita

```
USAGE
  $ yokita help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `yokita new [NAME]`

generates boilerplate project in specified directory

```
USAGE
  $ yokita new [NAME]

EXAMPLE
  yokita new my-app
```

_See code: [src/commands/new.ts](https://github.com/norberto-e-888/yokita-cli/blob/v1.1.0/src/commands/new.ts)_
<!-- commandsstop -->
