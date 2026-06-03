import { get, run, query } from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Basic counter query metrics
    const totalUsers = await get("SELECT COUNT(*) as count FROM users WHERE role = 'CITIZEN'");
    const totalSubmitted = await get("SELECT COUNT(*) as count FROM census_responses WHERE status = 'SUBMITTED'");
    const totalApproved = await get("SELECT COUNT(*) as count FROM census_responses WHERE status = 'APPROVED'");
    const totalRejected = await get("SELECT COUNT(*) as count FROM census_responses WHERE status = 'REJECTED'");
    const totalDrafts = await get("SELECT COUNT(*) as count FROM census_responses WHERE status = 'DRAFT'");

    // Demographics count examples (gender split)
    const genderStats = await query(`
      SELECT personal_gender as gender, COUNT(*) as count 
      FROM census_responses 
      WHERE personal_gender IS NOT NULL AND personal_gender != '' 
      GROUP BY personal_gender
    `);

    // State split
    const stateStats = await query(`
      SELECT address_state as state, COUNT(*) as count 
      FROM census_responses 
      WHERE address_state IS NOT NULL AND address_state != '' 
      GROUP BY address_state
    `);

    // Recent submissions
    const recentSubmissions = await query(`
      SELECT r.id, r.personal_fullName as fullName, r.identity_aadhaar as aadhaar, r.status, r.submittedAt, r.step
      FROM census_responses r
      ORDER BY r.updatedAt DESC
      LIMIT 10
    `);

    return res.status(200).json({
      stats: {
        totalCitizens: totalUsers.count,
        submitted: totalSubmitted.count,
        approved: totalApproved.count,
        rejected: totalRejected.count,
        drafts: totalDrafts.count
      },
      demographics: {
        gender: genderStats,
        state: stateStats
      },
      recentSubmissions
    });
  } catch (error) {
    next(error);
  }
};

export const listCitizens = async (req, res, next) => {
  const { search = '', status = '', limit = 50, offset = 0 } = req.query;

  try {
    let sql = `
      SELECT r.id, r.userId, r.personal_fullName as fullName, r.identity_aadhaar as aadhaar, r.status, r.step, r.submittedAt, r.updatedAt, u.createdAt
      FROM census_responses r
      JOIN users u ON r.userId = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (r.personal_fullName LIKE ? OR r.identity_aadhaar LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      sql += ' AND r.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY r.updatedAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const citizens = await query(sql, params);

    return res.status(200).json({ citizens });
  } catch (error) {
    next(error);
  }
};

export const getCitizenDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    const census = await get('SELECT * FROM census_responses WHERE id = ?', [id]);
    if (!census) {
      return res.status(404).json({ message: 'Census registration not found.' });
    }

    const family = await query('SELECT * FROM family_members WHERE censusResponseId = ?', [census.id]);
    const documents = await query('SELECT id, documentType, fileName, filePath FROM uploaded_documents WHERE censusResponseId = ?', [census.id]);

    return res.status(200).json({
      census,
      family,
      documents
    });
  } catch (error) {
    next(error);
  }
};

export const reviewCensus = async (req, res, next) => {
  const { id } = req.params;
  const { action, comments } = req.body; // action: 'APPROVE' or 'REJECT'

  if (!action || !['APPROVE', 'REJECT'].includes(action)) {
    return res.status(400).json({ message: 'Invalid review action. Must be APPROVE or REJECT.' });
  }

  try {
    const census = await get('SELECT * FROM census_responses WHERE id = ?', [id]);
    if (!census) {
      return res.status(404).json({ message: 'Census record not found.' });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await run(
      'UPDATE census_responses SET status = ?, officerComments = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, comments || '', id]
    );

    return res.status(200).json({
      message: `Census response successfully reviewed: ${newStatus}`,
      status: newStatus
    });
  } catch (error) {
    next(error);
  }
};
