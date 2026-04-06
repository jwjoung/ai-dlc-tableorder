import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tableApi from '../../api/tableApi';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

function TableSettingsPage() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState({ tableNumber: '', password: '' });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const fetchTables = useCallback(async () => {
    try {
      const response = await tableApi.getTables();
      setTables(response.data);
    } catch (err) {
      setError(err.message || '데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const openForm = (table = null) => {
    setEditingTable(table);
    setForm({
      tableNumber: table ? String(table.table_number) : '',
      password: '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = { tableNumber: Number(form.tableNumber), password: form.password };
      if (editingTable) {
        await tableApi.updateTable(editingTable.id, data);
        showSuccess('테이블이 수정되었습니다');
      } else {
        await tableApi.createTable(data);
        showSuccess('테이블이 등록되었습니다');
      }
      setIsFormOpen(false);
      await fetchTables();
    } catch (err) {
      setError(err.message || '저장에 실패했습니다');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800" data-testid="table-settings-title">테이블 설정</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-3" data-testid="table-settings-back">대시보드</button>
      </header>

      <div className="p-4">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-2 text-sm">{successMsg}</div>}

        <div className="flex justify-end mb-4">
          <Button onClick={() => openForm()} data-testid="table-settings-add">+ 테이블 추가</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="table-settings-grid">
          {tables.map(table => (
            <div key={table.id} className="bg-white rounded-lg shadow-sm border p-4" data-testid={`table-card-${table.id}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">테이블 {table.table_number}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${table.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {table.is_active ? '활성' : '비활성'}
                </span>
              </div>
              {table.session_started_at && (
                <p className="text-xs text-gray-500 mb-3">
                  세션 시작: {new Date(table.session_started_at).toLocaleString('ko-KR')}
                </p>
              )}
              <button
                onClick={() => openForm(table)}
                className="text-blue-500 hover:text-blue-700 text-sm min-h-[44px]"
                data-testid={`table-edit-${table.id}`}
              >
                수정
              </button>
            </div>
          ))}
        </div>
      </div>

      {isFormOpen && (
        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingTable ? '테이블 수정' : '테이블 추가'}>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="table-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">테이블 번호 *</label>
              <input type="number" value={form.tableNumber} onChange={(e) => setForm(f => ({ ...f, tableNumber: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required min="1" data-testid="table-form-number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 {editingTable ? '(변경 시에만 입력)' : '*'}</label>
              <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required={!editingTable} minLength={4} data-testid="table-form-password" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" data-testid="table-form-submit">{editingTable ? '수정' : '등록'}</Button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 min-h-[44px]" data-testid="table-form-cancel">취소</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default TableSettingsPage;
