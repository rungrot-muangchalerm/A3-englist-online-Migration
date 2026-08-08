const refillService = require('../../service/eol/refill.service');
const accountService = require('../../service/eol/account.service');

async function getRefill(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    const challenge = refillService.generateVerifyChallenge();
    const history = await refillService.buildRefillHistory(req.user.memberId, account.type);
    res.json({
      status: 200,
      data: {
        accountType: account.type,
        challenge,
        ...history,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

module.exports = { getRefill };
