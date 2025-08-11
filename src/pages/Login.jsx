import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LogoFocus from '../assets/LogoFocus.png';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError(t('login.fillFields'));
      setLoading(false);
      return;
    }

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || t('login.error'));
      }
    } catch (err) {
      setError(t('login.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(to bottom right, #1F1540, #070920);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .container { background-color: white; border-radius: 16px; display: flex; flex-direction: row; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); max-width: 900px; width: 100%; }

          .left-panel { background: linear-gradient(to bottom right, #1F1540, #070920); color: white; padding: 60px 40px; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }

          .focus-logo { width: 1400px; max-width: 100%; height: auto; display: block; margin: 0 auto 24px; margin-left: -3mm; }

          .right-panel { flex: 1; padding: 60px 40px; display: flex; flex-direction: column; justify-content: center; background-color: white; }

          .right-panel h2 { text-align: center; font-size: 28px; font-weight: 600; margin-bottom: 24px; color: #31226eff; }

          .right-panel input { width: 100%; padding: 14px; margin-bottom: 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 16px; box-sizing: border-box; background-color: #ffffff; color: #111827; }

          .right-panel button { width: 100%; padding: 14px; background-color: #1F1540; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 12px; transition: background-color 0.3s; }
          .right-panel button:hover { background-color: #3a2e6e; }
          .right-panel button:disabled { background-color: #ccc; cursor: not-allowed; }

          .error-message { color: #d32f2f; background-color: #ffebee; padding: 10px; border-radius: 8px; margin-bottom: 16px; text-align: center; }
          .login-note { margin-top: 8px; font-size: 10px; color: #000; text-align: center; }
        `}
      </style>

      <div className="container">
        <div className="left-panel">
          <img src={LogoFocus} alt="Focus" className="focus-logo" />
        </div>
        <div className="right-panel">
          <h2>{t('login.title')}</h2>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <input type="text" placeholder={t('login.username')} value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
            <input type="password" placeholder={t('login.password')} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />

            <button type="submit" disabled={loading}>{loading ? t('login.loggingIn') : t('login.loginButton')}</button>
            <p className="login-note">Gérez avec précision, Avancez avec Focus</p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
