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

    cli.action.start("cloning boilerplate project...");
    shell.exec(
      "git clone https://github.com/norberto-e-888/backend-boilerplate.git " +
        args.name
    );

    cli.action.stop();
    shell.cd(args.name);
    this.log(chalk.blueBright("creating .env files..."));
    shell.touch(devEnvFileName);
    shell.touch(testEnvFileName);

    const agressToOnboarding = await cli.confirm(
      "go through env onboarding? (yes/no) (we don't log or persist sensitive information in anyway or form)"
    );

    if (agressToOnboarding) {
      const onboardingProgress = cli.progress({
        format: "env onboarding | {value}/{total}",
      });

      onboardingProgress.start(12, 0);
      const port = await cli.prompt("\nport to expose app on", {
        default: "3001",
      });

      onboardingProgress.increment();
      const mongoUriDev = await cli.prompt("development MongoDB URI", {
        required: true,
        type: "hide",
      });

      onboardingProgress.increment();
      const mongoUriTesting = await cli.prompt("testing MongoDB URI", {
        required: true,
        type: "hide",
      });

      onboardingProgress.increment();
      const jwtSecretAccessToken =
        (await cli.prompt(
          "access token secret (if not provided a very strong one will be generated for you)",
          { required: false, type: "hide" }
        )) || crypto.randomBytes(128).toString("base64");

      onboardingProgress.increment();
      const jwtSecretRefreshToken =
        (await cli.prompt(
          "refresh token secret (if not provided a very strong one will be generated for you)",
          { required: false, type: "hide" }
        )) || crypto.randomBytes(128).toString("base64");

      onboardingProgress.increment();
      const clientUrlDev = await cli.prompt("development client app URL", {
        default: "http://localhost:3000",
      });

      onboardingProgress.increment();
      const sendGridApiKey = await cli.prompt("sendgrid API Key", {
        required: true,
        type: "hide",
      });

      onboardingProgress.increment();
      const sendgridFromAddress = await cli.prompt("sendgrid sender address", {
        required: true,
      });

      onboardingProgress.increment();
      const twilioSid = await cli.prompt("twilio SID", {
        required: true,
        type: "hide",
      });

      onboardingProgress.increment();
      const twilioAuthToken = await cli.prompt("twilio auth token", {
        required: true,
        type: "hide",
      });

      onboardingProgress.increment();
      const twilioNumber = await cli.prompt("twilio sender number", {
        required: true,
      });

      onboardingProgress.increment();
      const adminEmails = await cli.prompt("admin emails (comma separated)");
      onboardingProgress.increment();

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
      onboardingProgress.stop();
    } else {
      await cli.anykey(
        `you have chosen to skip env onboarding, you must then fill "${devEnvFileName}" & "${testEnvFileName}" with valid values in order for the app to run. (press any key to continue)`
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

    cli.action.start("installing dependencies...");
    shell.exec("npm i");
    cli.action.stop();
    this.log(chalk.greenBright("dependencies successfully installed"));
    await cli.anykey(
      "I understand redis must be running on port 6379 for the app to run (press any key to acknowledge)"
    );

    const open = await cli.confirm("open app? (yes/no)");
    if (open) {
      shell.exec("code .");
    }

    this.log(chalk.greenBright("thank you for using yokita and happy coding!"));
  }
}
