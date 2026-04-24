'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAdminLogin } from '@/app/admin/actions';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const result = await verifyAdminLogin(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--cream, #faf6f0)' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(42,26,23,0.1)', width: '100%', maxWidth: '400px', direction: 'rtl' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--dark, #2a1a17)', fontFamily: 'Tajawal, sans-serif' }}>تسجيل الدخول للإدارة</h2>
        
        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text, #4a2e2a)', fontSize: '0.9rem', fontWeight: 600 }}>اسم المستخدم</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} 
            placeholder="admin"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text, #4a2e2a)', fontSize: '0.9rem', fontWeight: 600 }}>كلمة المرور</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} 
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '1rem', background: 'var(--deep, #7a3f38)', color: '#fff', border: 'none', borderRadius: '50px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 700, fontFamily: 'Tajawal, sans-serif', transition: 'background 0.3s', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
