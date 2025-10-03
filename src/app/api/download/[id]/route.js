import { Candidate } from '../../../../../models/Candidate';
import { authMiddleware } from '../../../../../lib/auth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generatePDFForDownload(candidateData) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 900]);
  let { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const smallFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let y = height - 50; // Start from top with more space

  // Header Section (Simplified - No Company Logo)
  const drawHeader = () => {
    // Main Title
    page.drawText('CANDIDATE PROFILE FORM', {
      x: 150,
      y,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Underline
    page.drawLine({
      start: { x: 150, y: y - 5 },
      end: { x: 450, y: y - 5 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    y -= 40;
  };

  drawHeader();

  // Main Container with proper spacing
  page.drawRectangle({
    x: 40,
    y: y - 800,
    width: 520,
    height: 820,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Position Section with better spacing
  const drawPositionSection = () => {
    page.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('POSITION APPLIED FOR', {
      x: 180,
      y: y - 12,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= 50;

    // Position Details in 2 columns with proper spacing
    const positionDetails = [
      { label: 'Position Considered:', value: candidateData.positionConsidered || 'N/A' },
      { label: 'Position Considered For:', value: candidateData.positionConsideredFor || 'N/A' },
      { label: 'Total Experience:', value: candidateData.totalExperience || 'N/A' },
      // { label: 'Domain:', value: candidateData.dom || 'N/A' }
    ];

    positionDetails.forEach((detail, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 50 + col * 250;
      const currentY = y - (row * 25);

      page.drawText(detail.label, {
        x: x,
        y: currentY,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      // Value with proper text wrapping
      const valueLines = wrapText(detail.value, 20);
      valueLines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: x + 120,
          y: currentY - (lineIndex * 12),
          size: 10,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: 120,
        });
      });
    });

    y -= 70;
  };

  drawPositionSection();

  // Personal Information Table with improved spacing
  const drawPersonalInfoTable = () => {
    const personalInfo = [
      // { label: 'TITLE:', value: candidateData.title || 'N/A' },
      { label: 'FULL NAME:', value: candidateData.fullName || 'N/A' },
      { label: 'EMAIL ID:', value: candidateData.email || 'N/A' },
      { label: 'MOBILE NO:', value: `${candidateData.countryCode || '+91'} ${candidateData.phone || 'N/A'}` },
      { label: 'DATE OF BIRTH:', value: formatDate(candidateData.dob) || 'N/A' },
      { label: 'GENDER:', value: candidateData.gender || 'N/A' },
      { label: 'QUALIFICATION:', value: candidateData.qualification || 'N/A' },
      { label: 'SKILLS:', value: candidateData.skills || 'N/A' }
    ];

    // Draw table with 2 columns and 4 rows
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        const index = i * 2 + j;
        const x = 50 + j * 250;
        const cellY = y - (i * 30); // Increased row height

        // Cell background
        page.drawRectangle({
          x: x,
          y: cellY - 25,
          width: 250,
          height: 30, // Increased cell height
          borderColor: rgb(0.6, 0.6, 0.6),
          borderWidth: 0.5,
        });

        if (personalInfo[index]) {
          // Label
          page.drawText(personalInfo[index].label, {
            x: x + 8,
            y: cellY - 18,
            size: 9,
            font: boldFont,
            color: rgb(0, 0, 0),
          });

          // Value with text wrapping
          const valueLines = wrapText(personalInfo[index].value, 28);
          valueLines.forEach((line, lineIndex) => {
            page.drawText(line, {
              x: x + 100,
              y: cellY - 18 - (lineIndex * 10),
              size: 9,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
              maxWidth: 160,
            });
          });
        }
      }
    }

    y -= 140; // Adjusted for increased row height
  };

  drawPersonalInfoTable();

  // Current Employment Details with proper spacing
  const drawCurrentEmployment = () => {
    page.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('CURRENT EMPLOYMENT DETAILS', {
      x: 150,
      y: y - 12,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= 50;

    const employmentDetails = [
      { label: 'Current Employer:', value: candidateData.currentEmployer || 'N/A' },
      { label: 'Role at Work:', value: candidateData.roleAtWork || 'N/A' }
    ];

    employmentDetails.forEach((detail, index) => {
      const currentY = y - (index * 25);

      page.drawText(detail.label, {
        x: 50,
        y: currentY,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const valueLines = wrapText(detail.value, 40);
      valueLines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: 180,
          y: currentY - (lineIndex * 12),
          size: 10,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: 320,
        });
      });
    });

    y -= 80;
  };

  drawCurrentEmployment();

  // Address and Photo Section with improved layout
  const drawAddressAndPhoto = async () => {
    // Present Address Header
    page.drawText('PRESENT ADDRESS', {
      x: 50,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Present Address Box
    page.drawRectangle({
      x: 50,
      y: y - 100,
      width: 250,
      height: 90, // Increased height
      borderColor: rgb(0.6, 0.6, 0.6),
      borderWidth: 0.5,
    });

    // Photo Box
    page.drawRectangle({
      x: 420,
      y: y - 120,
      width: 120,
      height: 120,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    page.drawText('Photograph', {
      x: 445,
      y: y - 40,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Add profile image if available
    if (candidateData.profileImage) {
      try {
        const imageBytes = Uint8Array.from(
          Buffer.from(candidateData.profileImage.split(',')[1], 'base64')
        );
        
        let image;
        if (candidateData.profileImage.includes('image/png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }
        
        const maxWidth = 110;
        const maxHeight = 110;
        const { width: imgWidth, height: imgHeight } = image.scale(1);
        
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;
        
        if (imgWidth > maxWidth) {
          const ratio = maxWidth / imgWidth;
          finalWidth = maxWidth;
          finalHeight = imgHeight * ratio;
        }
        
        if (finalHeight > maxHeight) {
          const ratio = maxHeight / finalHeight;
          finalHeight = maxHeight;
          finalWidth = finalWidth * ratio;
        }
        
        page.drawImage(image, {
          x: 425 + (110 - finalWidth) / 2,
          y: y - 115 + (110 - finalHeight) / 2,
          width: finalWidth,
          height: finalHeight,
        });
      } catch (error) {
        console.error('Error embedding image:', error);
      }
    }

    // Present Address Text
    const presentAddress = [
      candidateData.street,
      candidateData.city,
      candidateData.state,
      candidateData.zip
    ].filter(Boolean).join(', ') || 'N/A';
    
    const addressLines = wrapText(presentAddress, 30);
    let addressY = y - 30;
    
    addressLines.forEach(line => {
      if (line.trim()) {
        page.drawText(line, {
          x: 55,
          y: addressY,
          size: 9,
          font: font,
          maxWidth: 240,
        });
        addressY -= 14;
      }
    });

    y -= 140;

    // Permanent Address Header
    page.drawText('PERMANENT ADDRESS', {
      x: 50,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Permanent Address Box
    page.drawRectangle({
      x: 50,
      y: y - 100,
      width: 390,
      height: 90,
      borderColor: rgb(0.6, 0.6, 0.6),
      borderWidth: 0.5,
    });

    const permanentAddress = candidateData.permanentAddress || presentAddress;
    const permAddressLines = wrapText(permanentAddress, 50);
    let permAddressY = y - 30;
    
    permAddressLines.forEach(line => {
      if (line.trim()) {
        page.drawText(line, {
          x: 55,
          y: permAddressY,
          size: 9,
          font: font,
          maxWidth: 380,
        });
        permAddressY -= 14;
      }
    });
    
    y -= 130;
  };

  await drawAddressAndPhoto();

  // Family Details Table with improved spacing
  const drawFamilyTable = () => {
    // Section Header
    page.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('FAMILY DETAILS', {
      x: 200,
      y: y - 12,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= 50;

    // Table Headers
    const headers = ['', 'Name', 'Date of Birth', 'Occupation'];
    const headerWidths = [60, 160, 110, 170];
    let headerX = 50;

    // Header Background
    page.drawRectangle({
      x: 50,
      y: y + 5,
      width: 500,
      height: 25,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Draw Headers
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: headerX + 8,
        y: y + 10,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      headerX += headerWidths[index];
    });

    y -= 20;

    // Family Data
    const familyData = [
      { relation: '1 FATHER', name: candidateData.fatherName, dob: candidateData.fatherDateOfBirth, occupation: candidateData.fatherOccupation },
      { relation: '2 MOTHER', name: candidateData.motherName, dob: candidateData.motherDateOfBirth, occupation: candidateData.motherOccupation },
      { relation: '3 SPOUSE', name: candidateData.spouseName, dob: candidateData.spouseDateOfBirth, occupation: candidateData.spouseOccupation }
    ];

    // Draw Rows with increased height
    familyData.forEach((row, rowIndex) => {
      let cellX = 50;
      
      // Alternate row background
      if (rowIndex % 2 === 0) {
        page.drawRectangle({
          x: 50,
          y: y - 8,
          width: 500,
          height: 25,
          color: rgb(0.95, 0.95, 0.95),
        });
      }

      // Draw cells
      const rowValues = [
        row.relation,
        row.name || 'N/A',
        formatDate(row.dob) || 'N/A',
        row.occupation || 'N/A'
      ];
      
      headerWidths.forEach((width, colIndex) => {
        // Cell border
        page.drawRectangle({
          x: cellX,
          y: y - 8,
          width: width,
          height: 25,
          borderColor: rgb(0.6, 0.6, 0.6),
          borderWidth: 0.3,
        });

        // Cell content with text wrapping
        const cellLines = wrapText(rowValues[colIndex], Math.floor(width / 6));
        cellLines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: cellX + 5,
            y: y + 2 - (lineIndex * 10),
            size: 8,
            font: colIndex === 0 ? boldFont : font,
            color: rgb(0.2, 0.2, 0.2),
            maxWidth: width - 10,
          });
        });

        cellX += width;
      });

      y -= 25;
    });

    y -= 35;
  };

  drawFamilyTable();

  // Check if we need a new page before Education Table
  if (y < 300) {
    page = pdfDoc.addPage([600, 900]);
    y = height - 50;
    drawHeader();
    page.drawRectangle({
      x: 40,
      y: y - 800,
      width: 520,
      height: 820,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    y -= 60;
  }

  // Education Table with improved spacing
  const drawEducationTable = () => {
    // Section Header
    page.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('EDUCATIONAL PROGRESS', {
      x: 180,
      y: y - 12,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= 50;

    // Table Headers
    const eduHeaders = ['S.No.', 'COURSE NAME', 'SCHOOL/INST. Name', 'BOARD / UNIV.', 'Place', '% OR CGPA', 'YOS', 'YOP', 'FT/PT/DL'];
    const eduWidths = [25, 70, 85, 80, 45, 45, 25, 25, 40];
    let headerX = 50;

    // Header Background
    page.drawRectangle({
      x: 50,
      y: y + 5,
      width: 500,
      height: 20,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Draw Headers
    eduHeaders.forEach((header, index) => {
      page.drawText(header, {
        x: headerX + 3,
        y: y + 10,
        size: 7,
        font: boldFont,
        color: rgb(0, 0, 0),
        maxWidth: eduWidths[index] - 6,
      });
      headerX += eduWidths[index];
    });

    y -= 20;

    // Education Data
    const educationEntries = Array.isArray(candidateData.education) ? candidateData.education : [];
    
    // Draw education rows with increased height
    for (let i = 0; i < Math.max(educationEntries.length, 5); i++) {
      const edu = educationEntries[i] || {};
      
      const eduData = [
        `${i + 1}`,
        edu.courseName || '',
        edu.schoolName || '',
        edu.boardUniversity || '',
        edu.place || '',
        edu.percentage || '',
        edu.yos || '',
        edu.yop || '',
        getStudyModeText(edu.studyMode) || ''
      ];

      let cellX = 50;

      // Alternate row background
      if (i % 2 === 0) {
        page.drawRectangle({
          x: 50,
          y: y - 8,
          width: 500,
          height: 20,
          color: rgb(0.95, 0.95, 0.95),
        });
      }

      // Draw cells
      eduWidths.forEach((width, colIndex) => {
        // Cell border
        page.drawRectangle({
          x: cellX,
          y: y - 8,
          width: width,
          height: 20,
          borderColor: rgb(0.6, 0.6, 0.6),
          borderWidth: 0.2,
        });

        // Cell content with text wrapping
        const cellLines = wrapText(eduData[colIndex] || '', Math.floor(width / 4));
        cellLines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: cellX + 2,
            y: y + 2 - (lineIndex * 8),
            size: 6,
            font: font,
            color: rgb(0.2, 0.2, 0.2),
            maxWidth: width - 4,
          });
        });

        cellX += width;
      });

      y -= 20;
    }

    y -= 30;
  };

  drawEducationTable();

  // Experience Summary Grid with better spacing
  const drawExperienceGrid = () => {
    const experiences = [
      { label: 'Total Experience (Yrs.)', value: candidateData.totalExperience || candidateData.totalExperienceYears || '0' },
      { label: 'Exp. In Considered Role (Yrs.)', value: candidateData.expInConsideredRole || '0' },
      { label: 'Exp. With Present Org.', value: candidateData.expWithPresentOrg || '0' },
      { label: 'Avg. Exp. Per Organization', value: candidateData.avgExpPerOrganization || '0' },
      { label: 'Break in Education (Yrs.)', value: candidateData.breakGapInEducationYears || '0' },
      { label: 'Break in Career (Yrs.)', value: candidateData.breakGapInProfCareerYears || '0' },
      { label: 'Team Size:', value: candidateData.teamSize || '0' },
      { label: 'Notice Period (Months):', value: candidateData.noticePeriodMonths || '0' }
    ];

    // Draw 4x2 grid with proper spacing
    experiences.forEach((exp, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const x = 50 + col * 125;
      const currentY = y - (row * 30); // Increased row height

      // Cell background
      page.drawRectangle({
        x: x,
        y: currentY - 22,
        width: 125,
        height: 25, // Increased cell height
        borderColor: rgb(0.6, 0.6, 0.6),
        borderWidth: 0.3,
      });

      // Label with text wrapping
      const labelLines = wrapText(exp.label, 20);
      labelLines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: x + 4,
          y: currentY - 10 - (lineIndex * 9),
          size: 7,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: 117,
        });
      });

      // Value
      page.drawText(exp.value, {
        x: x + 4,
        y: currentY - 20,
        size: 9,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    });

    y -= 70;
  };

  drawExperienceGrid();

  // KRA/KPI and Role Details with proper spacing
  const drawKRADetails = () => {
    page.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('KRA/KPI & ROLE DETAILS', {
      x: 160,
      y: y - 12,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= 50;

    const kraDetails = [
      { label: 'KRA/KPI 1:', value: candidateData.kraKpi1 || 'N/A' },
      { label: 'KRA/KPI 2:', value: candidateData.kraKpi2 || 'N/A' },
      { label: 'KRA/KPI 3:', value: candidateData.kraKpi3 || 'N/A' },
      { label: 'Role in KCR Team:', value: candidateData.roleKcrTeam || 'N/A' }
    ];

    kraDetails.forEach((detail, index) => {
      const currentY = y - (index * 25);

      page.drawText(detail.label, {
        x: 50,
        y: currentY,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const valueLines = wrapText(detail.value, 50);
      valueLines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: 150,
          y: currentY - (lineIndex * 12),
          size: 10,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: 400,
        });
      });
    });

    y -= 120;
  };

  drawKRADetails();

  // Check if we need a new page before Career Table
  if (y < 300) {
    page = pdfDoc.addPage([600, 900]);
    y = height - 50;
    drawHeader();
    page.drawRectangle({
      x: 40,
      y: y - 800,
      width: 520,
      height: 820,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    y -= 60;
  }

  // Career History Table with improved spacing
  // Career History Table with improved spacing and better salary layout
const drawCareerTable = () => {
    // Section Header
    page.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('CAREER CONTOUR (Starting from Present Organization)', {
      x: 80,
      y: y - 12,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= 50;

    // Table Headers - Salary column ko thoda wider kiya
    const careerHeaders = ['S.No.', 'ORGANIZATION', 'DESIGNATION', 'SALARY (CTC in Lacs P.A.)', 'Monthly Take Home', 'FROM', 'TO'];
    const careerWidths = [25, 95, 85, 100, 65, 55, 65]; // Salary width 90 se 100 kiya
    let headerX = 50;

    // Header Background
    page.drawRectangle({
      x: 50,
      y: y + 5,
      width: 500,
      height: 20,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Draw Headers
    careerHeaders.forEach((header, index) => {
      const headerLines = wrapText(header, Math.floor(careerWidths[index] / 5));
      headerLines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: headerX + 3,
          y: y + 12 - (lineIndex * 8),
          size: 6.5,
          font: boldFont,
          color: rgb(0, 0, 0),
          maxWidth: careerWidths[index] - 6,
        });
      });
      headerX += careerWidths[index];
    });

    y -= 25;

    // Career Data
    const careerEntries = Array.isArray(candidateData.careerHistory) ? candidateData.careerHistory : [];
    
    // Draw career history rows with INCREASED HEIGHT for salary section
    for (let i = 0; i < Math.max(careerEntries.length, 7); i++) {
      const career = careerEntries[i] || {};
      
      // Salary information - properly formatted
      const fixedSalary = career.fixedSalary || '';
      const variableSalary = career.variableSalary || '';
      const totalCtc = career.totalCtc || '';

      const careerData = [
        `${i + 1}`,
        career.organization || '',
        career.designation || '',
        '', // Salary data alag se handle karenge
        career.monthlyTakeHome || '',
        formatMonthYear(career.fromDate) || '',
        formatMonthYear(career.toDate) || ''
      ];

      let cellX = 50;

      // Alternate row background - HEIGHT BADHAI (25 se 35)
      if (i % 2 === 0) {
        page.drawRectangle({
          x: 50,
          y: y - 13, // Position adjust kiya
          width: 500,
          height: 35, // Height 25 se 35 kiya
          color: rgb(0.95, 0.95, 0.95),
        });
      }

      // Draw cells with INCREASED HEIGHT
      careerWidths.forEach((width, colIndex) => {
        // Cell border - HEIGHT BADHAI
        page.drawRectangle({
          x: cellX,
          y: y - 13, // Position adjust kiya
          width: width,
          height: 35, // Height 25 se 35 kiya
          borderColor: rgb(0.6, 0.6, 0.6),
          borderWidth: 0.2,
        });

        if (colIndex === 3) { // Salary column - SPECIAL HANDLING
          // Fixed Salary
          if (fixedSalary) {
            page.drawText(`Fixed: ${fixedSalary}`, {
              x: cellX + 3,
              y: y + 8, // Top position
              size: 6,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
              maxWidth: width - 6,
            });
          }
          
          // Variable Salary
          if (variableSalary) {
            page.drawText(`Variable: ${variableSalary}`, {
              x: cellX + 3,
              y: y, // Middle position
              size: 6,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
              maxWidth: width - 6,
            });
          }
          
          // Total CTC (Bold mein)
          if (totalCtc) {
            page.drawText(`Total: ${totalCtc}`, {
              x: cellX + 3,
              y: y - 8, // Bottom position
              size: 6,
              font: boldFont,
              color: rgb(0, 0, 0),
              maxWidth: width - 6,
            });
          }
          
          // Agar koi data nahi hai to "N/A" show karo
          if (!fixedSalary && !variableSalary && !totalCtc) {
            page.drawText('', {
              x: cellX + 3,
              y: y,
              size: 6,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
              maxWidth: width - 6,
            });
          }
        } else {
          // Other columns - normal text with CENTERED alignment
          const cellLines = wrapText(careerData[colIndex] || '', Math.floor(width / 5));
          const totalLines = cellLines.length;
          
          cellLines.forEach((line, lineIndex) => {
            // Vertical center alignment for other columns
            const verticalOffset = (totalLines === 1) ? 0 : (totalLines - 1 - lineIndex) * 4;
            page.drawText(line, {
              x: cellX + 3,
              y: y + 5 - verticalOffset, // Center aligned
              size: 6,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
              maxWidth: width - 6,
            });
          });
        }

        cellX += width;
      });

      y -= 35; // Row height badhane ke liye y position adjust kiya
    }

    y -= 35;
};

  drawCareerTable();

  // Compensation and Final Details with proper spacing
  // Compensation and Final Details - ALWAYS ON FRESH PAGE
const drawCompensationDetails = () => {
  // ALWAYS start compensation section on new page
  page = pdfDoc.addPage([600, 900]);
  y = height - 50;
  drawHeader();
  page.drawRectangle({
    x: 40,
    y: y - 800,
    width: 520,
    height: 820,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  y -= 60;

  // Compensation Header
  page.drawRectangle({
    x: 50,
    y: y - 20,
    width: 500,
    height: 30,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('COMPENSATION & OTHER DETAILS', {
    x: 120,
    y: y - 12,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 50;

  const compensationDetails = [
    { label: 'Present CTC (Fixed & Variable):', value: candidateData.presentCtcFixedAndVariable || 'N/A' },
    { label: 'Present per Month Salary:', value: candidateData.presentPerMonthSalary || 'N/A' },
    { label: 'Any Other Compensation Benefit:', value: candidateData.anyOtherCompensationBenefit || 'N/A' },
    { label: 'Expected CTC:', value: candidateData.expectedCtc || 'N/A' },
    { label: 'Expected per Month Take Home Salary:', value: candidateData.expectedPerMonthTakeHomeSalary || 'N/A' },
    { label: 'Notice Period Negotiated (Days):', value: candidateData.noticePeriodNegotiatedDays || 'N/A' },
    { label: 'Reason for Leaving Last Organization:', value: candidateData.reasonForLeavingLastOrg || 'N/A' }
  ];

  compensationDetails.forEach((detail, detailIndex) => {
    const currentY = y - (detailIndex * 25);

    // Label
    page.drawText(detail.label, {
      x: 50,
      y: currentY,
      size: 9,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Value with text wrapping
    const valueLines = wrapText(detail.value, 40);
    valueLines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 280,
        y: currentY - (lineIndex * 11),
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
        maxWidth: 270,
      });
    });
  });

  y -= 180;

  // Declaration
  page.drawText('I hereby affirm that the information furnished in this document is true and correct.', {
    x: 50,
    y,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  y -= 40;

  // Signature Section
  const signatureFields = [
    { label: 'Signature:', value: candidateData.signature || '', x: 50, width: 150 },
    { label: 'Date:', value: formatDate(candidateData.signatureDate) || '', x: 220, width: 100 },
    { label: 'Place:', value: candidateData.signaturePlace || '', x: 340, width: 120 }
  ];

  signatureFields.forEach(field => {
    // Label
    page.drawText(field.label, {
      x: field.x,
      y: y + 15,
      size: 9,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Signature box
    page.drawRectangle({
      x: field.x,
      y: y - 10,
      width: field.width,
      height: 25,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.5,
    });

    // Value
    const valueLines = wrapText(field.value, Math.floor(field.width / 6));
    valueLines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: field.x + 5,
        y: y - 3 - (lineIndex * 10),
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
        maxWidth: field.width - 10,
      });
    });
  });
};
  // const drawCompensationDetails = () => {
  //   page.drawRectangle({
  //     x: 50,
  //     y: y - 20,
  //     width: 500,
  //     height: 30,
  //     color: rgb(0.8, 0.8, 0.8),
  //   });

  //   page.drawText('COMPENSATION & OTHER DETAILS', {
  //     x: 120,
  //     y: y - 12,
  //     size: 12,
  //     font: boldFont,
  //     color: rgb(0, 0, 0),
  //   });

  //   y -= 50;

  //   const compensationDetails = [
  //     { label: 'Present CTC (Fixed & Variable):', value: candidateData.presentCtcFixedAndVariable || 'N/A' },
  //     { label: 'Present per Month Salary:', value: candidateData.presentPerMonthSalary || 'N/A' },
  //     { label: 'Any Other Compensation Benefit:', value: candidateData.anyOtherCompensationBenefit || 'N/A' },
  //     { label: 'Expected CTC:', value: candidateData.expectedCtc || 'N/A' },
  //     { label: 'Expected per Month Take Home Salary:', value: candidateData.expectedPerMonthTakeHomeSalary || 'N/A' },
  //     { label: 'Notice Period Negotiated (Days):', value: candidateData.noticePeriodNegotiatedDays || 'N/A' },
  //     { label: 'Reason for Leaving Last Organization:', value: candidateData.reasonForLeavingLastOrg || 'N/A' }
  //   ];

  //   compensationDetails.forEach((detail, detailIndex) => {
  //     if (y < 100) {
  //       page = pdfDoc.addPage([600, 900]);
  //       y = height - 50;
  //       drawHeader();
  //       y -= 60;
  //     }
      
  //     const currentY = y - (detailIndex * 25);

  //     // Label
  //     page.drawText(detail.label, {
  //       x: 50,
  //       y: currentY,
  //       size: 9,
  //       font: boldFont,
  //       color: rgb(0, 0, 0),
  //     });
      
  //     // Value with text wrapping
  //     const valueLines = wrapText(detail.value, 40);
  //     valueLines.forEach((line, lineIndex) => {
  //       page.drawText(line, {
  //         x: 280,
  //         y: currentY - (lineIndex * 11),
  //         size: 9,
  //         font: font,
  //         color: rgb(0.2, 0.2, 0.2),
  //         maxWidth: 270,
  //       });
  //     });
  //   });

  //   y -= 180;

  //   // Declaration
  //   page.drawText('I hereby affirm that the information furnished in this document is true and correct.', {
  //     x: 50,
  //     y,
  //     size: 10,
  //     font: font,
  //     color: rgb(0, 0, 0),
  //   });
    
  //   y -= 40;

  //   // Signature Section
  //   const signatureFields = [
  //     { label: 'Signature:', value: candidateData.signature || '', x: 50, width: 150 },
  //     { label: 'Date:', value: formatDate(candidateData.signatureDate) || '', x: 220, width: 100 },
  //     { label: 'Place:', value: candidateData.signaturePlace || '', x: 340, width: 120 }
  //   ];

  //   signatureFields.forEach(field => {
  //     // Label
  //     page.drawText(field.label, {
  //       x: field.x,
  //       y: y + 15,
  //       size: 9,
  //       font: boldFont,
  //       color: rgb(0, 0, 0),
  //     });

  //     // Signature box
  //     page.drawRectangle({
  //       x: field.x,
  //       y: y - 10,
  //       width: field.width,
  //       height: 25,
  //       borderColor: rgb(0, 0, 0),
  //       borderWidth: 0.5,
  //     });

  //     // Value
  //     const valueLines = wrapText(field.value, Math.floor(field.width / 6));
  //     valueLines.forEach((line, lineIndex) => {
  //       page.drawText(line, {
  //         x: field.x + 5,
  //         y: y - 3 - (lineIndex * 10),
  //         size: 9,
  //         font: font,
  //         color: rgb(0.2, 0.2, 0.2),
  //         maxWidth: field.width - 10,
  //       });
  //     });
  //   });
  // };

  drawCompensationDetails();

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Helper functions
function wrapText(text, maxLength) {
  if (!text || text === 'N/A') return [text || ''];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).length <= maxLength || currentLine === '') {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  } catch {
    return dateString;
  }
}

function formatMonthYear(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}

function getStudyModeText(mode) {
  const modes = {
    'FT': 'Full Time',
    'PT': 'Part Time',
    'DL': 'Distance Learning'
  };
  return modes[mode] || mode || '';
}

const handler = async (request, context) => {
  try {
    const { id } = context.params;
    console.log('Download request for ID:', id);
    
    const user = request.user;
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const submission = await Candidate.getSubmissionById(id);
    
    if (!submission) {
      return new Response('Submission not found', { status: 404 });
    }

    if (submission.userId !== user.userId && user.role !== 'admin' && user.role !== 'hr') {
      return new Response('Access denied', { status: 403 });
    }

    console.log('Generating professional PDF...');
    const pdfBytes = await generatePDFForDownload(submission);
    
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="candidate_profile_${submission.fullName || submission.id}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return new Response(error.message, { status: 500 });
  }
};

export const GET = authMiddleware(handler);