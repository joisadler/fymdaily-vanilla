# Express Boilerplate

No more headaches from a long environment setup. Just start writing your app!

## Includes:
- ES6 support via [babel](https://babeljs.io).
- Local authentication strategy via [Passport.js](http://www.passportjs.org/).
- Interaction with [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/).
- Code style linting via [Eslint](https://eslint.org/), [Stylelint](https://stylelint.io/) & [Pug-lint](https://github.com/pugjs/pug-lint).
- Templates creating via [Pug](https://pugjs.org/api/getting-started.html).
- [SCSS](https://sass-lang.com/documentation/file.SCSS_FOR_SASS_USERS.html) support && JS bundling via [Webpack](https://webpack.js.org/).
- Full browsers list support via [Autoprefixer](https://autoprefixer.github.io)
- Minify CSS files with [cssnano](https://cssnano.co/).
- Simple and fast responsive layout development via [Bootstrap](https://getbootstrap.com/) & [jQuery](https://jquery.com/).
- Email notifications via [Nodemailer](https://nodemailer.com/about/)
- Load environment variables with [Dotenv](https://www.npmjs.com/package/dotenv).
- Setting http-headers for better app security via [Helmet](https://helmetjs.github.io/).
- Use UPDATE, DELETE and any other query methods for client side queries via [Method-override](https://github.com/expressjs/method-override).
- Live-reload server via [Nodemon](https://nodemon.io/).
- Tracking app activity via [Google Analytics](https://analytics.google.com)
- "npm run dev" script runs automatically when opening [VS Code](https://code.visualstudio.com/).
- Easy deploy your app via [Heroku](https://www.heroku.com).

## Getting Started

```sh
# clone it
git clone git@github.com:joisadler/express-boilerplate.git
cd express-boilerplate

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start development live-reload server
npm run dev

# Start production server:
npm start
```

Also, don't forget to change the things below according to your needs:
- Name, description, autor, repo, etc... at `package.json`.
- App title at `routes/index.js`.
- Content of meta tags at `views/layout.pug`.
- Content of email at `routes/signup.js`.
- Create `.env` file and set your environmental variables:
  - `NODE_ENV` (should be `development`)
  - `DBUSER`
  - `DBPASSWORD`
  - `DBHOST`
  - `DBPORT`
  - `DBNAME`
  - `SECRET`
  - `KEY`
  - `GMAIL_USER`
  - `GMAIL_PASS`
- Change the Tracking ID parameter `'UA-XXXXX-Y'` at `src/javascripts/analytics.js`.
- Put your 16x16px`favicon.ico` to `src/images/favicons`.
- Create an 600x600px `og-image.jpg` and put it to `src/images/facebook`.