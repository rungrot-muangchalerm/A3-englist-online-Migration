const mysqli = require('../config/mysqli.config');

const DETAIL_ALLOWED_TYPE_IDS = [
  '03-01', '03-09', '03-03', '03-11', '03-07', '03-05', '03-15', '03-12',
  '03-10', '03-08', '02-01', '02-02', '02-03', '02-06', '07-02', '07-03',
  '07-04', '07-05', '07-06', '07-07',
];

const TYPE_NAME_MAP = {
  '03-01': 'One day One sentence',
  '03-09': 'Sporty Sport',
  '03-03': 'Communicative English',
  '03-11': 'Effective Writing',
  '03-07': 'Songs of Souls',
  '03-05': 'Movie World',
  '03-15': 'Grammar & Writing',
  '03-12': 'English from news',
  '03-10': 'Easy English',
  '03-08': 'Pronunciation & Phonetic',
  '02-01': 'Event Gallery',
  '02-02': 'ข่าวประชาสัมพันธ์',
  '02-03': 'EOL Contest',
  '02-06': 'โครงการพิเศษ',
  '07-02': 'Admission',
  '07-03': 'CU-TEP',
  '07-04': 'TU-GET',
  '07-05': 'TOEFL',
  '07-06': 'TOEIC',
  '07-07': 'IELTS',
};

const TYPE_ID_MAP = {
  activity: '02-01',
  news_events: '02-02',
  one_day_one_sentence: '03-01',
  idiom: '03-03',
  scholarship: '03-02',
  uthai: '03-04',
  government: '04-01',
  weak: '04-02',
  education: '04-03',
  world: '04-04',
  sport: '04-05',
  life: '05-01',
  health: '05-02',
  travel: '05-03',
  movie: '05-04',
  music: '05-05',
  song: '03-07',
  x_movie: '03-05',
  impressive_quote: '03-08',
  x_sport: '03-09',
  easy_english: '03-10',
  effective_writing: '03-11',
  english_from_news: '03-12',
  slangs: '03-13',
  everyday: '03-15',
};

function enrichTopic(topic) {
  if (!topic) return topic;
  const imageFile = topic.topic_image || `${topic.topic_id}.jpg`;
  return {
    ...topic,
    image_url: `/2010/user_images/${imageFile}?v=1`,
    detail_url: `/forum/detail?type_id=${topic.type_id}&topic_id=${topic.topic_id}`,
    display_name: topic.topic_name && topic.topic_name.length > 120
      ? `${topic.topic_name.substring(0, 100)}...`
      : topic.topic_name,
    headline: topic.topic_headline || '',
    author_name: topic.author_nickname || 'EOL Admin',
    msg_date: topic.topic_create
      ? new Date(topic.topic_create).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    view_count: Number(topic.topic_view || 0).toLocaleString(),
  };
}

module.exports = {
  TYPE_ID_MAP,

  /**
   * ดึงรายการ topic ตาม type_id
   */
  list: async ({ type_id, active = '1', limit = 10, order = 'DESC' }) => {
    const sql = `
      SELECT
        t.topic_id,
        t.topic_name,
        t.topic_headline,
        t.topic_image,
        t.topic_view,
        t.topic_create,
        t.topic_update,
        t.type_id,
        a.nickname AS author_nickname
      FROM tbl_web_topic t
      LEFT JOIN tbl_web_admin a ON t.admin_id = a.admin_id
      WHERE t.type_id = ? AND t.topic_active = ?
      ORDER BY t.topic_id ${order === 'ASC' ? 'ASC' : 'DESC'}
      LIMIT ?
    `;
    const [rows] = await mysqli.query(sql, [type_id, active, limit]);
    return rows.map(enrichTopic);
  },

  /**
   * หา type_id ที่มีการอัปเดตภายใน 7 วัน (สำหรับ badge NEW)
   */
  recentUpdates: async () => {
    const sql = `
      SELECT type_id, MAX(topic_create) AS last_update
      FROM tbl_web_topic
      WHERE topic_active = '1'
      GROUP BY type_id
      HAVING last_update >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `;
    const [rows] = await mysqli.query(sql);
    return rows;
  },

  /**
   * ดึง Magazine Showcase ล่าสุด โดยยกเว้น type_id บางประเภท
   */
  /**
   * ดึงรายละเอียด topic พร้อมเพิ่ม view count
   */
  detail: async ({ type_id, topic_id }) => {
    const safeTypeId = DETAIL_ALLOWED_TYPE_IDS.includes(type_id) ? type_id : null;
    const safeTopicId = /^\d+$/.test(String(topic_id)) ? String(topic_id) : null;

    if (!safeTypeId || !safeTopicId) {
      return null;
    }

    // เพิ่ม view count
    await mysqli.query(
      'UPDATE tbl_web_topic SET topic_view = topic_view + 1 WHERE topic_id = ?',
      [safeTopicId]
    );

    const sql = `
      SELECT
        t.topic_id,
        t.type_id,
        t.topic_name,
        t.topic_headline,
        t.topic_detail,
        t.topic_image,
        t.topic_view,
        t.topic_create,
        a.nickname AS author_nickname
      FROM tbl_web_topic t
      LEFT JOIN tbl_web_admin a ON t.admin_id = a.admin_id
      WHERE t.type_id = ? AND t.topic_id = ? AND t.topic_active = '1'
      LIMIT 1
    `;
    const [rows] = await mysqli.query(sql, [safeTypeId, safeTopicId]);
    const topic = rows[0] || null;

    if (topic) {
      topic.category_name = TYPE_NAME_MAP[safeTypeId] || '';
    }

    const enriched = enrichTopic(topic);
    if (enriched) {
      enriched.image_url = `/assets/2010/user_images/${topic.topic_image || `${topic.topic_id}.jpg`}?v=1`;
      enriched.category_url = `/forum/e-eng?type_id=${topic.type_id}`;
      enriched.topic_create_display = formatThaiDate(topic.topic_create);
      enriched.view_count = Number(topic.topic_view || 0).toLocaleString('en-US');
    }

    return enriched;
  },

  /**
   * ดึงข้อมูล EOL English Room cards พร้อม topic ล่าสุดและสถานะ is_new
   */
  englishRoom: async () => {
    const cards = [
      { key: 'one_day_one_sentence', type_id: '03-01', title: 'One day One sentence', icon: 'bi-calendar-check', image: '/assets/images/index/One_day_One_sentence.jpg' },
      { key: 'english_from_news', type_id: '03-12', title: 'English from News', icon: 'bi-newspaper', image: '/assets/images/index/English_From_News.jpg' },
      { key: 'easy_english', type_id: '03-10', title: 'Easy English', icon: 'bi-person-arms-up', image: '/assets/images/index/Easy_English.jpg' },
      { key: 'effective_writing', type_id: '03-11', title: 'Comprehensive Listening', icon: 'bi-heart', image: '/assets/images/index/Comprehensive_Listening.jpg' },
      { key: 'idiom', type_id: '03-03', title: 'Communicative English', icon: 'bi-chat-left-text', image: '/assets/images/index/Proverbs_Slang_Idioms.jpg' },
      { key: 'everyday', type_id: '03-15', title: 'Grammar & Writing', icon: 'bi-chat', image: '/assets/images/index/Everyday_English.jpg' },
      { key: 'impressive_quote', type_id: '03-08', title: 'Pronunciation & Phonetic', icon: 'bi-briefcase', image: '/assets/images/index/Impressive_Quotes.jpg' },
      { key: 'song', type_id: '03-07', title: 'Song of Souls', icon: 'bi-music-note-beamed', image: '/assets/images/index/Songs_for_Soul.jpg' },
      { key: 'x_movie', type_id: '03-05', title: 'Movie World', icon: 'bi-film', image: '/assets/images/index/Trendy_Movies.jpg' },
    ];

    const type_ids = cards.map(card => card.type_id);
    const placeholders = type_ids.map(() => '?').join(',');

    const recentSql = `
      SELECT type_id, MAX(topic_create) AS last_update
      FROM tbl_web_topic
      WHERE topic_active = '1' AND type_id IN (${placeholders})
      GROUP BY type_id
      HAVING last_update >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `;
    const [recentRows] = await mysqli.query(recentSql, type_ids);
    const newMap = {};
    recentRows.forEach(row => { newMap[row.type_id] = true; });

    const topicsSql = `
      SELECT
        t.type_id,
        t.topic_id,
        t.topic_name,
        t.topic_headline,
        t.topic_image,
        t.topic_view,
        t.topic_create,
        a.nickname AS author_nickname
      FROM tbl_web_topic t
      LEFT JOIN tbl_web_admin a ON t.admin_id = a.admin_id
      INNER JOIN (
        SELECT type_id, MAX(topic_id) AS max_topic_id
        FROM tbl_web_topic
        WHERE type_id IN (${placeholders}) AND topic_active = '1'
        GROUP BY type_id
      ) latest ON t.type_id = latest.type_id AND t.topic_id = latest.max_topic_id
    `;
    const [topicRows] = await mysqli.query(topicsSql, type_ids);

    const topicsByType = {};
    topicRows.forEach(row => {
      topicsByType[row.type_id] = enrichTopic(row);
    });

    return cards.map(card => ({
      ...card,
      category_url: `/forum/e-eng?type_id=${card.type_id}`,
      badge_class: newMap[card.type_id] ? '' : 'hidden',
      topic: topicsByType[card.type_id],
    }));
  },

  magazineShowcase: async () => {
    const excludedTypes = [
      '02-01', '02-02', '03-01', '03-02', '03-03', '03-04',
      '04-01', '04-02', '04-03', '04-04', '04-05',
      '05-01', '05-02', '05-03', '05-04', '05-05',
    ];
    const placeholders = excludedTypes.map(() => '?').join(',');

    const sql = `
      SELECT
        t.topic_id,
        t.topic_name,
        t.topic_headline,
        t.topic_image,
        t.topic_view,
        t.topic_update,
        a.nickname AS author_nickname
      FROM tbl_web_topic t
      LEFT JOIN tbl_web_admin a ON t.admin_id = a.admin_id
      WHERE t.topic_active = '1' AND t.type_id NOT IN (${placeholders})
      ORDER BY t.topic_id DESC
      LIMIT 1
    `;
    const [rows] = await mysqli.query(sql, excludedTypes);
    return enrichTopic(rows[0] || null);
  },
};

function formatThaiDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
