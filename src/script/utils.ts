const computeFontSize = (...strings: string[]) => {
  const landscape = window.innerWidth > window.innerHeight;
  let lengthsToConsider: number[];

  // This only works if all glyphs displayed are square.
  if (landscape) {
    lengthsToConsider = strings.map((text) => 34 / text.length);
  } else {
    lengthsToConsider = strings.map((text) => 80 / text.length);
    lengthsToConsider.push(36 / strings.length);
  }

  return Math.min(...lengthsToConsider);
};

const mapToKatakana = (hiragana: string) => {
  return hiragana
    .split("")
    .map(
      (character) =>
        ({
          あ: "ア",
          い: "イ",
          う: "ウ",
          え: "エ",
          お: "オ",
          は: "ハ",
          ひ: "ヒ",
          ふ: "フ",
          へ: "ヘ",
          ほ: "ホ",
          か: "カ",
          き: "キ",
          く: "ク",
          け: "ケ",
          こ: "コ",
          さ: "サ",
          し: "シ",
          す: "ス",
          せ: "セ",
          そ: "ソ",
          た: "タ",
          ち: "チ",
          つ: "ツ",
          て: "テ",
          と: "ト",
          ら: "ラ",
          り: "リ",
          る: "ル",
          れ: "レ",
          ろ: "ロ",
          ま: "マ",
          み: "ミ",
          む: "ム",
          め: "メ",
          も: "モ",
          な: "ナ",
          に: "ニ",
          ぬ: "ヌ",
          ね: "ネ",
          の: "ノ",
          や: "ヤ",
          ゆ: "ユ",
          よ: "ヨ",
          わ: "ワ",
          を: "ヲ",
          ん: "ン",
          が: "ガ",
          ぎ: "ギ",
          ぐ: "グ",
          げ: "ゲ",
          ご: "ゴ",
          だ: "ダ",
          ぢ: "ヂ",
          づ: "ヅ",
          で: "デ",
          ど: "ド",
          ざ: "ザ",
          じ: "ジ",
          ず: "ズ",
          ぜ: "ゼ",
          ぞ: "ゾ",
          ば: "バ",
          び: "ビ",
          ぶ: "ブ",
          べ: "ベ",
          ぼ: "ボ",
          ぱ: "パ",
          ぴ: "ピ",
          ぷ: "プ",
          ぺ: "ペ",
          ぽ: "ポ",
          ゃ: "ャ",
          ゅ: "ュ",
          ょ: "ョ",
          っ: "ッ",
          " ": " ",
          "　": "　",
        }[character])
    )
    .join("");
};

export { computeFontSize, mapToKatakana };
