import 'dotenv/config'

import { confirm } from '@inquirer/prompts';
import chalk from "chalk";
import contentfulImport from "contentful-import";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentFile = path.join(__dirname, "export/contentful-export.json")

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_ENVIRONMENT_ID: environmentId,
  CONTENTFUL_MANAGEMENT_TOKEN: managementToken,
} = process.env;

const options = {
  spaceId,
  environmentId,
  managementToken,
  contentFile,
  uploadAssets: true,
  assetsDirectory: path.join(__dirname, "export"),
};

console.log(`
  Importing data from your ${chalk.green("netcs")} project to Contentful.

  You will need on your ${chalk.green(".env")} file:

  • Your ${chalk.green("Space ID")}
    ${chalk.magenta("It should be empty, without any content-types or entries")}
  • Your ${chalk.green("Environment ID")}
  • Your ${chalk.green("Content Management API access token")}

  You will need on your Contentful space the following Apps installed:

  • The custom App ${chalk.green("Code Editor Field")}
    ${chalk.cyan("Install directly from https://app.contentful.com/deeplink?link=apps&id=1u2bRLEHlFfFFzUOsSCeA2")}
    ${chalk.magenta("Check https://github.com/pauloamgomes/Contentful-Code-Editor-Field-App for more info")}

  • The custom App ${chalk.green("Reading Time")}
    ${chalk.cyan("Install directly from https://app.contentful.com/deeplink?link=apps&id=37bHFoMVInn1gLrv2L1IYl")}
    ${chalk.magenta("Check https://github.com/pauloamgomes/contentful-readingtime-field-app for more info")}

  • The custom App ${chalk.green("Articles Views")}
    ${chalk.cyan("Install directly from https://app.contentful.com/deeplink?link=apps&id=86QZVBOYM4TmRwMdRT9mq")}
    ${chalk.magenta("Or build it from ./contentful/articles-views")}

  ${chalk.bgYellow(" ONLY PROCEED IF YOU HAVE COMPLETED ALL THE ABOVE STEPS ")}

  Ready? Let's go 🚀
`);

let answer = await confirm({ message: 'Continue?', default: false });

if (!answer) {
  process.exit(0);
}

console.log(`
  Current values from your ${chalk.green(".env")} file:

  ${chalk.green("CONTENTFUL_SPACE_ID")} = ${chalk.red(spaceId)}
  ${chalk.green("CONTENTFUL_ENVIRONMENT_ID")} = ${chalk.red(environmentId)}
  ${chalk.green("CONTENTFUL_MANAGEMENT_TOKEN")} = ${chalk.red("xxx-your-token-is-hidden-xxx")}

`);

answer = await confirm({ message: 'Continue?', default: false });

if (!answer) {
  process.exit(0);
}

contentfulImport(options)
  .then(() => {
    console.log(chalk.green("Data imported successfully!"));
  })
  .catch(() => {
    console.error("Oh no! Some errors occurred!");
  });
