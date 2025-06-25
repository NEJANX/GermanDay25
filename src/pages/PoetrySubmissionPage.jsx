import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PoetrySubmissionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/submissions'); // redirect to closed page
  }, []);
  
  return null; // nothing to render
}
