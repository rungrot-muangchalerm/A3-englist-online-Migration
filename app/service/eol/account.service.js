const mysqli = require('../../config/mysqli.config');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function formatDbDate(value) {
  if (!value) return '-';
  if (value instanceof Date) {
    return value.toISOString().slice(0, 19).replace('T', ' ');
  }
  return String(value);
}

function addOneDayString(from) {
  const d = from instanceof Date ? new Date(from) : new Date(from.replace(' ', 'T'));
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function getMemberById(memberId) {
  const [rows] = await mysqli.query(
    'SELECT member_id, user, fname, lname, gender, is_admin FROM tbl_x_member WHERE member_id = ? LIMIT 1',
    [memberId],
  );
  return rows[0] || null;
}

async function hasActiveTime(memberId) {
  const now = nowString();
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_time WHERE member_id = ? AND start <= ? AND stop >= ? LIMIT 1',
    [memberId, now, now],
  );
  return rows.length > 0;
}

async function getLatestTime(memberId) {
  const now = nowString();
  let [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_time WHERE member_id = ? AND stop >= ? ORDER BY stop DESC LIMIT 1',
    [memberId, now],
  );
  if (rows.length === 0) {
    [rows] = await mysqli.query(
      'SELECT * FROM tbl_x_member_time WHERE member_id = ? ORDER BY stop DESC LIMIT 1',
      [memberId],
    );
  }
  const row = rows[0] || null;
  if (row) row.stop = formatDbDate(row.stop);
  return row;
}

async function buildInfoText(memberId, type) {
  const now = nowString();
  if (type === 'master') {
    const [amountRows] = await mysqli.query(
      'SELECT amount FROM tbl_x_member_amount WHERE member_id = ? LIMIT 1',
      [memberId],
    );
    const amount = amountRows.length ? amountRows[0].amount : 0;

    const [spRows] = await mysqli.query(
      'SELECT * FROM tbl_x_member_spacial WHERE member_id = ? AND start <= ? AND stop >= ? LIMIT 1',
      [memberId, now, now],
    );
    if (spRows.length === 1) {
      const sp = spRows[0];
      const [subRows] = await mysqli.query(
        'SELECT sub_id FROM tbl_x_member_sub WHERE master_id = ?',
        [memberId],
      );
      const subCount = subRows.length;
      return `<table align=center width=90% cellpadding=0 cellspacing=0 border=0>
        <tr height=25><td align=left><b><font color=green face=tahoma size=2> Available From : ${formatDbDate(sp.start)} <br> Available Until : ${formatDbDate(sp.stop)} <br> Sub Account Amount : ${subCount} / ${sp.amount} </font></b></td></tr>
      </table>`;
    }

    const [spPastRows] = await mysqli.query(
      'SELECT * FROM tbl_x_member_spacial WHERE member_id = ? AND (start > ? || stop < ?) LIMIT 1',
      [memberId, now, now],
    );
    if (spPastRows.length === 1) {
      const sp = spPastRows[0];
      const [subRows] = await mysqli.query(
        'SELECT sub_id FROM tbl_x_member_sub WHERE master_id = ?',
        [memberId],
      );
      const subCount = subRows.length;
      return `<table align=center width=90% cellpadding=0 cellspacing=0 border=0>
        <tr height=25><td align=left><b><font color=white face=tahoma size=2> Available From : ${formatDbDate(sp.start)} <br> Available Until : ${formatDbDate(sp.stop)} <br> Sub Account Amount : ${subCount} / ${sp.amount} </font></b></td></tr>
      </table>`;
    }

    return `<table align=center width=90% cellpadding=0 cellspacing=0 border=0>
      <tr height=25><td align=left><b><font size=2 face=tahoma color=white>Available Amount : ${amount} Day(s)</font></b></td></tr>
    </table>`;
  }

  // personal / expired
  const timeRow = await getLatestTime(memberId);
  const stopText = timeRow ? timeRow.stop : '-';
  const airTime = `<b><font size=2 face=tahoma color=white>Available Time : ${stopText} </font></b>`;

  const [totalRows] = await mysqli.query(
    'SELECT amount FROM tbl_x_member_total WHERE member_id = ? LIMIT 1',
    [memberId],
  );

  let totalMsg = '';
  if (totalRows.length === 1) {
    const available = totalRows[0].amount;
    totalMsg = `<b><font color=white face=tahoma size=2>Total Available Day : ${available} days </font></b>`;
  } else {
    const [subRows] = await mysqli.query(
      'SELECT sub_id FROM tbl_x_member_sub WHERE sub_id = ? LIMIT 1',
      [memberId],
    );
    if (subRows.length === 1) {
      totalMsg = `<b><font color=white face=tahoma size=2> Days remaining depends on the Master Account </font></b>`;
    } else {
      totalMsg = `<b><font color=white face=tahoma size=2> Total Available Day : - days </font></b>`;
    }
  }

  return `<table align=center width=90% cellpadding=0 cellspacing=0 border=0>
    <tr height=25><td width=65% align=left>${airTime}</td></tr>
    <tr height=25><td align=left>${totalMsg}</td></tr>
  </table>`;
}

async function resolveAccount(memberId) {
  const member = await getMemberById(memberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  const now = nowString();
  let type = '';
  let refill = 0;
  let corporate = false;
  let amount = 0;

  // 1) master account
  const [amountRows] = await mysqli.query(
    'SELECT amount FROM tbl_x_member_amount WHERE member_id = ? LIMIT 1',
    [memberId],
  );

  if (amountRows.length === 1) {
    type = 'master';
    amount = amountRows[0].amount;
  } else {
    // 2) personal / sub account
    type = 'personal';
    const [subRows] = await mysqli.query(
      `SELECT a.sub_id, a.master_id, b.amount
       FROM tbl_x_member_sub AS a
       INNER JOIN tbl_x_member_amount AS b ON a.master_id = b.member_id
       WHERE a.sub_id = ? AND b.amount >= ? AND a.status = ?
       LIMIT 1`,
      [memberId, 1, 1],
    );

    if (subRows.length === 1) {
      corporate = true;
      const { master_id: masterId, amount: masterAmount } = subRows[0];
      if (masterAmount == 0) {
        type = 'expired';
        refill = 1;
      } else {
        const active = await hasActiveTime(memberId);
        if (!active) {
          let k = 1;
          const [spRows] = await mysqli.query(
            'SELECT * FROM tbl_x_member_spacial WHERE member_id = ? AND start <= ? AND stop >= ? LIMIT 1',
            [masterId, now, now],
          );
          if (spRows.length === 1) k = 0;

          const remaining = masterAmount - k;
          await mysqli.query(
            'UPDATE tbl_x_member_amount SET amount = ? WHERE member_id = ?',
            [remaining, masterId],
          );
          await mysqli.query(
            'INSERT INTO tbl_x_member_time (member_id, card_id, start, stop, create_date) VALUES (?, ?, ?, ?, ?)',
            [memberId, 0, now, addOneDayString(now), now],
          );
          refill = 1;
        }
      }
    }

    if (refill === 0) {
      const [totalRows] = await mysqli.query(
        'SELECT amount FROM tbl_x_member_total WHERE member_id = ? AND amount >= 1 LIMIT 1',
        [memberId],
      );
      if (totalRows.length === 1) {
        const active = await hasActiveTime(memberId);
        if (!active) {
          await mysqli.query(
            'UPDATE tbl_x_member_total SET amount = amount - 1 WHERE member_id = ?',
            [memberId],
          );
          await mysqli.query(
            'INSERT INTO tbl_x_member_time (member_id, card_id, start, stop, create_date) VALUES (?, ?, ?, ?, ?)',
            [memberId, -1, now, addOneDayString(now), now],
          );
        }
      }
    }
  }

  if (!type) {
    const err = new Error('Invalid member type');
    err.code = 'INVALID_MEMBER';
    throw err;
  }

  // corporate flag: any sub record for this member
  const [corpRows] = await mysqli.query(
    'SELECT sub_id FROM tbl_x_member_sub WHERE sub_id = ? LIMIT 1',
    [memberId],
  );
  if (corpRows.length === 1) corporate = true;

  const usable = type === 'master'
    ? amount > 0
    : await hasActiveTime(memberId);

  const infoText = await buildInfoText(memberId, type);

  return {
    member,
    type,
    corporate,
    usable,
    amount,
    infoText,
    isAdmin: member.is_admin == 1,
  };
}

module.exports = {
  resolveAccount,
  getMemberById,
  hasActiveTime,
  getLatestTime,
};
