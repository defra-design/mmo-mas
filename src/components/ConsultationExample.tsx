import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

// A dedicated entry URL also supports opening the index link in a new tab.
export default function ConsultationExample() {
  const { loadConsultationExample } = useTasks();
  const navigate = useNavigate();
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    loadConsultationExample();
    navigate('/receive-assess/cases/MLA%2F2026%2F10015', { replace: true });
  }, [loadConsultationExample, navigate]);
  return null;
}
