/**
 * emoji-test: https://unicode.org/Public/emoji/14.0/emoji-test.txt
 * cldr-annotations: https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-annotations-full/annotations/en/annotations.json
 * Unicode/Emoji Versioning: https://unicode.org/reports/tr51/proposed.html#Versioning
 *
 * @property emoji - from emoji-test
 * @property description - from emoji-test
 * @property category - from emoji-test
 * @property emojiVersion - from emoji-test
 * @property tags - derived from cldr-annotations
 * @property aliases - derived from cldr-annotations
 * @property unicodeVersion - defined by emoji spec
 * @property skinTones - Derived from emoji-test data
 */
export interface Emoji {
  emoji: string;
  description: string;
  group: string;
  subgroup: string;
  emojiVersion: number;
  unicodeVersion: number;
  tags: string[];
  aliases: string[];
  skinTones?: boolean;
}
