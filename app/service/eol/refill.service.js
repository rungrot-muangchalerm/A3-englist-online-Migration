const jwt = require('jsonwebtoken');
const refillData = require('../../model/eol/refill.model');

const JWT_SECRET = process.env.JWT_SECRET;
const VERIFY_TOKEN_MAX_AGE = 10 * 60; // 10 minutes

function generateVerifyChallenge() {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  const token = jwt.sign({ answer: a + b }, JWT_SECRET, { expiresIn: VERIFY_TOKEN_MAX_AGE });
  return {
    label: `${b} + ${a} = `,
    token,
  };
}

function verifyChallenge(token, userAnswer) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.answer === Number(userAnswer);
  } catch (err) {
    return false;
  }
}

function addDays(dateStr, days) {
  const d = dateStr instanceof Date ? new Date(dateStr) : new Date(dateStr.replace(' ', 'T'));
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function refillCard(memberId, accountType, code, pin) {
  const card = await refillData.findCard(code, pin);
  if (!card) {
    throw new Error('Code and PIN are Incorrect');
  }

  const cardType = await refillData.getCardType(card.type_id);
  if (!cardType) {
    throw new Error('Card type not found');
  }
  const days = Number(cardType.amount);
  const now = refillData.nowString();
  const cardId = card.card_id;

  if (accountType === 'master') {
    const nextRefillId = await refillData.getNextRefillId();
    const latest = await refillData.getLatestTimeWindow(memberId);
    if (latest) {
      const newStop = addDays(latest.stop, days);
      await refillData.insertTimeWindow({
        refillId: nextRefillId,
        memberId,
        cardId,
        start: latest.stop,
        stop: newStop,
        createDate: now,
      });
    } else {
      const stop = addDays(now, days);
      await refillData.insertTimeWindow({
        refillId: nextRefillId,
        memberId,
        cardId,
        start: now,
        stop,
        createDate: now,
      });
    }
    await refillData.activateCard(cardId);
    await refillData.addMasterAmount(memberId, days);
  } else {
    const total = await refillData.getPersonalTotal(memberId);
    if (total) {
      await refillData.addPersonalTotal(memberId, days);
    } else {
      await refillData.createPersonalTotal(memberId, days);
    }
    await refillData.insertPersonalRefill(memberId, cardId, now);
    await refillData.activateCard(cardId);
  }

  return { success: true, days, cardTypeName: cardType.type_name };
}

async function buildRefillHistory(memberId, accountType) {
  const timeHistory = await refillData.getTimeHistory(memberId);
  const history = [];
  for (const row of timeHistory) {
    const card = row.card_id ? await refillData.getCardById(row.card_id) : null;
    const type = card ? await refillData.getCardType(card.type_id) : null;
    let label = 'Corporate Refill by Master Account';
    if (String(row.card_id) === '-1') {
      label = 'Refill 1 day from Personal Available Day';
    } else if (type) {
      label = `${type.type_name} [ ${type.cost} Baht ]`;
    }
    history.push({
      createDate: row.create_date,
      start: row.start,
      stop: row.stop,
      label,
    });
  }

  let refillHistory = [];
  if (accountType !== 'master') {
    const rows = await refillData.getPersonalRefillHistory(memberId);
    for (const row of rows) {
      const card = row.card_id ? await refillData.getCardById(row.card_id) : null;
      const type = card ? await refillData.getCardType(card.type_id) : null;
      let label = 'Corporate Refill by Master Account';
      if (String(row.card_id) === '-1') {
        label = 'Refill 1 day from Personal Available Day';
      } else if (type) {
        label = `${type.type_name} [ ${type.cost} Baht ]`;
      }
      refillHistory.push({
        createDate: row.create_date,
        label,
      });
    }
  }

  return { history, refillHistory };
}

module.exports = {
  generateVerifyChallenge,
  verifyChallenge,
  refillCard,
  buildRefillHistory,
};
