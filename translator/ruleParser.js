const keywordMap = {
    'jahaan': 'WHERE',
    'aur': 'AND',
    'ya': 'OR'
  };
  
  const fillerWords = [
    'ho', 'hain', 'tha', 'thi', 'ke', 'ki', 'ka', 'wala', 'waale', 'kiya', 'gaya'
  ];
  
  // Step 1: Translate basic keywords
  function replaceBasicKeywords(input) {
    let result = input;
    for (const [hinglish, sql] of Object.entries(keywordMap)) {
      const regex = new RegExp(`\\b${hinglish}\\b`, 'gi');
      result = result.replace(regex, sql);
    }
    return result;
  }
  
  // Step 2: Rule-based operand ordering
  function reorderOperands(input) {
    const patterns = [
      {
        regex: /(\b\w+\b)\s+(\d+)\s+se zyada/gi,
        replace: '$1 > $2'
      },
      {
        regex: /(\b\w+\b)\s+(\d+)\s+se kam/gi,
        replace: '$1 < $2'
      },
      {
        regex: /(\b\w+\b)\s+(\d+)\s+barabar/gi,
        replace: '$1 = $2'
      },
      {
        regex: /(\b\w+\b)\s+'([^']+)'\s+barabar/gi,
        replace: `$1 = '$2'`
      }
    ];
  
    let output = input;
    for (const { regex, replace } of patterns) {
      output = output.replace(regex, replace);
    }
    return output;
  }
  
  // Step 3: Remove fillers
  function removeFillerWords(input) {
    const regex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');
    return input.replace(regex, '').replace(/\s+/g, ' ').trim();
  }
  
  // Step 4: Rule-based main function
  function applyRuleBased(input) {
    let output = input;
    output = replaceBasicKeywords(output);
    output = reorderOperands(output);
    output = removeFillerWords(output);
    return output;
  }
  
  // Step 5: Validation — check if the output looks like valid SQL
  function isLikelyValidSQL(query) {
    if (!query.toLowerCase().includes('select') || !query.toLowerCase().includes('from')) {
      return false;
    }
    // Check for leftover Hinglish
    return !/\b(jahaan|se zyada|se kam|barabar)\b/gi.test(query);
  }
  
  module.exports = {
    applyRuleBased,
    isLikelyValidSQL
  };
  