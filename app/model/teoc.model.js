const mysqli = require('../config/mysqli.config');

const PROVINCES = [
  'กระบี่', 'กรุงเทพมหานคร', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
  'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่',
  'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช',
  'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี',
  'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา',
  'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต', 'มหาสารคาม',
  'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
  'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
  'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี',
  'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ',
  'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี',
];

const ROUNDS = [
  {
    name: 'รอบที่ 1',
    subtitle: '16 พฤษภาคม - 31 ธันวาคม 2568',
    icon: 'fa-flag-checkered',
    start: '2025-05-16 00:00:00',
    end: '2025-12-31 23:59:59',
  },
  {
    name: 'รอบที่ 2 ชิงแชมป์จังหวัด',
    subtitle: '1 มกราคม - 31 เมษายน2568',
    icon: 'fa-map-location-dot',
    start: '2026-11-01 00:00:00',
    end: '2025-11-30 23:59:59',
  },
  {
    name: 'รอบที่ 3 ชิงแชมป์ภาคการศึกษา',
    subtitle: '15-31 มกราคม 2569',
    icon: 'fa-graduation-cap',
    start: '2026-01-15 00:00:00',
    end: '2026-01-31 23:59:59',
  },
  {
    name: 'รอบสุดท้าย ชิงแชมป์ประเทศไทย',
    subtitle: '14 กุมภาพันธ์ 2569',
    icon: 'fa-crown',
    start: '2026-02-14 00:00:00',
    end: '2026-02-14 23:59:59',
  },
];

/**
 * แยกชื่อจังหวัดจากที่อยู่ โดยตัดคำนำหน้าและค้นหาจากท้ายสุดไปหน้า
 */
function extractProvince(address) {
  if (!address) {
    return 'ไม่ทราบจังหวัด';
  }

  let text = String(address).trim();
  text = text.replace(/จ\.|จังหวัด|อ\.|อำเภอ|ต\.|ตำบล/g, '');
  const words = text.split(/[\s,]+/).filter(Boolean);

  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i].trim();
    for (const province of PROVINCES) {
      if (
        province.toLowerCase().includes(word.toLowerCase()) ||
        word.toLowerCase().includes(province.toLowerCase())
      ) {
        return province;
      }
    }
  }

  return 'ไม่ทราบจังหวัด';
}

/**
 * จัดรูปแบบวันที่เป็น dd/mm/yyyy HH:mm
 */
function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * คำนวณอันดับจากข้อมูลทั้งหมด พร้อมจัดการกรณีคะแนนเท่ากัน
 */
function computeRanks(allData) {
  const rankMap = new Map();
  let displayRank = 1;
  let actualPosition = 0;
  let prevScore = null;
  let sameScoreCount = 0;
  let hasTie = false;

  for (const row of allData) {
    actualPosition++;
    const currentScore = Number(row.max_percent).toFixed(2);

    if (prevScore !== null && currentScore === prevScore) {
      sameScoreCount++;
      hasTie = true;
    } else {
      displayRank = actualPosition;
      sameScoreCount = 0;
    }

    prevScore = currentScore;

    let rank = String(displayRank);
    if (sameScoreCount > 0) {
      rank += '*';
    }

    const rankClass =
      displayRank === 1
        ? 'badge-rank-1'
        : displayRank === 2
          ? 'badge-rank-2'
          : displayRank === 3
            ? 'badge-rank-3'
            : 'bg-secondary';

    rankMap.set(row.member_id, { rank, rankClass });
  }

  return { rankMap, hasTie };
}

/**
 * สรุปจำนวนผู้ผ่านด่านแยกตามจังหวัด จากข้อมูลทั้งหมด
 */
function buildProvinceCounts(allData) {
  const counts = {};
  for (const row of allData) {
    const province = row.province || 'ไม่ทราบจังหวัด';
    counts[province] = (counts[province] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count);
}

module.exports = {
  ROUNDS,

  /**
   * ดึงข้อมูลผู้ผ่านด่าน TEOC ทั้ง 4 รอบ
   */
  getRounds: async (search = '', round = -1) => {
    const searchTerm = String(search).trim();
    const searchLower = searchTerm.toLowerCase();
    const searchRound = parseInt(round, 10);

    const sql = `
      SELECT
        m.member_id,
        m.fname,
        m.lname,
        m.address,
        MAX(r.percent) AS max_percent,
        MIN(r.create_date) AS create_date
      FROM tbl_x_member m
      INNER JOIN tbl_w_result r ON m.member_id = r.member_id
      WHERE r.percent >= 50
        AND r.level_id <= 3
        AND r.skill_id IN (1, 2, 3, 4, 5, 7)
        AND r.create_date >= ?
        AND r.create_date <= ?
      GROUP BY m.member_id, m.fname, m.lname, m.address
      HAVING COUNT(DISTINCT CONCAT(r.skill_id, '-', r.level_id)) = 18
      ORDER BY max_percent DESC, create_date ASC
    `;

    const rounds = [];

    for (const [index, roundDef] of ROUNDS.entries()) {
      const [rows] = await mysqli.query(sql, [roundDef.start, roundDef.end]);

      const allData = rows.map((row) => ({
        ...row,
        province: extractProvince(row.address),
      }));

      const provinceCounts = buildProvinceCounts(allData);
      const { rankMap } = computeRanks(allData);

      let displayData = allData;
      if (searchLower && searchRound === index) {
        displayData = allData.filter((row) => {
          const memberId = String(row.member_id || '').toLowerCase();
          const fname = String(row.fname || '').toLowerCase();
          const lname = String(row.lname || '').toLowerCase();
          const fullName = `${fname} ${lname}`.trim();

          return (
            memberId.includes(searchLower) ||
            fname.includes(searchLower) ||
            lname.includes(searchLower) ||
            fullName.includes(searchLower)
          );
        });
      }

      const results = displayData.map((row) => {
        const rankInfo = rankMap.get(row.member_id) || {
          rank: '-',
          rankClass: 'bg-secondary',
        };
        const fullName = `${row.fname || ''} ${row.lname || ''}`.trim() || '-';

        return {
          rank: rankInfo.rank,
          rankClass: rankInfo.rankClass,
          memberId: row.member_id,
          fullName,
          province: row.province,
          score: Number(row.max_percent),
          date: formatDate(row.create_date),
        };
      });

      rounds.push({
        index,
        name: roundDef.name,
        subtitle: roundDef.subtitle,
        icon: roundDef.icon,
        total: allData.length,
        provinceCounts,
        results,
      });
    }

    return {
      search: searchTerm,
      round: Number.isNaN(searchRound) ? -1 : searchRound,
      rounds,
    };
  },
};
