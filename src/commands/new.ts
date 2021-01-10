import { Command } from "@oclif/command";
import cli from "cli-ux";
import * as shell from "shelljs";
import * as crypto from "crypto";
import chalk = require("chalk"); // ! strange behaviour using from makes me need this syntax

export default class New extends Command {
  static description = "generates boilerplate project in specified directory";

  static examples = ["yokita new my-app"];

  static args = [{ name: "name" }];

  async run() {
    const { args } = this.parse(New);
    const devEnvFileName = ".env.development";
    const testEnvFileName = ".env.test";

    shell.exec(
      "git clone https://github.com/norberto-e-888/backend-boilerplate.git " +
        args.name
    );

    shell.cd(args.name);
    this.log(chalk.blueBright("creating .env files..."));
    shell.touch(devEnvFileName);
    shell.touch(testEnvFileName);

    const agressToOnboarding = await cli.confirm(
      chalk.yellow(
        "go through env onboarding? (yes/no) (we don't log or persist sensitive information in anyway or form)"
      )
    );

    if (agressToOnboarding) {
      const port = await cli.prompt(
        chalk.whiteBright("port to expose app on"),
        {
          default: "3001",
        }
      );

      const mongoUriDev = await cli.prompt(
        chalk.whiteBright("development MongoDB URI"),
        {
          required: true,
          type: "hide",
        }
      );

      const mongoUriTesting = await cli.prompt(
        chalk.whiteBright("testing MongoDB URI"),
        {
          required: true,
          type: "hide",
        }
      );

      const jwtSecretAccessToken =
        (await cli.prompt(
          chalk.whiteBright(
            `access token secret (if not provided a ${chalk.green(
              "very strong"
            )} one will be generated for you)`
          ),
          { required: false, type: "hide" }
        )) || crypto.randomBytes(128).toString("base64");

      const jwtSecretRefreshToken =
        (await cli.prompt(
          chalk.whiteBright(
            `refresh token secret (if not provided a ${chalk.green(
              "very strong"
            )} one will be generated for you)`
          ),
          { required: false, type: "hide" }
        )) || crypto.randomBytes(128).toString("base64");

      const clientUrlDev = await cli.prompt(
        chalk.whiteBright("development client app URL"),
        {
          default: "http://localhost:3000",
        }
      );

      const sendGridApiKey = await cli.prompt(
        chalk.whiteBright("sendgrid API Key"),
        {
          required: true,
          type: "hide",
        }
      );

      const sendgridFromAddress = await cli.prompt(
        chalk.whiteBright("sendgrid sender address"),
        {
          required: true,
        }
      );

      const twilioSid = await cli.prompt(chalk.whiteBright("twilio SID"), {
        required: true,
        type: "hide",
      });

      const twilioAuthToken = await cli.prompt(
        chalk.whiteBright("twilio auth token"),
        {
          required: true,
          type: "hide",
        }
      );

      const twilioNumber = await cli.prompt(
        chalk.whiteBright("twilio sender number"),
        {
          required: true,
        }
      );

      const adminEmails = await cli.prompt(
        chalk.whiteBright("admin emails (comma separated)")
      );

      this.log(chalk.blueBright("writing into .env files..."));
      const devEnvFileContent = shell.ShellString(
        `PORT=${port}
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
        `# these variables will overwrite those in .env.development when running tests while preserving the rest
MONGO_URI=${mongoUriTesting}`
      );

      devEnvFileContent.to(devEnvFileName);
      testEnvFileContent.to(testEnvFileName);
      this.log(chalk.greenBright(".env files successfully written into"));
    } else {
      await cli.anykey(
        chalk.red(
          `you have chosen to skip env onboarding, you must then fill "${devEnvFileName}" & "${testEnvFileName}" with valid values in order for the app to run. (press any key to acknowledge)`
        )
      );

      const devEnvFileContent = shell.ShellString(
        `PORT=
MONGO_URI=
JWT_SECRET_ACCESS_TOKEN=
JWT_SECRET_REFRESH_TOKEN=
CLIENT_URL=
SENDGRID_API_KEY=
SENDGRID_FROM=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_NUMBER=
# separate admin emails with a comma
ADMINS_EMAILS=`
      );

      const testEnvFileContent = shell.ShellString(
        `# these variables will overwrite those in .env.development when running tests while preserving the rest
MONGO_URI=`
      );

      devEnvFileContent.to(devEnvFileName);
      testEnvFileContent.to(testEnvFileName);
    }

    const installDeps = await cli.confirm(
      chalk.yellow("install dependencies now? (yes/no)")
    );

    if (installDeps) {
      cli.action.start("installing dependencies");
      shell.exec("npm i");
      cli.action.stop();
      this.log(chalk.greenBright("dependencies successfully installed"));
    } else {
      await cli.anykey(
        chalk.redBright(
          'I will remember to install run "npm i" later (press any key to acknowledge)'
        )
      );
    }

    await cli.anykey(
      chalk.redBright(
        "I understand redis must be running on port 6379 for the app to run (press any key to acknowledge)"
      )
    );

    const open = await cli.confirm(chalk.yellow("open app? (yes/no)"));
    if (open) {
      shell.exec("code .");
    }

    this.log(chalk.greenBright("thank you for using yokita and happy coding!"));
  }
}
