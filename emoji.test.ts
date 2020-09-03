// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import * as emj from "./emoji.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test({
  name: "emoji | get",
  fn(): void {
    for (const emoji of emj.all()) {
      for (const alias of emoji.aliases) {
        const one = emj.get(alias);
        assertEquals(one, emoji.emoji);
        const two = emj.get(`:${alias}:`);
        assertEquals(two, emoji.emoji);
      }
    }
  },
});

Deno.test({
  name: "emoji | alias",
  fn(): void {
    for (const emoji of emj.all()) {
      const alias = emj.alias(emoji.emoji);
      assertEquals(alias, emoji.aliases[0]);
    }
  },
});

Deno.test({
  name: "emoji | aliases",
  fn(): void {
    for (const emoji of emj.all()) {
      const aliases = emj.aliases(emoji.emoji);
      assertEquals(aliases, emoji.aliases);
    }
  },
});

Deno.test({
  name: "emoji | infoByAlias",
  fn(): void {
    for (const emoji of emj.all()) {
      for (const alias of emoji.aliases) {
        const info = emj.infoByAlias(alias);
        assertEquals(info, emoji);
      }
    }
  },
});

Deno.test({
  name: "emoji | infoByCode",
  fn(): void {
    for (const emoji of emj.all()) {
      const info = emj.infoByCode(emoji.emoji);
      assertEquals(info, emoji);
    }
  },
});
