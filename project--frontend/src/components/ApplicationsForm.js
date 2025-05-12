import React, { useState } from 'react';
import axios from 'axios';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '',
    duration: '',
    purpose: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/api/applications', formData);
    alert('Application submitted!');
    setFormData({ fullName: '', email: '', amount: '', duration: '', purpose: '' });
  };

  return (
    <div>
      <h2>Loan Application Form</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
        <input name="amount" placeholder="Amount" type="number" value={formData.amount} onChange={handleChange} required />
        <input name="duration" placeholder="Duration (months)" type="number" value={formData.duration} onChange={handleChange} required />
        <input name="purpose" placeholder="Purpose" value={formData.purpose} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
