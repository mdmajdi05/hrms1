'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

// Reusable Input Components (same as before)
const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  required = false, 
  className = '',
  id,
  error
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block mb-2 font-semibold">
        {label}{required && ' *'}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectInput = ({ 
  label, 
  value, 
  onChange, 
  options, 
  className = '',
  id,
  required = false 
}) => (
  <div className={className}>
    <label htmlFor={id} className="block mb-2 font-semibold">
      {label}{required && ' *'}
    </label>
    <select 
      id={id}
      value={value} 
      onChange={onChange}
      required={required}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const TextAreaInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  id,
  rows = 4
}) => (
  <div className={className}>
    <label htmlFor={id} className="block mb-2 font-semibold">{label}</label>
    <textarea 
      id={id}
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Improved Education Table Component with Mobile Responsive Design
const EducationTable = ({ educationData, onEducationChange, onAddRow, onRemoveRow }) => {
  const handleChange = (index, field, value) => {
    const updatedData = educationData.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    onEducationChange(updatedData);
  };

  // Mobile Card View for Education
  const EducationCard = ({ row, index, onRemove }) => (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-lg">Education #{index + 1}</h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
          <input
            type="text"
            value={row.courseName}
            onChange={(e) => handleChange(index, 'courseName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School/Institute</label>
          <input
            type="text"
            value={row.schoolName}
            onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="School/Institute"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Board/University</label>
            <input
              type="text"
              value={row.boardUniversity}
              onChange={(e) => handleChange(index, 'boardUniversity', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Board/University"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
            <input
              type="text"
              value={row.place}
              onChange={(e) => handleChange(index, 'place', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Place"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">% or CGPA</label>
            <input
              type="text"
              value={row.percentage}
              onChange={(e) => handleChange(index, 'percentage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="% or CGPA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Study Mode</label>
            <select
              value={row.studyMode}
              onChange={(e) => handleChange(index, 'studyMode', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="FT">Full Time</option>
              <option value="PT">Part Time</option>
              <option value="DL">Distance Learning</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Start</label>
            <input
              type="number"
              value={row.yos}
              onChange={(e) => handleChange(index, 'yos', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Year of Start"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Pass</label>
            <input
              type="number"
              value={row.yop}
              onChange={(e) => handleChange(index, 'yop', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Year of Pass"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">S.N.</th>
              <th className="border border-gray-300 p-2 text-left">COURSE NAME</th>
              <th className="border border-gray-300 p-2 text-left">SCHOOL/INST. NAME</th>
              <th className="border border-gray-300 p-2 text-left">BOARD / UNI.</th>
              <th className="border border-gray-300 p-2 text-left">Place</th>
              <th className="border border-gray-300 p-2 text-left">% OR CGPA</th>
              <th className="border border-gray-300 p-2 text-left">YOS</th>
              <th className="border border-gray-300 p-2 text-left">YOP</th>
              <th className="border border-gray-300 p-2 text-left">FT / PT / DL</th>
              <th className="border border-gray-300 p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {educationData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.courseName}
                    onChange={(e) => handleChange(index, 'courseName', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Course Name"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.schoolName}
                    onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="School/Institute"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.boardUniversity}
                    onChange={(e) => handleChange(index, 'boardUniversity', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Board/University"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.place}
                    onChange={(e) => handleChange(index, 'place', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Place"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.percentage}
                    onChange={(e) => handleChange(index, 'percentage', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="% or CGPA"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.yos}
                    onChange={(e) => handleChange(index, 'yos', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Year of Start"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.yop}
                    onChange={(e) => handleChange(index, 'yop', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Year of Pass"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    value={row.studyMode}
                    onChange={(e) => handleChange(index, 'studyMode', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="FT">Full Time</option>
                    <option value="PT">Part Time</option>
                    <option value="DL">Distance Learning</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {educationData.map((row, index) => (
          <EducationCard 
            key={index} 
            row={row} 
            index={index} 
            onRemove={onRemoveRow}
          />
        ))}
      </div>
      
      <button
        type="button"
        onClick={onAddRow}
        className="mt-4 w-full lg:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        ➕ Add Education Row
      </button>
    </div>
  );
};

// Improved Career Table Component with Mobile Responsive Design
const CareerTable = ({ careerData, onCareerChange, onAddRow, onRemoveRow }) => {
  const handleChange = (index, field, value) => {
    const updatedData = careerData.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    onCareerChange(updatedData);
  };

  // Mobile Card View for Career
  const CareerCard = ({ row, index, onRemove }) => (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-lg">Experience #{index + 1}</h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
          <input
            type="text"
            value={row.organization}
            onChange={(e) => handleChange(index, 'organization', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Organization"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            value={row.designation}
            onChange={(e) => handleChange(index, 'designation', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Designation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary (CTC) in Lakh PA</label>
          <div className="space-y-2">
            <input
              type="text"
              value={row.fixedSalary}
              onChange={(e) => handleChange(index, 'fixedSalary', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Fixed Salary"
            />
            <input
              type="text"
              value={row.variableSalary}
              onChange={(e) => handleChange(index, 'variableSalary', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Variable Salary"
            />
            <input
              type="text"
              value={row.totalCtc}
              onChange={(e) => handleChange(index, 'totalCtc', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Total CTC"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Take Home</label>
          <input
            type="text"
            value={row.monthlyTakeHome}
            onChange={(e) => handleChange(index, 'monthlyTakeHome', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Monthly Take Home"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="month"
              value={row.fromDate}
              onChange={(e) => handleChange(index, 'fromDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From"
            />
            <input
              type="month"
              value={row.toDate}
              onChange={(e) => handleChange(index, 'toDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">S.N.</th>
              <th className="border border-gray-300 p-2 text-left">ORGANIZATION</th>
              <th className="border border-gray-300 p-2 text-left">DESIGNATION</th>
              <th className="border border-gray-300 p-2 text-left">SALARY (CTC) (in Lakh PA)</th>
              <th className="border border-gray-300 p-2 text-left">Salary Per Month Take Home</th>
              <th className="border border-gray-300 p-2 text-left">Duration (Tenure with the Org.)</th>
              <th className="border border-gray-300 p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {careerData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.organization}
                    onChange={(e) => handleChange(index, 'organization', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Organization"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.designation}
                    onChange={(e) => handleChange(index, 'designation', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Designation"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={row.fixedSalary}
                      onChange={(e) => handleChange(index, 'fixedSalary', e.target.value)}
                      className="w-full p-1 border border-gray-200 rounded text-sm"
                      placeholder="Fixed"
                    />
                    <input
                      type="text"
                      value={row.variableSalary}
                      onChange={(e) => handleChange(index, 'variableSalary', e.target.value)}
                      className="w-full p-1 border border-gray-200 rounded text-sm"
                      placeholder="Variable"
                    />
                    <input
                      type="text"
                      value={row.totalCtc}
                      onChange={(e) => handleChange(index, 'totalCtc', e.target.value)}
                      className="w-full p-1 border border-gray-200 rounded text-sm font-semibold"
                      placeholder="Total CTC"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.monthlyTakeHome}
                    onChange={(e) => handleChange(index, 'monthlyTakeHome', e.target.value)}
                    className="w-full p-1 border-none focus:outline-none"
                    placeholder="Monthly Take Home"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex gap-1">
                    <input
                      type="month"
                      value={row.fromDate}
                      onChange={(e) => handleChange(index, 'fromDate', e.target.value)}
                      className="w-1/2 p-1 border border-gray-200 rounded text-sm"
                      placeholder="From"
                    />
                    <input
                      type="month"
                      value={row.toDate}
                      onChange={(e) => handleChange(index, 'toDate', e.target.value)}
                      className="w-1/2 p-1 border border-gray-200 rounded text-sm"
                      placeholder="To"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {careerData.map((row, index) => (
          <CareerCard 
            key={index} 
            row={row} 
            index={index} 
            onRemove={onRemoveRow}
          />
        ))}
      </div>
      
      <button
        type="button"
        onClick={onAddRow}
        className="mt-4 w-full lg:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        ➕ Add Career Row
      </button>
    </div>
  );
};

// Rest of the code remains the same (defaultFormData, defaultEducationRow, defaultCareerRow, CandidateForm component)
// ... [Previous code for defaultFormData, defaultEducationRow, defaultCareerRow remains exactly the same]

const defaultFormData = {
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
  sameAsPresentAddress: false,
  currentEmployer: '',
  roleAtWork: '',
  preferredLocation: '',
  positionConsidered: '',
  positionConsideredFor: '',
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
};

const defaultEducationRow = {
  courseName: '',
  schoolName: '',
  boardUniversity: '',
  place: '',
  percentage: '',
  yos: '',
  yop: '',
  studyMode: ''
};

const defaultCareerRow = {
  organization: '',
  designation: '',
  fixedSalary: '',
  variableSalary: '',
  totalCtc: '',
  monthlyTakeHome: '',
  fromDate: '',
  toDate: ''
};

function CandidateForm({ onSuccess, onError }) {
  // ... [Previous state and effect hooks remain exactly the same]
  const [formData, setFormData] = useState(defaultFormData);
  const [educationData, setEducationData] = useState([defaultEducationRow]);
  const [careerData, setCareerData] = useState([defaultCareerRow]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Auto-save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(formData).some(key => formData[key] !== defaultFormData[key])) {
        const draft = {
          formData,
          educationData,
          careerData
        };
        localStorage.setItem('candidateFormDraft', JSON.stringify(draft));
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [formData, educationData, careerData]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem('candidateFormDraft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft.formData || defaultFormData);
        setEducationData(parsedDraft.educationData || [defaultEducationRow]);
        setCareerData(parsedDraft.careerData || [defaultCareerRow]);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Handle same as present address
  useEffect(() => {
    if (formData.sameAsPresentAddress) {
      const presentAddress = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zip}`;
      setFormData(prev => ({
        ...prev,
        permanentAddress: presentAddress
      }));
    }
  }, [formData.sameAsPresentAddress, formData.street, formData.city, formData.state, formData.zip]);

  // ... [Previous validation and handler functions remain exactly the same]
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.declaration) {
      newErrors.declaration = 'You must accept the declaration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onError('Image size should be less than 2MB');
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        onError('Please select a valid image file (JPG, PNG, GIF)');
        e.target.value = '';
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      handleInputChange('profileImage', file);
    }
  }, [handleInputChange, onError]);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    handleInputChange('profileImage', null);
  }, [previewUrl, handleInputChange]);

  // Education table handlers
  const handleAddEducationRow = useCallback(() => {
    setEducationData(prev => [...prev, { ...defaultEducationRow }]);
  }, []);

  const handleRemoveEducationRow = useCallback((index) => {
    setEducationData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleEducationChange = useCallback((newData) => {
    setEducationData(newData);
  }, []);

  // Career table handlers
  const handleAddCareerRow = useCallback(() => {
    setCareerData(prev => [...prev, { ...defaultCareerRow }]);
  }, []);

  const handleRemoveCareerRow = useCallback((index) => {
    setCareerData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleCareerChange = useCallback((newData) => {
    setCareerData(newData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      onError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      // Combine all data
      const submissionData = {
        ...formData,
        education: educationData,
        careerHistory: careerData
      };

      Object.keys(submissionData).forEach(key => {
        if (key === 'declaration' || key === 'profileImage') return;

        const value = submissionData[key];
        if (value !== undefined && value !== null && value !== '') {
          const payload = Array.isArray(value) ? JSON.stringify(value) : String(value);
          formDataToSend.append(key, payload);
        }
      });

      formDataToSend.append('declaration', formData.declaration ? 'yes' : 'no');

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setPreviewUrl(result.previewUrl || null);
        setDownloadUrl(result.downloadUrl || null);
        setShowSuccess(true);
        
        onSuccess();
        
        setTimeout(() => {
          setFormData({ ...defaultFormData });
          setEducationData([defaultEducationRow]);
          setCareerData([defaultCareerRow]);
          setShowSuccess(false);
          localStorage.removeItem('candidateFormDraft');
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

  const clearDraft = useCallback(() => {
    localStorage.removeItem('candidateFormDraft');
    setFormData({ ...defaultFormData });
    setEducationData([defaultEducationRow]);
    setCareerData([defaultCareerRow]);
    onSuccess('Draft cleared successfully');
  }, [onSuccess]);

  return (
    <div className="max-w-full mx-auto border border-gray-300 p-3 md:p-6 rounded-lg bg-gray-50 my-3 md:my-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
          <div className="text-xl mb-1">🎉</div>
          <h3 className="text-md font-bold mb-1">Thank You!</h3>
          <p className="text-sm">Your application has been submitted successfully.</p>
        </div>
      )}

      {/* Draft Saved Indicator */}
      {localStorage.getItem('candidateFormDraft') && (
        <div className="mb-3 p-2 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm">📝 Draft saved</span>
            <button
              type="button"
              onClick={clearDraft}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear draft
            </button>
          </div>
        </div>
      )}

      <h4 className="text-lg md:text-xl font-bold mb-3">📋 Candidate Registration Form</h4>

      <form onSubmit={handleSubmit} className={loading ? 'opacity-60' : ''}>
        <fieldset disabled={loading} className="space-y-4 md:space-y-6">

          {/* Profile Image Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">Profile Photo</h5>
            <div className="text-center">
              {formData.profileImage ? (
                <div className="mb-2">
                  <img 
                    src={previewUrl}
                    alt="Profile Preview" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-200 mx-auto shadow-md"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center mx-auto mb-2 bg-white">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}

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
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-xs md:text-sm font-medium"
                >
                  📷 Choose Photo
                </label>
                
                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors text-xs md:text-sm font-medium"
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
              
              <div className="text-xs text-gray-600 mt-1">
                Supported: JPG, PNG, GIF (Max 2MB)
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">Personal Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <SelectInput
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'Mr', label: 'Mr' },
                  { value: 'Mrs', label: 'Mrs' },
                  { value: 'Miss', label: 'Miss' },
                  { value: 'Dr', label: 'Dr' }
                ]}
                id="title"
              />
              <TextInput
                label="Full Name "
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required={true}
                id="fullName"
                error={errors.fullName}
              />
                        <TextInput
                          label="Qualification"
                          value={formData.qualification}
                          onChange={(e) => handleInputChange('qualification', e.target.value)}
                          placeholder="Highest qualification (e.g. B.Tech, MBA)"
                          id="qualification"
                          error={errors.qualification}
                        />
                        <TextInput
                          label="Skills"
                          value={formData.skills}
                          onChange={(e) => handleInputChange('skills', e.target.value)}
                          placeholder="List your skills, separated by commas"
                          id="skills"
                        />
              <TextInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                id="email"
                error={errors.email}
              />
              <div>
                <label className="block mb-2 font-semibold">Phone</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.countryCode} 
                    onChange={(e) => handleInputChange('countryCode', e.target.value)} 
                    className="w-20 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <TextInput
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone number"
                    type="tel"
                    error={errors.phone}
                    className='w-full'
                  />
                </div>
              </div>
              <TextInput
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                id="dob"
              />
              <SelectInput
                label="Gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ]}
                id="gender"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">Address Information</h5>
            <div className="space-y-3 md:space-y-4">
              <TextInput
                label="Street Address"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Street / locality"
                id="street"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <TextInput
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  id="city"
                />
                <TextInput
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                  id="state"
                />
                <TextInput
                  label="PIN Code"
                  value={formData.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  placeholder="ZIP"
                  id="zip"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  id="sameAsPresentAddress"
                  checked={formData.sameAsPresentAddress}
                  onChange={(e) => handleInputChange('sameAsPresentAddress', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="sameAsPresentAddress" className="font-semibold text-sm md:text-base">
                  Same as Present Address
                </label>
              </div>
              <TextInput
                label="Permanent Address"
                value={formData.permanentAddress}
                onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                placeholder="Permanent address"
                id="permanentAddress"
              />
            </div>
          </div>

          {/* Family Details */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">Family Details</h5>
            <div className="space-y-4 md:space-y-6">
              {/* Father Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <TextInput
                  label="Father's Name"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="Father's Name"
                  id="fatherName"
                />
                <TextInput
                  label="Father's Date of Birth"
                  type="date"
                  value={formData.fatherDateOfBirth}
                  onChange={(e) => handleInputChange('fatherDateOfBirth', e.target.value)}
                  id="fatherDateOfBirth"
                />
                <TextInput
                  label="Father's Occupation"
                  value={formData.fatherOccupation}
                  onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                  placeholder="Occupation"
                  id="fatherOccupation"
                />
              </div>

              {/* Mother Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <TextInput
                  label="Mother's Name"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  placeholder="Mother's Name"
                  id="motherName"
                />
                <TextInput
                  label="Mother's Date of Birth"
                  type="date"
                  value={formData.motherDateOfBirth}
                  onChange={(e) => handleInputChange('motherDateOfBirth', e.target.value)}
                  id="motherDateOfBirth"
                />
                <TextInput
                  label="Mother's Occupation"
                  value={formData.motherOccupation}
                  onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                  placeholder="Occupation"
                  id="motherOccupation"
                />
              </div>

              {/* Spouse Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <TextInput
                  label="Spouse's Name (if married)"
                  value={formData.spouseName}
                  onChange={(e) => handleInputChange('spouseName', e.target.value)}
                  placeholder="Spouse's Name"
                  id="spouseName"
                />
                <TextInput
                  label="Spouse's Date of Birth"
                  type="date"
                  value={formData.spouseDateOfBirth}
                  onChange={(e) => handleInputChange('spouseDateOfBirth', e.target.value)}
                  id="spouseDateOfBirth"
                />
                <TextInput
                  label="Spouse's Occupation"
                  value={formData.spouseOccupation}
                  onChange={(e) => handleInputChange('spouseOccupation', e.target.value)}
                  placeholder="Occupation"
                  id="spouseOccupation"
                />
              </div>
            </div>
          </div>

          {/* Position Considered */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">Position Applied For</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <TextInput
                label="Position Considered"
                value={formData.positionConsidered}
                onChange={(e) => handleInputChange('positionConsidered', e.target.value)}
                placeholder="Position considered"
                id="positionConsidered"
              />
              <TextInput
                label="Position Considered For"
                value={formData.positionConsideredFor}
                onChange={(e) => handleInputChange('positionConsideredFor', e.target.value)}
                placeholder="Specific role/department"
                id="positionConsideredFor"
              />
              <TextInput
                label="Current Employer"
                value={formData.currentEmployer}
                onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
                placeholder="Current employer"
                id="currentEmployer"
              />
              <TextInput
                label="Role at Work"
                value={formData.roleAtWork}
                onChange={(e) => handleInputChange('roleAtWork', e.target.value)}
                placeholder="Your current role/title"
                id="roleAtWork"
              />
              <TextInput
                label="Total Experience (yrs)"
                type="number"
                value={formData.totalExperience}
                onChange={(e) => handleInputChange('totalExperience', e.target.value)}
                placeholder="Total experience in years"
                id="totalExperience"
              />
              <TextInput
                label="Notice Period"
                type="number"
                value={formData.noticePeriodNegotiatedDays}
                onChange={(e) => handleInputChange('noticePeriodNegotiatedDays', e.target.value)}
                placeholder="Notice Period"
                id="noticePeriodNegotiatedDays"

              />
            </div>
          </div>

          {/* KRA/KPI & ROLE DETAILS */}

          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">KRA/KPI & ROLE DETAILS</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <TextInput
                label="KRA/KPI 1:"
                value={formData.kraKpi1}
                onChange={(e) => handleInputChange('kraKpi1', e.target.value)}
                placeholder="kraKpi1"
                id="kraKpi1"
              />
              <TextInput
                label="KRA/KPI 2:"
                value={formData.kraKpi2}
                onChange={(e) => handleInputChange('kraKpi2', e.target.value)}
                placeholder="kraKpi2"
                id="kraKpi2"
              />
              <TextInput
                label="KRA/KPI 3:"
                value={formData.kraKpi3}
                onChange={(e) => handleInputChange('kraKpi3', e.target.value)}
                placeholder="kraKpi3"
                id="kraKpi3"
              />
              <TextInput
                label="Role in KCR Team:"
                value={formData.roleKcrTeam}
                onChange={(e) => handleInputChange('roleKcrTeam', e.target.value)}
                placeholder="Role in KCR Team"
                id="roleKcrTeam"
              />
              
            </div>
          </div>

          

          {/* Educational Progress */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">EDUCATIONAL PROGRESS</h5>
            <EducationTable
              educationData={educationData}
              onEducationChange={handleEducationChange}
              onAddRow={handleAddEducationRow}
              onRemoveRow={handleRemoveEducationRow}
            />
          </div>

          {/* Career Contour */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">CAREER CONTOUR (Starting from Present Organisation)</h5>
            <CareerTable
              careerData={careerData}
              onCareerChange={handleCareerChange}
              onAddRow={handleAddCareerRow}
              onRemoveRow={handleRemoveCareerRow}
            />
          </div>


          {/* COMPENSATION & OTHER DETAILS */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">COMPENSATION & OTHER DETAILS</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <TextInput
                label="Present CTC (Fixed & Variable):"
                value={formData.presentCtcFixedAndVariable}
                onChange={(e) => handleInputChange('presentCtcFixedAndVariable', e.target.value)}
                placeholder="Present CTC (Fixed & Variable)"
                id="presentCtcFixedAndVariable"
              />
              <TextInput
                label="Present per Month Salary:"
                value={formData.presentPerMonthSalary}
                onChange={(e) => handleInputChange('presentPerMonthSalary', e.target.value)}
                placeholder="Present per Month Salary"
                id="presentPerMonthSalary"
              />
              <TextInput
                label="Any Other Compensation Benefit:"
                value={formData.anyOtherCompensationBenefit}
                onChange={(e) => handleInputChange('anyOtherCompensationBenefit', e.target.value)}
                placeholder="Any Other Compensation Benefit"
                id="anyOtherCompensationBenefit"
              />
              <TextInput
                label="Expected CTC:"
                value={formData.expectedCtc}
                onChange={(e) => handleInputChange('expectedCtc', e.target.value)}
                placeholder="Expected CTC"
                id="expectedCtc"
              />
              
              <TextInput
                label="Reason for Leaving Last Organization:"
                value={formData.reasonForLeavingLastOrg}
                onChange={(e) => handleInputChange('reasonForLeavingLastOrg', e.target.value)}
                placeholder="Reason for Leaving Last Organization"
                id="reasonForLeavingLastOrg"
              />
              
            </div>
          </div>

          {/* Declaration Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold mb-3 text-md md:text-lg border-b pb-2">DECLARATION</h5>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={formData.declaration}
                  onChange={(e) => handleInputChange('declaration', e.target.checked)}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                <label htmlFor="declaration" className="font-semibold text-sm md:text-base">
                  ✅ I declare that all information provided is true and correct
                </label>
              </div>
              {errors.declaration && <p className="text-red-500 text-sm">{errors.declaration}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pt-3 md:pt-4 border-t">
                <TextInput
                  label="Signature"
                  value={formData.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  placeholder="Type your full name"
                  id="signature"
                />
                <TextInput
                  label="Date"
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                  id="signatureDate"
                />
                <TextInput
                  label="Place"
                  value={formData.signaturePlace}
                  onChange={(e) => handleInputChange('signaturePlace', e.target.value)}
                  placeholder="City name"
                  id="signaturePlace"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 md:py-4 text-white rounded-lg cursor-pointer text-base md:text-lg font-bold transition-colors ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'
            }`}
          >
            {loading ? '⏳ Submitting...' : '📤 Submit Application'}
          </button>
        </fieldset>
      </form>

      {/* Preview Section */}
      {previewUrl && (
        <div className="mt-6 bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h5 className="text-md md:text-lg font-bold mb-3 text-center">Preview & Download</h5>
          <div className="border border-gray-300 p-3 md:p-4 rounded-lg bg-white">
            <iframe
              title="pdf-preview"
              src={previewUrl}
              className="w-full h-64 md:h-96 border-none"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center mt-3">
            <a href={previewUrl} download="submission.pdf">
              <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm md:text-base">
                📥 Download PDF
              </button>
            </a>

            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <button type="button" className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors w-full sm:w-auto text-sm md:text-base">
                  🔗 Open Download
                </button>
              </a>
            )}

            <button type="button" onClick={() => {
              const w = window.open(previewUrl, '_blank');
              if (w) {
                setTimeout(() => w.print(), 500);
              }
            }} className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors w-full sm:w-auto text-sm md:text-base">
              🖨️ Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateForm;