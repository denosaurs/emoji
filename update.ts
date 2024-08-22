// Usage: deno run --allow-net --allow-write update.ts 14
import type { Emoji } from "./types.ts";

const Qualification = {
  FULLY_QUALIFIED: "fully-qualified",
  MINIMALLY_QUALIFIED: "minimally-qualified",
  UNQUALIFIED: "unqualified",
  COMPONENT: "component",
} as const;

type Qualification = typeof Qualification[keyof typeof Qualification];

interface FullEmoji extends Emoji {
  codepoints: string[];
  ln: string;
  qualification: Qualification;
}

const version = Number(Deno.args[0]);
const isPost13: boolean = version >= 13;

const normalizeName = (desc: string): string =>
  desc.replace(/[^a-zA-Z0-9_*#]+/g, "_").toLowerCase();

// Prior to version 14, emojiText lines do not include version info
const parseLineRegex = isPost13
  ? /^(.*?);(.*?)#(.*?)E(\S*?)\s(.*)/i
  : /^(.*?);(.*?)#\s(.*?)\s(.*)/;

// Based on: https://unicode.org/reports/tr51/proposed.html#Versioning
// When emoji version > 5, it begins to match with unicode version.
const emojiUnicodeMap: { [emojiVersion: number]: number } = {
  [0]: 0,
  [0.6]: 6,
  [0.7]: 7,
  [1.0]: 8,
  [2.0]: 8,
  [3.0]: 9,
  [4.0]: 9,
  [5.0]: 10,
};

// Since we are only using CLDR Annotations to decorate, fetch latest.
// Use full list; derived list is skin-tone only
const annotationsURL =
  "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-annotations-full/annotations/en/annotations.json";
const annotationsResp = await fetch(annotationsURL);
const annotations: {
  [emoji: string]: { default: string[]; tts: string[] };
} = (await annotationsResp.json()).annotations.annotations;

const displayVersion: string = version.toFixed(1);
const emojiTestURL =
  `https://unicode.org/Public/emoji/${displayVersion}/emoji-test.txt`;
const emojiTestResp = await fetch(emojiTestURL);
const emojiTestText = await emojiTestResp.text();

// Store all tags, so we can make sure alias are not duped
const allTags = new Set();
const dupeTags = new Set();

const allEmojis: Emoji[] = emojiTestText.split("# group: ").slice(1)
  .flatMap(function parseGroups(groupText: string) {
    const [groupNameText, ...subgroups] = groupText.split("# subgroup: ");
    const groupName = groupNameText.replace("\n\n", "");
    return subgroups.flatMap(function parseSubgroups(subgroupText: string) {
      const [subgroupName, ...emojis] = subgroupText.split("\n");
      return emojis.flatMap(
        function parseEmojiFromLine(ln: string): FullEmoji {
          const lineData = ln.match(parseLineRegex) || [];
          const codepoints = (lineData[1] || "").trim().split(/\s+/);
          const qualification = (lineData[2] || "").trim() as Qualification;
          const emojiChar = (lineData[3] || "").trim();
          const description = isPost13 ? lineData[5] : lineData[4];
          const emojiVersion = isPost13 ? Number(lineData[4]) : 0;
          const unicodeVersion = emojiUnicodeMap[emojiVersion] != null
            ? emojiUnicodeMap[emojiVersion]
            : emojiVersion;

          const tags = annotations[emojiChar]?.default || [];
          if (description) tags.push(description);

          tags.forEach((tag) => {
            const name = normalizeName(tag);
            allTags.has(name) ? dupeTags.add(name) : allTags.add(name);
          });

          return {
            ln,
            codepoints,
            qualification,
            group: groupName,
            subgroup: subgroupName,
            emoji: emojiChar,
            emojiVersion,
            unicodeVersion,
            description,
            tags: Array.from(new Set(tags)), // dedupe if desc is a tag
            aliases: [],
          };
        },
      );
    });
  })
  // Effects that rely on data from other emojis
  .filter((emoji: FullEmoji, index: number, emojis: FullEmoji[]) => {
    const { aliases, codepoints, description, ln, qualification, tags } = emoji;

    if (ln.trim() === "" || ln[0] === "#") return false;
    if (!codepoints.length || !emoji.emoji || !description) return false;
    // Remove unqualified, partically-qualified, component
    if (qualification !== Qualification.FULLY_QUALIFIED) return false;

    tags.forEach((tag) => {
      const name = normalizeName(tag);
      if (!dupeTags.has(name)) aliases.push(name);
    });

    // Handle aliases after populating tag sets for
    if (!aliases.length) aliases.push(normalizeName(description));

    // Remove emojis with skin tones
    // Skin tones always follow base emoji, so if the prev matches,
    // Consider it to have a skin tone.
    if (/skin tone/.test(description)) {
      const prev = emojis[index - 1];
      if (codepoints.indexOf(prev?.codepoints?.[0]) !== -1) {
        prev.skinTones = true;
      }
      return false;
    }

    return true;
  })
  // deno-lint-ignore no-unused-vars
  .map(({ ln, codepoints, qualification, ...e }: FullEmoji): Emoji => e);

Deno.writeTextFileSync(`./all.json`, JSON.stringify(allEmojis, null, 2));
