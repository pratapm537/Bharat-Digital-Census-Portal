import { get, run, query } from '../config/db.js';

export const getCensusDraft = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const draft = await get('SELECT * FROM census_responses WHERE userId = ?', [userId]);

    if (!draft) {
      return res.status(404).json({ message: 'No census draft found for this user.' });
    }

    // Fetch associated family members
    const family = await query('SELECT * FROM family_members WHERE censusResponseId = ?', [draft.id]);

    // Fetch associated uploaded documents
    const documents = await query('SELECT id, documentType, fileName FROM uploaded_documents WHERE censusResponseId = ?', [draft.id]);

    return res.status(200).json({
      draft,
      family,
      documents
    });
  } catch (error) {
    next(error);
  }
};

export const saveCensusStep = async (req, res, next) => {
  const userId = req.user.id;
  // Cast to integer — SQLite and JSON serialization can produce strings
  const step = parseInt(req.body.step, 10);
  const data = req.body.data;

  if (!step || isNaN(step) || step < 1 || step > 10) {
    return res.status(400).json({ message: 'Invalid step number. Must be between 1 and 10.' });
  }

  try {
    const draft = await get('SELECT id, status, step FROM census_responses WHERE userId = ?', [userId]);
    if (!draft) {
      return res.status(404).json({ message: 'No census record found.' });
    }

    if (draft.status !== 'DRAFT' && draft.status !== 'REJECTED') {
      return res.status(400).json({ message: 'Cannot edit census. Form is already submitted and under review.' });
    }

    // Parse step data and update DB fields dynamically
    let updateFields = [];
    let params = [];

    if (step === 1) {
      // Step 1: Personal Details
      updateFields = [
        'personal_fullName = ?',
        'personal_dob = ?',
        'personal_gender = ?',
        'personal_maritalStatus = ?',
        'personal_nationality = ?'
      ];
      params = [
        data.fullName || '',
        data.dob || '',
        data.gender || '',
        data.maritalStatus || '',
        data.nationality || 'Indian'
      ];
    } else if (step === 2) {
      // Step 2: Identity Proof
      updateFields = ['identity_aadhaar = ?'];
      params = [data.aadhaar || ''];
    } else if (step === 3) {
      // Step 3: Contact Details
      updateFields = ['contact_email = ?', 'contact_phone = ?'];
      params = [data.email || '', data.phone || ''];
    } else if (step === 4) {
      // Step 4: Address Details
      updateFields = [
        'address_state = ?',
        'address_district = ?',
        'address_subDistrict = ?',
        'address_pinCode = ?',
        'address_houseDetails = ?'
      ];
      params = [
        data.state || '',
        data.district || '',
        data.subDistrict || '',
        data.pinCode || '',
        data.houseDetails || ''
      ];
    } else if (step === 5) {
      // Step 5: Family Structure
      // Sync family members array to the DB
      const familyList = data.family || [];
      
      // Delete old members
      await run('DELETE FROM family_members WHERE censusResponseId = ?', [draft.id]);
      
      // Insert new members
      for (const member of familyList) {
        if (member.fullName) {
          await run(
            'INSERT INTO family_members (censusResponseId, fullName, dob, gender, relationship, aadhaar) VALUES (?, ?, ?, ?, ?, ?)',
            [draft.id, member.fullName, member.dob || '', member.gender || '', member.relationship || '', member.aadhaar || '']
          );
        }
      }
    } else if (step === 6) {
      // Step 6: Education details
      updateFields = [
        'education_literacy = ?',
        'education_highestLevel = ?',
        'education_languages = ?'
      ];
      params = [
        data.literacy || '',
        data.highestLevel || '',
        data.languages || ''
      ];
    } else if (step === 7) {
      // Step 7: Employment
      updateFields = [
        'employment_occupation = ?',
        'employment_industry = ?'
      ];
      params = [
        data.occupation || '',
        data.industry || ''
      ];
    } else if (step === 8) {
      // Step 8: Housing Details
      updateFields = [
        'housing_type = ?',
        'housing_lighting = ?',
        'housing_water = ?',
        'housing_ownership = ?'
      ];
      params = [
        data.type || '',
        data.lighting || '',
        data.water || '',
        data.ownership || ''
      ];
    } else if (step === 9) {
      // Step 9: Health Details
      updateFields = [
        'health_disabilities = ?',
        'health_illnesses = ?',
        'health_insurance = ?'
      ];
      params = [
        data.disabilities || '',
        data.illnesses || '',
        data.insurance || ''
      ];
    } else if (step === 10) {
      // Step 10: Final Submission
      updateFields = [
        'status = ?',
        'submittedAt = ?'
      ];
      params = [
        'SUBMITTED',
        new Date().toISOString()
      ];
    }

    // Always update the progress step index if it is higher than the current step
    // Cast draft.step to integer — SQLite node driver returns column values as strings
    const currentStep = parseInt(draft.step, 10) || 1;
    let nextStep = step + 1;
    if (nextStep > 10) nextStep = 10;

    const newStep = nextStep > currentStep ? nextStep : currentStep;

    updateFields.push('step = ?');
    params.push(newStep);

    updateFields.push('updatedAt = CURRENT_TIMESTAMP');

    if (updateFields.length > 1) { // includes 'step = ?'
      const sql = `UPDATE census_responses SET ${updateFields.join(', ')} WHERE id = ?`;
      params.push(draft.id);
      await run(sql, params);
    }

    return res.status(200).json({
      message: `Step ${step} saved successfully`,
      nextStep: newStep
    });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req, res, next) => {
  const userId = req.user.id;
  const { documentType } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  if (!documentType) {
    return res.status(400).json({ message: 'documentType is required.' });
  }

  try {
    const draft = await get('SELECT id FROM census_responses WHERE userId = ?', [userId]);
    if (!draft) {
      return res.status(404).json({ message: 'Census record not found.' });
    }

    // Save document details
    await run(
      'INSERT INTO uploaded_documents (censusResponseId, documentType, fileName, filePath) VALUES (?, ?, ?, ?)',
      [draft.id, documentType, req.file.originalname, req.file.path]
    );

    return res.status(200).json({
      message: 'Document uploaded successfully',
      fileName: req.file.originalname,
      documentType
    });
  } catch (error) {
    next(error);
  }
};

export const downloadCertificate = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const response = await get('SELECT * FROM census_responses WHERE userId = ?', [userId]);
    if (!response) {
      return res.status(404).json({ message: 'No census details found.' });
    }

    if (response.status !== 'APPROVED') {
      return res.status(403).json({ message: 'Certificate only available once your census application is APPROVED by the verifying officer.' });
    }

    const refNumber = `IN-CENSUS-${String(response.id).padStart(8, '0')}`;
    const issueDate = new Date(response.updatedAt).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const citizenName = response.personal_fullName || req.user.fullName;
    const aadhaarRedacted = `XXXX-XXXX-${response.identity_aadhaar ? response.identity_aadhaar.slice(-4) : 'XXXX'}`;

    // SVG Template for the certificate
    const svgCertificate = `
<svg width="800" height="560" viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b2447" />
      <stop offset="100%" stop-color="#000f27" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bf953f" />
      <stop offset="50%" stop-color="#fcf6ba" />
      <stop offset="100%" stop-color="#b38728" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <drop-shadow dx="0" dy="4" stdDeviation="6" flood-color="#0b2447" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Border & Background -->
  <rect x="15" y="15" width="770" height="530" rx="8" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="6" />
  <rect x="25" y="25" width="750" height="510" rx="6" fill="#f8fafc" stroke="#0b2447" stroke-width="1" />

  <!-- Corner Decorative Accents -->
  <path d="M 25 65 L 65 25" stroke="url(#goldGrad)" stroke-width="3" />
  <path d="M 775 65 L 735 25" stroke="url(#goldGrad)" stroke-width="3" />
  <path d="M 25 495 L 65 535" stroke="url(#goldGrad)" stroke-width="3" />
  <path d="M 775 495 L 735 535" stroke="url(#goldGrad)" stroke-width="3" />

  <!-- Header Seal Mockup -->
  <circle cx="400" cy="90" r="30" fill="url(#navyGrad)" />
  <path d="M 390 95 L 400 80 L 410 95 Z" fill="#ff9933" />
  <circle cx="400" cy="93" r="5" fill="#138808" />
  <text x="400" y="132" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="#0b2447" text-anchor="middle">GOVERNMENT OF INDIA</text>
  <text x="400" y="146" font-family="'Inter', sans-serif" font-size="10" fill="#74777f" text-anchor="middle">MINISTRY OF HOME AFFAIRS</text>

  <!-- Certificate Title -->
  <text x="400" y="200" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="url(#navyGrad)" text-anchor="middle" letter-spacing="1">DIGITAL CENSUS CERTIFICATE</text>
  <line x1="280" y1="212" x2="520" y2="212" stroke="url(#goldGrad)" stroke-width="2" />

  <!-- Verification Statement -->
  <text x="400" y="250" font-family="'Inter', sans-serif" font-size="14" fill="#191c1e" text-anchor="middle">This is to certify that the household census registration for</text>
  <text x="400" y="285" font-family="'Inter', sans-serif" font-size="20" font-weight="bold" fill="#000f27" text-anchor="middle">${citizenName}</text>
  <text x="400" y="315" font-family="'Inter', sans-serif" font-size="14" fill="#191c1e" text-anchor="middle">bearing Aadhaar Number <tspan font-weight="bold">${aadhaarRedacted}</tspan></text>
  <text x="400" y="340" font-family="'Inter', sans-serif" font-size="14" fill="#191c1e" text-anchor="middle">has been successfully documented, verified, and recorded in the</text>
  <text x="400" y="365" font-family="'Inter', sans-serif" font-size="15" font-weight="bold" fill="#138808" text-anchor="middle">National Citizen Census Registry of India</text>

  <!-- Details Block -->
  <rect x="150" y="400" width="500" height="50" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  
  <text x="180" y="420" font-family="'Inter', sans-serif" font-size="10" font-weight="bold" fill="#74777f">CERTIFICATE REF NO.</text>
  <text x="180" y="438" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="#0b2447">${refNumber}</text>

  <text x="480" y="420" font-family="'Inter', sans-serif" font-size="10" font-weight="bold" fill="#74777f">DATE OF VERIFICATION</text>
  <text x="480" y="438" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="#0b2447">${issueDate}</text>

  <!-- Signatures -->
  <path d="M 620 488 C 630 480, 640 480, 650 488 C 660 495, 670 495, 680 488" stroke="#0b2447" stroke-width="1.5" fill="none" />
  <line x1="580" y1="500" x2="700" y2="500" stroke="#c4c6cf" stroke-width="1" />
  <text x="640" y="515" font-family="'Inter', sans-serif" font-size="9" fill="#74777f" text-anchor="middle">Registrar General, Census India</text>

  <circle cx="100" cy="460" r="25" fill="#34a025" fill-opacity="0.1" stroke="#34a025" stroke-dasharray="3,3" />
  <text x="100" y="464" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" fill="#138808" text-anchor="middle">VERIFIED</text>
</svg>
`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${refNumber}.svg"`);
    return res.status(200).send(svgCertificate);
  } catch (error) {
    next(error);
  }
};
