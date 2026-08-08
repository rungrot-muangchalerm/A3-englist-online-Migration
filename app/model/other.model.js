const mysqli = require('../config/mysqli.config');

function formatText(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const SCHOOL_CATEGORIES = [
  {
    key: 'school',
    title: 'โรงเรียน',
    sql: "school_name LIKE ? AND school_name NOT LIKE ?",
    params: ['โรงเรียน%', '%ศูนย์การศึกษานอกระบบ%'],
  },
  {
    key: 'higher_education',
    title: 'อุดมศึกษา',
    sql: "(school_name LIKE ? OR school_name LIKE ?)",
    params: ['มหาวิทยาลัย%', 'วิทยาลัย%'],
  },
  {
    key: 'non_formal',
    title: 'การศึกษานอกระบบ',
    sql: "(school_name LIKE ? OR school_name LIKE ?)",
    params: ['ศูนย์การศึกษานอกระบบ%', 'กศน_%'],
  },
  {
    key: 'organization',
    title: 'องค์กร',
    sql: "(school_name LIKE ? OR school_name LIKE ? OR school_name LIKE ?)",
    params: ['องค์กร%', 'บริษัท%', 'สำนักงาน%'],
  },
];

module.exports = {
  /**
   * ดึงรายชื่อลูกค้าที่ใช้บริการ EOL System แบ่งตามหมวดหมู่
   */
  schoolList: async () => {
    const categories = await Promise.all(
      SCHOOL_CATEGORIES.map(async (category) => {
        const sql = `
          SELECT school_name
          FROM tbl_web_school
          WHERE is_active = 1 AND ${category.sql}
          ORDER BY school_name ASC
        `;
        const [rows] = await mysqli.query(sql, category.params);

        return {
          key: category.key,
          title: category.title,
          items: rows.map(row => ({
            name: formatText(row.school_name),
            display_name: formatText(row.school_name),
          })),
        };
      })
    );

    return {
      status: '200',
      type: 'school',
      title: 'รายชื่อลูกค้าที่ใช้บริการ EOL System',
      categories,
    };
  },

  /**
   * ดึงความคิดเห็นของผู้ใช้บริการ EOL System
   */
  feedbackList: async () => {
    const sql = `
      SELECT feedback_id, feedback_detail
      FROM tbl_web_feedback
      WHERE is_active = 1
      ORDER BY feedback_id ASC
    `;
    const [rows] = await mysqli.query(sql);

    return {
      status: '200',
      type: 'feedback',
      title: 'ความคิดเห็นของผู้ใช้บริการ EOL System',
      items: rows.map((row, index) => ({
        index,
        detail: formatText(row.feedback_detail),
        row_class: index % 2 === 0 ? 'even' : 'odd',
      })),
    };
  },
};
