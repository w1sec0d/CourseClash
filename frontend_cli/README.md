frontend-cli
=================

Cliente CLI para el sistema CourseClash


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/frontend-cli.svg)](https://npmjs.org/package/frontend-cli)
[![Downloads/week](https://img.shields.io/npm/dw/frontend-cli.svg)](https://npmjs.org/package/frontend-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g frontend-cli
$ frontend-cli COMMAND
running command...
$ frontend-cli (--version)
frontend-cli/0.0.0 linux-x64 node-v20.19.2
$ frontend-cli --help [COMMAND]
USAGE
  $ frontend-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`frontend-cli hello PERSON`](#frontend-cli-hello-person)
* [`frontend-cli hello world`](#frontend-cli-hello-world)
* [`frontend-cli help [COMMAND]`](#frontend-cli-help-command)
* [`frontend-cli plugins`](#frontend-cli-plugins)
* [`frontend-cli plugins add PLUGIN`](#frontend-cli-plugins-add-plugin)
* [`frontend-cli plugins:inspect PLUGIN...`](#frontend-cli-pluginsinspect-plugin)
* [`frontend-cli plugins install PLUGIN`](#frontend-cli-plugins-install-plugin)
* [`frontend-cli plugins link PATH`](#frontend-cli-plugins-link-path)
* [`frontend-cli plugins remove [PLUGIN]`](#frontend-cli-plugins-remove-plugin)
* [`frontend-cli plugins reset`](#frontend-cli-plugins-reset)
* [`frontend-cli plugins uninstall [PLUGIN]`](#frontend-cli-plugins-uninstall-plugin)
* [`frontend-cli plugins unlink [PLUGIN]`](#frontend-cli-plugins-unlink-plugin)
* [`frontend-cli plugins update`](#frontend-cli-plugins-update)

## `frontend-cli hello PERSON`

Say hello

```
USAGE
  $ frontend-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ frontend-cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/w1sec0d/CourseClash/blob/v0.0.0/src/commands/hello/index.ts)_

## `frontend-cli hello world`

Say hello world

```
USAGE
  $ frontend-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ frontend-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/w1sec0d/CourseClash/blob/v0.0.0/src/commands/hello/world.ts)_

## `frontend-cli help [COMMAND]`

Display help for frontend-cli.

```
USAGE
  $ frontend-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for frontend-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `frontend-cli plugins`

List installed plugins.

```
USAGE
  $ frontend-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ frontend-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/index.ts)_

## `frontend-cli plugins add PLUGIN`

Installs a plugin into frontend-cli.

```
USAGE
  $ frontend-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into frontend-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the FRONTEND_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the FRONTEND_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ frontend-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ frontend-cli plugins add myplugin

  Install a plugin from a github url.

    $ frontend-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ frontend-cli plugins add someuser/someplugin
```

## `frontend-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ frontend-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ frontend-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/inspect.ts)_

## `frontend-cli plugins install PLUGIN`

Installs a plugin into frontend-cli.

```
USAGE
  $ frontend-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into frontend-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the FRONTEND_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the FRONTEND_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ frontend-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ frontend-cli plugins install myplugin

  Install a plugin from a github url.

    $ frontend-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ frontend-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/install.ts)_

## `frontend-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ frontend-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ frontend-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/link.ts)_

## `frontend-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ frontend-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ frontend-cli plugins unlink
  $ frontend-cli plugins remove

EXAMPLES
  $ frontend-cli plugins remove myplugin
```

## `frontend-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ frontend-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/reset.ts)_

## `frontend-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ frontend-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ frontend-cli plugins unlink
  $ frontend-cli plugins remove

EXAMPLES
  $ frontend-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/uninstall.ts)_

## `frontend-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ frontend-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ frontend-cli plugins unlink
  $ frontend-cli plugins remove

EXAMPLES
  $ frontend-cli plugins unlink myplugin
```

## `frontend-cli plugins update`

Update installed plugins.

```
USAGE
  $ frontend-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.39/src/commands/plugins/update.ts)_
<!-- commandsstop -->
