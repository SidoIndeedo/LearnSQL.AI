const { applyRuleBased, isLikelyValidSQL } = require('../translator/ruleParser');
const {aiFallback} = require('../utils/aiFallback'); // You’ll make this

exports.translate = async (req, res) => {
  const { input } = req.body;
  let translated = applyRuleBased(input);

  if (isLikelyValidSQL(translated)) {
    return res.json({ success: true, translated });
  }

  // fallback to AI
  else{
  try {
    const aiResponse = await aiFallback(input);
    return res.json({ success: true, translated: aiResponse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Translation failed.' });
  }
}
};
