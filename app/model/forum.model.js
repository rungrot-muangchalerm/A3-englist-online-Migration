const mysqli = require('../config/mysqli.config');

const ALLOWED_TYPE_IDS = [
  '02-01', '02-02', '03-01', '03-12', '03-10', '03-03', '03-11', '03-15',
  '03-08', '03-07', '03-05', '03-09', '03-13', '03-16', '03-02', '05-04',
  '07-02', '07-03', '07-04', '07-05', '07-06', '07-07',
];

const TYPE_NAME_MAP = {
  '03-01': 'One day One sentence',
  '03-12': 'English From News',
  '03-10': 'Easy English',
  '03-11': 'Comprehensive Listening',
  '03-03': 'Communicative English',
  '03-15': 'Grammar & Writing',
  '03-08': 'Pronunciation & Phonetic',
  '03-07': 'Song of Souls',
  '03-05': 'Movie World',
  '03-09': 'Gripping Variety',
  '03-13': 'English Idioms',
  '03-16': 'English Slangs',
  '03-02': 'Thais English',
  '05-04': 'Trendy Movie',
  '02-01': 'Event Gallery',
  '02-02': 'ข่าวประชาสัมพันธ์',
  '07-02': 'Admission',
  '07-03': 'CU-TEP',
  '07-04': 'TU-GET',
  '07-05': 'TOEFL',
  '07-06': 'TOEIC',
  '07-07': 'IELTS',
};

module.exports = {
  ALLOWED_TYPE_IDS,
  TYPE_NAME_MAP,

  /**
   * ดึงรายการ topic สำหรับหน้า forum list พร้อม pagination
   */
  list: async ({ type_id, page = 1, rowsPerPage = 7 }) => {
    const safeTypeId = ALLOWED_TYPE_IDS.includes(type_id) ? type_id : '03-01';
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const limit = parseInt(rowsPerPage, 10) || 7;
    const offset = (currentPage - 1) * limit;

    // ตรวจสอบว่ามี type_id ใน tbl_web_type จริง
    const [[typeRow]] = await mysqli.query(
      'SELECT type_name FROM tbl_web_type WHERE type_id = ?',
      [safeTypeId]
    );

    let typeName = TYPE_NAME_MAP[safeTypeId] || 'One day One sentence';
    if (!typeRow || !typeRow.type_name) {
      typeName = 'One day One sentence';
    }

    // เงื่อนไข type_id (รวม proverb/slang/idioms สำหรับ 03-03)
    let typeCondition;
    const typeParams = [];
    if (safeTypeId === '03-03') {
      typeCondition = "t.type_id IN (?, ?, ?)";
      typeParams.push('03-03', '03-13', '03-16');
    } else {
      typeCondition = "t.type_id = ?";
      typeParams.push(safeTypeId);
    }

    // นับจำนวน row ทั้งหมด
    const countSql = `
      SELECT COUNT(*) AS total
      FROM tbl_web_topic t
      WHERE ${typeCondition} AND t.topic_active = '1'
    `;
    const [[countRow]] = await mysqli.query(countSql, typeParams);
    const totalRows = countRow ? countRow.total : 0;
    const totalPages = Math.ceil(totalRows / limit) || 1;

    // ดึงรายการตามหน้า
    const sql = `
      SELECT
        t.topic_id,
        t.topic_name,
        t.topic_headline,
        t.topic_image,
        t.topic_view,
        t.topic_create,
        t.type_id,
        a.nickname AS author_nickname
      FROM tbl_web_topic t
      LEFT JOIN tbl_web_admin a ON t.admin_id = a.admin_id
      WHERE ${typeCondition} AND t.topic_active = '1'
      ORDER BY t.topic_id DESC
      LIMIT ? OFFSET ?
    `;
    const [topics] = await mysqli.query(sql, [...typeParams, limit, offset]);

    const now = new Date();
    const topicsEnriched = topics.map((topic) => {
      const create = topic.topic_create ? new Date(topic.topic_create) : null;
      const diffDays = create && !Number.isNaN(create.getTime())
        ? Math.floor((now - create) / (1000 * 60 * 60 * 24))
        : 999;
      const { topic_image, ...rest } = topic;
      return {
        ...rest,
        is_new: diffDays <= 14,
        topic_create_display: formatDate(topic.topic_create),
        topic_image_url: topic_image
          ? `/assets/2010/user_images/${topic_image}`
          : '/assets/images/image2/logo/logo-02.ico',
        detail_url: `/forum/detail?type_id=${topic.type_id}&topic_id=${topic.topic_id}`,
      };
    });

    return {
      type_id: safeTypeId,
      type_name: typeName,
      page: currentPage,
      rows_per_page: limit,
      total_rows: totalRows,
      total_pages: totalPages,
      topics: topicsEnriched,
    };
  },
};

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
