
// Internal ASCII Art Detection (no external API needed)
export interface ASCIIDetectionResult {
  hasASCII: boolean;
  patterns: string[];
  confidence: number;
}

export const detectASCIIPatterns = async (text: string): Promise<ASCIIDetectionResult> => {
  // Common ASCII art patterns and characters
  const asciiPatterns = [
    /[┌┐└┘├┤┬┴┼]/g, // Box drawing characters
    /[▀▄█▌▐░▒▓]/g, // Block elements
    /[╔╗╚╝╠╣╦╩╬]/g, // Double box drawing
    /[◄►▲▼]/g, // Arrows
    /[☺☻♠♣♥♦]/g, // Symbols
    /¯\\?_?\(ツ\)_?\/¯/g, // Shrug emoticon
    /[─│┌┐└┘├┤┬┴┼]/g, // Line drawing
  ];

  const foundPatterns: string[] = [];
  let totalMatches = 0;

  asciiPatterns.forEach((pattern, index) => {
    const matches = text.match(pattern);
    if (matches) {
      foundPatterns.push(`Pattern ${index + 1}`);
      totalMatches += matches.length;
    }
  });

  // Check for repeated characters that might form ASCII art
  const repeatedChars = /(.)\1{5,}/g;
  const repeatedMatches = text.match(repeatedChars);
  if (repeatedMatches) {
    foundPatterns.push('Repeated characters');
    totalMatches += repeatedMatches.length;
  }

  // Check text-to-non-text ratio
  const nonTextChars = text.replace(/[a-zA-Z0-9\s]/g, '').length;
  const totalChars = text.length;
  const nonTextRatio = totalChars > 0 ? nonTextChars / totalChars : 0;

  const hasASCII = foundPatterns.length > 0 || nonTextRatio > 0.3;
  const confidence = Math.min(0.9, (totalMatches / 10) + (nonTextRatio * 0.5));

  return {
    hasASCII,
    patterns: foundPatterns,
    confidence,
  };
};
