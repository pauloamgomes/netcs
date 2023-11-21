import 'dotenv/config'

import { confirm } from '@inquirer/prompts';
import chalk from "chalk";
import contentfulExport from "contentful-export";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_ENVIRONMENT_ID: environmentId,
  CONTENTFUL_MANAGEMENT_TOKEN: managementToken,
} = process.env;

const exportDir = path.join(__dirname, "export");
const contentFile = path.join(
  __dirname,
  "export/contentful-export.json"
);

const options = {
  spaceId,
  environmentId,
  managementToken,
  downloadAssets: true,
  exportDir,
  contentFile,
};

console.log(`
  Your are exporting data from Contentful to your local project.
  
  Values from your ${chalk.green(".env")} file:

  ${chalk.green("CONTENTFUL_SPACE_ID")} = ${chalk.red(spaceId)}
  ${chalk.green("CONTENTFUL_ENVIRONMENT_ID")} = ${chalk.red(environmentId)}
  ${chalk.green("CONTENTFUL_MANAGEMENT_TOKEN")} = ${chalk.red("xxx-your-token-is-hidden-xxx")}
  
  Ready? Let's go 🚀
`);

const answer = await confirm({ message: 'Continue?', default: false });

if (!answer) {
  process.exit(0);
}

contentfulExport(options)
  .then(() => {
    console.log(chalk.green("Data exported successfully!"));
  })
  .catch((err) => {
    console.log("Oh no! Some errors occurred!", err);
  });
