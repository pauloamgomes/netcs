# Netcs - Next Tailwind Contentful Easy Personal Website Starter

## Why?

After so much time working with Contentful and Next, I never found a single consistent way of starting a project,  
and all starters that tried have their own caveats, some are too basic without touching the real problems like handling GraphQL query complexity limits or are too strict.  
I'm not saying this starter is better as there are many ways to accomplish the same thing when building with these technologies.  
Anyway, it was a lot of fun building it, exploring the nice features of React SSR inside Next.js, and playing with Contentful content modeling capabilities.

> 🚨 **WARNING** 🚨  
This project is the culmination of my own experimentations with Next.js and Contentful and it may not be suitable for your needs.  
All contents present in Contentful are fake, mostly generated using AI tools like ChatGPT and DALL-E.

## Demo

Project is deployed live at [https://netcs.vercel.app/](https://netcs.vercel.app/)

## Documentation

[https://netcs.vercel.app/help](https://netcs.vercel.app/help)

## Tech Stack

- ⚡️ [Next.js 14](https://nextjs.org/blog/next-14) with [App router](https://nextjs.org/docs/app)
- ⚛️ [React 18](https://react.dev/blog/2022/03/29/react-v18)
- ✨ [TypeScript](https://www.typescriptlang.org)
- 💨 [TailwindCSS](https://tailwindcss.com) + 🌻 [DaisyUI](https://daisyui.com)
- 🌞 [Contentful Headless CMS](https://www.contentful.com)
- 🗄️ [Turso DB](https://turso.tech)
- 👷 Code on Github under the MIT License. 
- 🌩️ [Hosted on Vercel](https://vercel.com) but be free to use a compatible hosting solution that you prefer
- 📦 [Code Editor Field App for Contentful](https://github.com/pauloamgomes/Contentful-Code-Editor-Field-App)
- 📦 [Readingtime App for Contentful](https://github.com/pauloamgomes/contentful-readingtime-field-app)

## Main Features

- Flexible and composable content models
- SEO ready with Metadata being generated based on specific SEO fields but with fallbacks in place
- Generation of GraphQL (schema, and types), in sync with the content types via graphql-codegen.
- Typescript
- Tailwind CSS via DaisyUI
- Nextjs SSR components
- Contentful Live preview
- Contentful Dashboard example App for visualizing stats on Articles views counts

## Requirements

- Access to a Contentful space (you can register for free here [https://www.contentful.com/get-started/](https://www.contentful.com/get-started/))
- Optionally Turso DB is required for newsletter signups and article views counter.
- An environment where you can run Node 18+
- pnpm installed

## Getting Started

### Installation

1. Clone the repo
2. Install with pnpm

```bash
git clone git@github.com:pauloamgomes/netcs.git
cd netcs
pnpm install

cp .env.example .env

# Grab your Contentful Space ID, Environment ID and Access Token and update the .env file
# CONTENTFUL_SPACE_ID=<your-space-id>
# CONTENTFUL_ENVIRONMENT_ID=<your-environment-id>
# CONTENTFUL_ACCESS_TOKEN=<your-access-token>
# CONTENTFUL_MANAGEMENT_TOKEN=<your-mgmt-token>
```

#### If you want to have article view counts and newsletter registration (optional)

1. Create a Turso database
2. Get an Auth token
3. Place the Turso database url and auth token in your .env file
4. Run the migration command and push the migrations

```bash
# install and check installed version
brew install tursodatabase/tap/turso
turso --version

# signup/auth
turso auth signup # signup with github

# db creation
turso db create netcs-db # choose your own db name

# get db endpoint and auth token
turso db show netcs-db
turso db tokens create netcs-db 

# run and push the migrations
pnpm run db:generate
pnpm run db:push

# check on the Turso dashboard for your changes or run the editor locally
pnpm run db:studio
```

#### Import example Data into Contentful

In order to be able to start the local server Contentful needs to have all content models created along with the example data, you can easily do it using the command:

```bash
pnpm run contentful:import
```

The above command will import all example data you can see in this example website in your space.

> **WARNING**  
You need to have an empty environment without any content models created.
You need to install 2 Contentful Apps mentioned when running the import command.
You can optionally install 1 Contentful Apps mentioned when running the import command.
Please also note that the migration data is using a default Contentful locale en-US, if you want a different locale you'll need to manipulate the exported data by replacing in the migration JSON file all keys containing en-US.

#### Start Local server

If you did all the previous steps without errors and you feel courageous you can try to start the local server by running:

```bash
pnpm run dev
```

and you should see:

```bash
> graphql-codegen --config codegen.ts

✔ Parse Configuration
✔ Generate outputs
   ▲ Next.js 14.0.2
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 1113ms
```

And voila, it works! 🎉

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## License

MIT License, see [LICENSE](./LICENSE).