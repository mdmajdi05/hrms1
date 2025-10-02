'use client';
import { useState } from 'react';

function CandidateForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    qualification: '',
    experienceYears: '',
    skills: '',
    declaration: false,
    profileImage: null,
    // additional personal fields
    dob: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    permanentAddress: '',
    // professional fields
    currentEmployer: '',
    roleAtWork: '',
    preferredLocation: '',
    positionConsidered: '',
    totalExperience: '',
    expInConsideredRole: '',
    dom: '',
    // complex/multi entries
    education: [],
    careerHistory: [],
    // SECTION 2: PERSONAL DETAILS
    fatherName: '',
    fatherDateOfBirth: '',
    fatherOccupation: '',
    motherName: '',
    motherDateOfBirth: '',
    motherOccupation: '',
    spouseName: '',
    spouseDateOfBirth: '',
    spouseOccupation: '',
    // SECTION 4: TOTAL EXPERIENCE & GAPS
    totalExperienceYears: '',
    expWithPresentOrg: '',
    avgExpPerOrganization: '',
    breakGapInEducationYears: '',
    breakGapInProfCareerYears: '',
    roleKcrTeam: '',
    teamSize: '',
    // SECTION 6: KRA/KPI
    kraKpi1: '',
    kraKpi2: '',
    kraKpi3: '',
    // SECTION 7: OTHER DETAILS
    noticePeriodMonths: '',
    noticePeriodNegotiatedDays: '',
    reasonForLeavingLastOrg: '',
    presentCtcFixedAndVariable: '',
    presentPerMonthSalary: '',
    anyOtherCompensationBenefit: '',
    expectedCtc: '',
    expectedPerMonthTakeHomeSalary: '',
    // SECTION 8: DECLARATION SIGNATURE
    signature: '',
    signatureDate: '',
    signaturePlace: ''
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size check (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        onError('Image size should be less than 2MB');
        e.target.value = ''; // Clear input
        return;
      }
      
      // File type check
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        onError('Please select a valid image file (JPG, PNG, GIF)');
        e.target.value = ''; // Clear input
        return;
      }
      
      // Create preview and store file
      handleInputChange('profileImage', file);
      
      // Success message
      console.log('Image selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName) {
      onError('Full name is required');
      return;
    }

    if (!formData.declaration) {
      onError('Please accept the declaration');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Image upload handle karo
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
        formDataToSend.append('PROFILE_IMAGE', formData.profileImage);
      }

      const toUpperSnake = (s) => s.replace(/([A-Z])/g, '_$1').toUpperCase();

      Object.keys(formData).forEach(key => {
        if (key === 'declaration' || key === 'profileImage') return;

        const value = formData[key];
        const payload = (Array.isArray(value) || (value && typeof value === 'object')) ? JSON.stringify(value) : (value !== undefined && value !== null ? String(value) : '');

        // append both naming variants
        formDataToSend.append(key, payload);
        formDataToSend.append(toUpperSnake(key), payload);
      });

      // declaration is sent as 'yes' / 'no' (also mirrored)
      const decl = formData.declaration ? 'yes' : 'no';
      formDataToSend.append('declaration', decl);
      formDataToSend.append('DECLARATION', decl);

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        // show preview and provide download link
        if (result.previewUrl) setPreviewUrl(result.previewUrl);
        if (result.downloadUrl) setDownloadUrl(result.downloadUrl);
        
        // Show success message
        setShowSuccess(true);
        
        // Call parent success callback
        onSuccess();
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            title: '',
            fullName: '',
            email: '',
            phone: '',
            countryCode: '+91',
            qualification: '',
            experienceYears: '',
            skills: '',
            declaration: false,
            profileImage: null,
            dob: '',
            gender: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            permanentAddress: '',
            currentEmployer: '',
            roleAtWork: '',
            preferredLocation: '',
            positionConsidered: '',
            totalExperience: '',
            expInConsideredRole: '',
            dom: '',
            education: [],
            careerHistory: [],
            fatherName: '', 
            fatherDateOfBirth: '', 
            fatherOccupation: '',
            motherName: '', 
            motherDateOfBirth: '', 
            motherOccupation: '',
            spouseName: '', 
            spouseDateOfBirth: '', 
            spouseOccupation: '',
            totalExperienceYears: '', 
            expWithPresentOrg: '', 
            avgExpPerOrganization: '', 
            breakGapInEducationYears: '', 
            breakGapInProfCareerYears: '', 
            roleKcrTeam: '', 
            teamSize: '',
            kraKpi1: '', 
            kraKpi2: '', 
            kraKpi3: '',
            noticePeriodMonths: '', 
            noticePeriodNegotiatedDays: '', 
            reasonForLeavingLastOrg: '', 
            presentCtcFixedAndVariable: '', 
            presentPerMonthSalary: '', 
            anyOtherCompensationBenefit: '', 
            expectedCtc: '', 
            expectedPerMonthTakeHomeSalary: '',
            signature: '', 
            signatureDate: '', 
            signaturePlace: ''
          });
          setShowSuccess(false);
        }, 3000);
      } else {
        onError(result.error || 'Submission failed');
      }
    } catch (error) {
      onError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="border border-gray-300 p-4 md:p-6 rounded-lg bg-gray-50 my-4 md:my-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-lg font-bold mb-2">Thank You!</h3>
          <p className="mb-2">Your application has been submitted successfully.</p>
          <p className="text-sm text-green-600">You can preview and download your application below.</p>
        </div>
      )}

      <h4 className="text-xl font-bold mb-4">📋 Candidate Registration Form</h4>

      <form onSubmit={handleSubmit}>
        {/* Profile Image Upload */}
        <div className="mb-6 text-center">
          <label className="block mb-3 font-semibold">
            Profile Photo
          </label>
          
          {/* Image Preview */}
          {formData.profileImage ? (
            <div className="mb-3">
              <img 
                src={typeof formData.profileImage === 'string' 
                  ? formData.profileImage 
                  : URL.createObjectURL(formData.profileImage)
                } 
                alt="Profile Preview" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-300 mx-auto"
              />
            </div>
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center mx-auto mb-3 bg-white">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleImageUpload}
            className="hidden"
            id="profileImageInput"
          />
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <label
              htmlFor="profileImageInput"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              📷 Choose Photo
            </label>
            
            {formData.profileImage && (
              <button
                type="button"
                onClick={() => handleInputChange('profileImage', null)}
                className="px-4 py-2 bg-red-600 text-white border-none rounded-lg cursor-pointer hover:bg-red-700 transition-colors text-sm font-medium"
              >
                ❌ Remove
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-600 mt-2">
            Supported: JPG, PNG, GIF (Max 2MB)
          </div>
        </div>

        {/* Title and Full Name */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-32">
            <label className="block mb-2 font-semibold">Title</label>
            <select 
              value={formData.title} 
              onChange={(e) => handleInputChange('title', e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email and Phone - FIXED PHONE INPUT */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Phone</label>
            <div className="flex gap-1 ">
              <select 
                value={formData.countryCode} 
                onChange={(e) => handleInputChange('countryCode', e.target.value)} 
                className="w-18 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
                <option value="+92">+92</option>
                <option value="+971">+971</option>
              </select>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone number"
                className="flex-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Gender</label>
            <select 
              value={formData.gender} 
              onChange={(e) => handleInputChange('gender', e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Present Address</label>
          <input 
            type="text" 
            value={formData.street} 
            onChange={(e) => handleInputChange('street', e.target.value)} 
            placeholder="Street / locality" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              value={formData.city} 
              onChange={(e) => handleInputChange('city', e.target.value)} 
              placeholder="City" 
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              value={formData.state} 
              onChange={(e) => handleInputChange('state', e.target.value)} 
              placeholder="State" 
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              value={formData.zip} 
              onChange={(e) => handleInputChange('zip', e.target.value)} 
              placeholder="ZIP" 
              className="w-full md:w-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-2">
            <label className="text-sm text-gray-600">Permanent Address (optional)</label>
            <input 
              type="text" 
              value={formData.permanentAddress} 
              onChange={(e) => handleInputChange('permanentAddress', e.target.value)} 
              placeholder="Permanent address" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
          </div>
        </div>

        {/* Qualification and Experience */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Qualification</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              placeholder="Highest qualification"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Experience (Years)</label>
            <input
              type="number"
              value={formData.experienceYears}
              onChange={(e) => handleInputChange('experienceYears', e.target.value)}
              placeholder="Years of experience"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Skills</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            placeholder="List your skills (comma separated)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Professional Details */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Current Employer</label>
            <input 
              type="text" 
              value={formData.currentEmployer} 
              onChange={(e) => handleInputChange('currentEmployer', e.target.value)} 
              placeholder="Current employer" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Role / Designation</label>
            <input 
              type="text" 
              value={formData.roleAtWork} 
              onChange={(e) => handleInputChange('roleAtWork', e.target.value)} 
              placeholder="Your role" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* More Professional Details */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Preferred Location</label>
            <input 
              type="text" 
              value={formData.preferredLocation} 
              onChange={(e) => handleInputChange('preferredLocation', e.target.value)} 
              placeholder="Preferred location" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Position Considered</label>
            <input 
              type="text" 
              value={formData.positionConsidered} 
              onChange={(e) => handleInputChange('positionConsidered', e.target.value)} 
              placeholder="Position applied for" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Total Experience */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Total Experience</label>
            <input 
              type="text" 
              value={formData.totalExperience} 
              onChange={(e) => handleInputChange('totalExperience', e.target.value)} 
              placeholder="e.g., 3 years" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Experience in Considered Role</label>
            <input 
              type="text" 
              value={formData.expInConsideredRole} 
              onChange={(e) => handleInputChange('expInConsideredRole', e.target.value)} 
              placeholder="e.g., 1 year" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DOM */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Date of Mobility (DOM)</label>
          <input 
            type="date" 
            value={formData.dom} 
            onChange={(e) => handleInputChange('dom', e.target.value)} 
            className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Education and Career History */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Education (one entry per line)</label>
          <textarea 
            value={(formData.education || []).join('\n')} 
            onChange={(e) => handleInputChange('education', e.target.value.split('\n'))} 
            placeholder="Course - Institution - Year - Grade" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Career History (one entry per line)</label>
          <textarea 
            value={(formData.careerHistory || []).join('\n')} 
            onChange={(e) => handleInputChange('careerHistory', e.target.value.split('\n'))} 
            placeholder="Org - Designation - From - To - Salary" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
          />
        </div>

        {/* SECTION 2: PERSONAL DETAILS */}
        <div className="border-t border-dashed border-gray-400 pt-6 mt-6">
          <h5 className="font-bold mb-4 text-lg">PERSONAL DETAILS</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Father's Name" value={formData.fatherName} onChange={(e) => handleInputChange('fatherName', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" placeholder="Father DOB" value={formData.fatherDateOfBirth} onChange={(e) => handleInputChange('fatherDateOfBirth', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Father Occupation" value={formData.fatherOccupation} onChange={(e) => handleInputChange('fatherOccupation', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input type="text" placeholder="Mother's Name" value={formData.motherName} onChange={(e) => handleInputChange('motherName', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" placeholder="Mother DOB" value={formData.motherDateOfBirth} onChange={(e) => handleInputChange('motherDateOfBirth', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Mother Occupation" value={formData.motherOccupation} onChange={(e) => handleInputChange('motherOccupation', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input type="text" placeholder="Spouse Name (if married)" value={formData.spouseName} onChange={(e) => handleInputChange('spouseName', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" placeholder="Spouse DOB" value={formData.spouseDateOfBirth} onChange={(e) => handleInputChange('spouseDateOfBirth', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Spouse Occupation" value={formData.spouseOccupation} onChange={(e) => handleInputChange('spouseOccupation', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* SECTION 4: TOTAL EXPERIENCE & GAPS */}
        <div className="border-t border-dashed border-gray-400 pt-6 mt-6">
          <h5 className="font-bold mb-4 text-lg">TOTAL EXPERIENCE & GAPS</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Total Experience (years)" value={formData.totalExperienceYears} onChange={(e) => handleInputChange('totalExperienceYears', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Experience with present org" value={formData.expWithPresentOrg} onChange={(e) => handleInputChange('expWithPresentOrg', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Avg experience per org" value={formData.avgExpPerOrganization} onChange={(e) => handleInputChange('avgExpPerOrganization', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Break/gap in education (years)" value={formData.breakGapInEducationYears} onChange={(e) => handleInputChange('breakGapInEducationYears', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Break/gap in prof career (years)" value={formData.breakGapInProfCareerYears} onChange={(e) => handleInputChange('breakGapInProfCareerYears', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Role KCR/Team" value={formData.roleKcrTeam} onChange={(e) => handleInputChange('roleKcrTeam', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Team Size" value={formData.teamSize} onChange={(e) => handleInputChange('teamSize', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 lg:col-span-1" />
          </div>
        </div>

        {/* SECTION 6: KRA / KPI */}
        <div className="border-t border-dashed border-gray-400 pt-6 mt-6">
          <h5 className="font-bold mb-4 text-lg">ROLE (MAJOR KRA / KPI)</h5>
          <textarea value={formData.kraKpi1} onChange={(e) => handleInputChange('kraKpi1', e.target.value)} placeholder="KRA / KPI 1" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20 mb-3" />
          <textarea value={formData.kraKpi2} onChange={(e) => handleInputChange('kraKpi2', e.target.value)} placeholder="KRA / KPI 2" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20 mb-3" />
          <textarea value={formData.kraKpi3} onChange={(e) => handleInputChange('kraKpi3', e.target.value)} placeholder="KRA / KPI 3" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20" />
        </div>

        {/* SECTION 7: OTHER DETAILS */}
        <div className="border-t border-dashed border-gray-400 pt-6 mt-6">
          <h5 className="font-bold mb-4 text-lg">OTHER DETAILS</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Notice period (months)" value={formData.noticePeriodMonths} onChange={(e) => handleInputChange('noticePeriodMonths', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Negotiated notice (days)" value={formData.noticePeriodNegotiatedDays} onChange={(e) => handleInputChange('noticePeriodNegotiatedDays', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Reason for leaving last org" value={formData.reasonForLeavingLastOrg} onChange={(e) => handleInputChange('reasonForLeavingLastOrg', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Present CTC (F & V)" value={formData.presentCtcFixedAndVariable} onChange={(e) => handleInputChange('presentCtcFixedAndVariable', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Present per month salary" value={formData.presentPerMonthSalary} onChange={(e) => handleInputChange('presentPerMonthSalary', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Any other compensation / benefit" value={formData.anyOtherCompensationBenefit} onChange={(e) => handleInputChange('anyOtherCompensationBenefit', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Expected CTC" value={formData.expectedCtc} onChange={(e) => handleInputChange('expectedCtc', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Expected per month take-home" value={formData.expectedPerMonthTakeHomeSalary} onChange={(e) => handleInputChange('expectedPerMonthTakeHomeSalary', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* SECTION 8: DECLARATION SIGNATURE */}
        <div className="border-t border-dashed border-gray-400 pt-6 mt-6">
          <h5 className="font-bold mb-4 text-lg">DECLARATION</h5>
          <input type="text" placeholder="Signature (type your name)" value={formData.signature} onChange={(e) => handleInputChange('signature', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
          <div className="flex flex-col md:flex-row gap-3">
            <input type="date" placeholder="Date" value={formData.signatureDate} onChange={(e) => handleInputChange('signatureDate', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Place" value={formData.signaturePlace} onChange={(e) => handleInputChange('signaturePlace', e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" />
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="mt-6 mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.declaration}
              onChange={(e) => handleInputChange('declaration', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold">✅ I declare that all information provided is true and correct</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 text-white border-none rounded-lg cursor-pointer text-lg font-bold transition-colors ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? '⏳ Submitting...' : '📤 Submit Application'}
        </button>
      </form>

      {/* Preview and actions */}
      {previewUrl && (
        <div className="mt-8 text-center">
          <h5 className="text-lg font-bold mb-4">Preview</h5>
          <div className="border border-gray-300 p-4 rounded-lg bg-white">
            <iframe
              title="pdf-preview"
              src={previewUrl}
              className="w-full h-96 md:h-120 border-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <a href={previewUrl} download="submission.pdf">
              <button type="button" className="px-6 py-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer hover:bg-blue-700 transition-colors w-full sm:w-auto">
                Download Preview
              </button>
            </a>

            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <button type="button" className="px-6 py-3 bg-green-600 text-white border-none rounded-lg cursor-pointer hover:bg-green-700 transition-colors w-full sm:w-auto">
                  Open Download
                </button>
              </a>
            )}

            <button type="button" onClick={() => {
              const w = window.open(previewUrl, '_blank');
              if (w) {
                setTimeout(() => w.print(), 500);
              }
            }} className="px-6 py-3 bg-gray-600 text-white border-none rounded-lg cursor-pointer hover:bg-gray-700 transition-colors w-full sm:w-auto">
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateForm;