import { Command } from "@oclif/command";
import cli from "cli-ux";
import * as shell from "shelljs";
import * as crypto from "crypto";
import chalk = require("chalk"); // ! strange behaviour using default export makes me need this hack

export default class New extends Command {
  static description = "generates boilerplate project in specified directory";

  static examples = ["yokita new myApp"];

  static args = [{ name: "name" }];

  async run() {
    const { args } = this.parse(New);
    const port = await cli.prompt("Port to expose app on", {
      default: "3001",
    });

    const mongoUriDev = await cli.prompt("Development MongoDB URI", {
      required: true,
      type: "hide",
    });

    const mongoUriTesting = await cli.prompt("Testing MongoDB URI", {
      required: true,
      type: "hide",
    });

    const jwtSecretAccessToken =
      (await cli.prompt(
        "String to be used as access token secret (if not provided one will be generated for you)",
        { required: false, type: "hide" }
      )) || crypto.randomBytes(128).toString("base64");

    const jwtSecretRefreshToken =
      (await cli.prompt(
        "String to be used as refresh token secret (if not provided one will be generated for you)",
        { required: false, type: "hide" }
      )) || crypto.randomBytes(128).toString("base64");

    const clientUrlDev = await cli.prompt("Development client app URL", {
      default: "http://localhost:3000",
    });

    const sendGridApiKey = await cli.prompt("Sendgrid API Key", {
      required: true,
      type: "hide",
    });

    const sendgridFromAddress = await cli.prompt("Sendgrid sender address", {
      required: true,
    });

    const twilioSid = await cli.prompt("Twilio SID", {
      required: true,
      type: "hide",
    });

    const twilioAuthToken = await cli.prompt("Twilio auth token", {
      required: true,
      type: "hide",
    });

    const twilioNumber = await cli.prompt("Twilio sender number", {
      required: true,
    });

    const adminEmails = await cli.prompt("Admin emails (comma separated)");

    this.log(chalk.blueBright("Cloning boilerplate project..."));
    shell.exec(
      "git clone https://github.com/norberto-e-888/backend-boilerplate.git " +
        args.name
    );

    shell.cd(args.name);
    const devEnvFileName = ".env";
    const testEnvFileName = ".env.test";
    this.log(chalk.blueBright("Creating .env files..."));
    shell.touch(devEnvFileName);
    shell.touch(testEnvFileName);
    this.log(chalk.blueBright("Writing into .env files..."));
    const devEnvFileContent = shell.ShellString(
      `NODE_ENV=development
PORT=${port}
MONGO_URI=${mongoUriDev}
JWT_SECRET_ACCESS_TOKEN=${jwtSecretAccessToken}
JWT_SECRET_REFRESH_TOKEN=${jwtSecretRefreshToken}
CLIENT_URL=${clientUrlDev}
SENDGRID_API_KEY=${sendGridApiKey}
SENDGRID_FROM=${sendgridFromAddress}
TWILIO_SID=${twilioSid}
TWILIO_AUTH_TOKEN=${twilioAuthToken}
TWILIO_NUMBER=${twilioNumber}
# separate admin emails with a comma
ADMINS_EMAILS=${adminEmails}`
    );

    const testEnvFileContent = shell.ShellString(
      `NODE_ENV=test
PORT=${port}
MONGO_URI=${mongoUriTesting}
JWT_SECRET_ACCESS_TOKEN=${jwtSecretAccessToken}
JWT_SECRET_REFRESH_TOKEN=${jwtSecretRefreshToken}
CLIENT_URL=${clientUrlDev}
SENDGRID_API_KEY=${sendGridApiKey}
SENDGRID_FROM=${sendgridFromAddress}
TWILIO_SID=${twilioSid}
TWILIO_AUTH_TOKEN=${twilioAuthToken}
TWILIO_NUMBER=${twilioNumber}
# separate admin emails with a comma
ADMINS_EMAILS=${adminEmails}`
    );

    devEnvFileContent.to(devEnvFileName);
    testEnvFileContent.to(testEnvFileName);
    this.log(chalk.greenBright(".env files successfully written into"));
    this.log(chalk.blueBright("Installing dependencies..."));
    shell.exec("npm i");
    this.log(chalk.greenBright("Dependencies successfully installed"));
    this.log(chalk.redBright("Make sure redis is running on port 6379!"));
    shell.exec("code .");
  }
}
