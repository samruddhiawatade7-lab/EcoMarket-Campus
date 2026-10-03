import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Edit, FolderTree } from 'lucide-react';
import { Category } from '../../types';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const list = await productService.getCategories();
      setCategories(list);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        const updated = await adminService.updateCategory(editingId, { name, description, image });
        setCategories(prev => prev.map(c => c.id === editingId ? updated : c));
        setEditingId(null);
      } else {
        const created = await adminService.createCategory({ name, description, image });
        setCategories(prev => [...prev, created]);
      }
      setName('');
      setDescription('');
      setImage('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description || '');
    setImage(c.image || '');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await adminService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs font-bold text-slate-500">Loading Categories...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-xl font-black text-slate-900">Marketplace Categories</h2>
        <p className="text-xs text-slate-500">Add, edit, or delete product categories</p>
      </div>

      {/* Add / Edit Category Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs font-semibold">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider">
          {editingId ? 'Edit Category' : 'Create New Category'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Category Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl"
          />

          <input
            type="text"
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setName(''); setDescription(''); setImage(''); }}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" /> {editingId ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              {c.image && <img src={c.image} alt="" className="w-full h-24 object-cover rounded-xl bg-slate-100 mb-2" />}
              <h4 className="font-extrabold text-slate-900 text-sm">{c.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{c.description || 'No description'}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => handleEdit(c)} className="p-1.5 text-slate-600 hover:text-purple-600 rounded-lg hover:bg-slate-100">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
