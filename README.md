<img src="https://raw.githubusercontent.com/bendevnull/Tenli/refs/heads/master/public/tenli-light.svg" height=100/>

## Your collection of top ten lists
------

### Setting up
Run `npm install`, then create a `.env` file in the root directory and fill with the properties defined below.

------

### Environment Variables

| Variable               | Example                | Notes                                                                                                        |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| AUTH_URL*              | `https://tenliapp.com` | The base URL of the project (Used for more than just authentication)                                         |
| AUTH_SECRET*           | `none`                 | Can be automatically filled using `npx auth secret`                                                          |
| AUTH_{PROVIDER}_ID     | `none`                 | Replace {PROVIDER} with the name of the provider. Example: `DISCORD`. At least one (1) provider is required. |
| AUTH_{PROVIDER}_SECRET | `none`                 | See above notes for `AUTH_{PROVIDER}_ID`                                                                     |
| DATABASE_URL*          | `none`                 | URL for the database with credentials. See [Prisma's documentation](https://www.prisma.io/docs/getting-started) for supported databases. |
| USE_ACCELERATE         | `false`                | Set this to `true` if you're using a Prisma provided Accelerate database. If not, set this to `false`        |
| PORT                   | `3000`                 | Port the web server should run on. Defaults to `3000`                                                        |

**\*Required variable**

### Supported Auth Providers
* Google
* Discord
* Facebook
* Instagram

More coming soon (Or add your favorite provider and submit a PR! :))

------

### Running
#### Development
* `npm run dev`
#### Production
* `npm run build`
* `npm start`