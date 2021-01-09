import { Command } from "@oclif/command";
import * as shell from "shelljs";
import * as chalk from "chalk";

export default class New extends Command {
  static description = "generates boilerplate project in specified directory";

  static examples = ["yokita new myApp"];

  static args = [{ name: "name" }];

  async run() {
    const { args } = this.parse(New);
    shell.exec(
      "git clone https://github.com/norberto-e-888/backend-boilerplate.git " +
        args.name
    );

    shell.cd(args.name);
    shell.exec("npm i");
  }
}
