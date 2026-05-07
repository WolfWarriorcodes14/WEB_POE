import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        background: 'white',
        cursor: 'pointer',
        fontSize: '14px',
      }}
    >
      <option value="en">English</option>
      <option value="mr">मराठी</option>
    </select>
  );
}