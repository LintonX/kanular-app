import LoginForm from '@/components/LoginForm/LoginForm'
import { useUserSessionQuery } from '@/features/api/auth-api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const {data, isLoading, isSuccess} = useUserSessionQuery();
  
  useEffect(() => {
    if (isSuccess && data) {
      navigate('/auth/dashboard');
    }
  }, [isSuccess, data, navigate]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex justify-center items-center'><LoginForm /></div>
  )
}
