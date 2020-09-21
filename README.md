# emoji

[![Tags](https://img.shields.io/github/release/denosaurs/emoji)](https://github.com/denosaurs/emoji/releases)
[![CI Status](https://img.shields.io/github/workflow/status/denosaurs/emoji/check)](https://github.com/denosaurs/emoji/actions)
[![License](https://img.shields.io/github/license/denosaurs/emoji)](https://github.com/denosaurs/emoji/blob/master/LICENSE)

## Usage

```typescript
import * as emoji from "https://deno.land/x/emoji/mod.ts";

// returns the emoji code for coffee
emoji.get("coffee");

// `.get` also supports github flavored markdown emoji
emoji.get(":fast_forward:");

// returns the alias "coffee"
emoji.alias(emoji.get("coffee"));

// replaces all :emoji: with the actual emoji, in this case: returns "I ❤️ ☕️!"
emoji.emojify("I :heart: :coffee:!");

// replaces the actual emoji with :emoji:, in this case: returns "I :heart: :pizza:"
emoji.unemojify("I ❤️ 🍕");

// returns a random emoji + key, e.g. `{ emoji: '❤️', key: 'heart' }`
emoji.random();

// Strips the string from emoji's, in this case returns: "low disk space".
emoji.strip("⚠️ 〰️ 〰️ low disk space");

// Replace emoji's by callback method: "warning: low disk space"
emoji.replace("⚠️ 〰️ 〰️ low disk space", (emoji) => `:${emoji.aliases[0]}:`);
```

## Other

### Related

- [node-emoji](https://github.com/omnidan/node-emoji) - simple emoji support for node.js projects

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with deno fmt and commit messages are done following Conventional Commits spec.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
