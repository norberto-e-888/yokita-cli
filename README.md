# yokita-cli

Builds express.js boilerplate and generates schematics for it

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/yokita-cli.svg)](https://npmjs.org/package/yokita-cli)

<!-- toc -->

- [yokita-cli](#yokita-cli)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @yokita/cli
$ yokita COMMAND
running command...
$ yokita (-v|--version|version)
@yokita/cli/1.0.1 win32-x64 node-v14.15.0
$ yokita --help [COMMAND]
USAGE
  $ yokita COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`yokita hello [FILE]`](#yokita-hello-file)
- [`yokita help [COMMAND]`](#yokita-help-command)
- [`yokita new [NAME]`](#yokita-new-name)

## `yokita hello [FILE]`

describe the command here

```
USAGE
  $ yokita hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ yokita hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/norberto-e-888/yokita-cli/blob/v1.0.1/src/commands/hello.ts)_

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

_See code: [src/commands/new.ts](https://github.com/norberto-e-888/yokita-cli/blob/v1.0.1/src/commands/new.ts)_

<!-- commandsstop -->
