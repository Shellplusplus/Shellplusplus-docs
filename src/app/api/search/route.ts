import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

export const dynamic = "force-static";

const chineseTokenizer = {
  language: "zh-CN",
  normalizationCache: new Map<string, string>(),
  tokenize(raw: string) {
    const normalized = raw.normalize("NFKC").toLowerCase();
    const tokens = new Set<string>();

    for (const match of normalized.matchAll(
      /[a-z0-9]+(?:[._+-][a-z0-9+]*)*/g,
    )) {
      tokens.add(match[0]);
    }

    for (const match of normalized.matchAll(/\p{Script=Han}+/gu)) {
      const characters = [...match[0]];
      tokens.add(match[0]);

      for (const character of characters) tokens.add(character);
      for (const size of [2, 3]) {
        for (let index = 0; index <= characters.length - size; index++) {
          tokens.add(characters.slice(index, index + size).join(""));
        }
      }
    }

    return [...tokens];
  },
};

export const { staticGET: GET } = createFromSource(source, {
  components: {
    tokenizer: chineseTokenizer,
  },
});
