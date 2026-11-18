// Local rule-based feedback analyser. Used by the API server when no ANTHROPIC_API_KEY is set,
// and by the browser as an offline fallback so the AI page always works.
const POS = ['amazing', 'delicious', 'perfect', 'stunning', 'warm', 'attentive', 'best', 'magical', 'elegant', 'worth', 'lovely', 'great', 'excellent', 'beautiful', 'wonderful', 'art', 'good'];
const NEG = ['slow', 'cold', 'loud', 'wait', 'waited', 'rude', 'dirty', 'bad', 'expensive', 'overpriced', 'disappointing', 'late', 'noisy', 'bland', 'poor', 'worst', 'long'];
const TOPICS = { Food: ['food', 'dish', 'pizza', 'steak', 'ribeye', 'pasta', 'tagliolini', 'dessert', 'chocolate', 'burger', 'taste', 'flavor'], Service: ['service', 'staff', 'waiter', 'server', 'attentive', 'slow', 'wait', 'rude', 'anniversary'], Ambience: ['ambience', 'ambiance', 'music', 'loud', 'noisy', 'dining room', 'decor', 'lighting', 'cold', 'table', 'stunning'], Value: ['price', 'expensive', 'overpriced', 'worth', 'value', 'penny'] };
export function analyzeLocal(texts) {
  const items = texts.map((t) => {
    const w = t.toLowerCase(); const pos = POS.filter((k) => w.includes(k)).length; const neg = NEG.filter((k) => w.includes(k)).length;
    const score = pos - neg; return { text: t, sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral', topics: Object.keys(TOPICS).filter((k) => TOPICS[k].some((x) => w.includes(x))) };
  });
  const n = items.length || 1; const c = (s) => items.filter((i) => i.sentiment === s).length;
  const topicStats = {}; items.forEach((i) => i.topics.forEach((t) => { topicStats[t] ??= { positive: 0, negative: 0, neutral: 0 }; topicStats[t][i.sentiment]++; }));
  const themes = Object.entries(topicStats).map(([topic, s]) => ({ topic, ...s, mentions: s.positive + s.negative + s.neutral })).sort((a, b) => b.mentions - a.mentions);
  const weak = [...themes].sort((a, b) => b.negative - a.negative)[0];
  const strong = [...themes].sort((a, b) => b.positive - a.positive)[0];
  const actions = []; if (weak?.negative) actions.push(`Investigate ${weak.topic.toLowerCase()} complaints (${weak.negative} negative mention${weak.negative > 1 ? 's' : ''}).`);
  if (items.some((i) => /loud|music/.test(i.text.toLowerCase()))) actions.push('Review background music volume during peak service.');
  if (items.some((i) => /wait|slow/.test(i.text.toLowerCase()))) actions.push('Audit ticket times between courses and desserts.');
  if (strong?.positive) actions.push(`Promote ${strong.topic.toLowerCase()} in marketing — it is your strongest theme.`);
  return { source: 'local', total: items.length, positive: Math.round(c('positive') / n * 100), neutral: Math.round(c('neutral') / n * 100), negative: Math.round(c('negative') / n * 100),
    summary: `${items.length} review(s) analysed: ${c('positive')} positive, ${c('neutral')} neutral, ${c('negative')} negative.${strong ? ` Guests praise ${strong.topic.toLowerCase()} most.` : ''}${weak?.negative ? ` Main concern: ${weak.topic.toLowerCase()}.` : ''}`, themes, actions, items };
}
