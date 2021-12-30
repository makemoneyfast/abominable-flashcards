const computeFontSize = (text: string) => {
    console.log(`${window.innerWidth} > ${window.innerHeight}`);
    const landscape = window.innerWidth > window.innerHeight;
    let fontSize: number = 41;

    // This only works if all glyphs displayed are square.
    if (landscape) {
        fontSize = 34 / text.length;
    } else {
        fontSize = Math.min(36, 80 / text.length);
    }
    console.log(landscape, text, text.length, fontSize)
    return fontSize
}

export { computeFontSize }