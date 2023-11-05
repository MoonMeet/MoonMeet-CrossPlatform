## Moon Meet

<p float="left">
<img src="https://img.shields.io/badge/license-GPL-blue.svg" />
<img src="https://visitor-badge.laobi.icu/badge?page_id=MoonMeet.MoonMeet-CrossPlatform" />
<img src="https://github.com/MoonMeet/MoonMeet-CrossPlatform/actions/workflows/android-ci-linux.yml/badge.svg" />
<img src="https://github.com/MoonMeet/MoonMeet-CrossPlatform/actions/workflows/android-ci-linux-narch.yml/badge.svg" />
<img src="https://www.codefactor.io/repository/github/moonmeet/moonmeet-crossplatform/badge" />
</p>
<p>
<a href='https://play.google.com/store/apps/details?id=org.moon.moonmeet&utm_campaign=Moon%20Meet&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
<img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' width="150" height="65"/>
</a>
</p>

- We give people the closest distances

### Description

- **Moon Meet** is a social media platform including a chatting feature.
- **Moon Meet** is a platform formed with Mobile Android App.
- **Moon Meet** is licensed under the GNU GPL License 3.0.
- **Moon Meet** is an open source project means that anyone can see, change, get the source code and can contribute to make this project more better.
- **Moon Meet** is nothing without its contributors, so let's contribute together to make it alive!

### Screenshots

- See [Google Play](https://play.google.com/store/apps/details?id=org.moon.moonmeet) for screenshots.

### Contributing

#### Requirments:

- A working react native environment.
- A physical device (real device) because emulators have problem with SHA-256.
- NDK Version `21.4.7075529`. *NOTE: For Mac M1 users, you'll need NDK version `24.0.8215888`.*

- SDK Version `33, 32, 31 and 30`.
- ICU for linux (optional):

  ```
  git clone https://github.com/unicode-org/icu
  cd icu/icu4c
  cd source
  ./configure --prefix=/usr
  make
  sudo make install
  ```
- You need to add the following`:

  - Your `release.keystore` and `google-services.json`
  - Your `sensitive.js` file, [see more info here](/src/secrets/info.md)
  - You should add keystore  credentials as environment variables: `KEYPASS`, `KEYALIAS` and `KEYALIASPASS`

  ```
  export KEYALIAS=YOURKEYALIAS
  export KEYPASS=YOURKEYPASS
  export KEYALIASPASS=YOURKEYALIASPASS
  ```

### Commit message

When you've made changes to one or more files, you have to *commit* that file. You also need a *message* for that *commit*.

You should read these guidelines:
https://www.freecodecamp.org/news/writing-good-commit-messages-a-practical-guide/

And that summarized:

- Short and detailed
- Prefix one of these commit types:
  - `feat:` A feature, possibly improving something already existing
  - `fix:` A fix, for example of a bug
  - `style:` Feature and updates related to styling
  - `refactor:` Refactoring a specific section of the codebase
  - `test:` Everything related to testing
  - `docs:` Everything related to documentation
  - `chore:` Code maintenance (you can also use emojis to represent commit types)

**Examples:**

- `feat: Improve end-to-end encryption `
- `fix: Fix story not showing in some browsers`
- `refactor: Reformat code at File.*`
- `chore: bump Moon Meet version from X.X.X to X.X.X `

### Thanks for contributing

##### Thanks goes to these wonderful people:

- [Pranav Purwar](https://github.com/PranavPurwar): for Android CI Workflow.
- [Ahmed Sbai](https://github.com/sbaiahmed1): for Supporting me since the beginning of Moon Meet.

Thanks, they help to keep **Moon Meet** alive. It's better to have multiple people work on a project, for more ideas, fewer bugs. (sadly sometimes more), and generally quicker development. Each (helpful) contribution that gets thankfully accepted.

### Social

- [Facebook](https://www.facebook.com/moonmeetofficial)
- [Telegram](https://t.me/MoonMeet)

## License

```
Copyright (C) 2022  SectionTN

This program is free software: you can redistribute it and/or modify
it is under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, 
or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```
