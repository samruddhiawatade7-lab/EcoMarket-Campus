import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, PlusCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { Product } from '../types';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';

export const SemesterBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [query, setQuery] = useState('');

  const courses = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Chemical', 'Management', 'Commerce', 'Science'];
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  useEffect(() => {
    fetchBooks();
  }, [course, semester]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        category: 'Books & Study Materials',
        course: course || undefined,
        semester: semester || undefined,
        query: query || undefined,
        size: 20
      });
      setBooks(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-2">
            <BookOpen className="w-4 h-4" /> Academic Textbook Marketplace
          </div>
          <h1 className="text-3xl font-black">Books for Your Semester</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Find used course textbooks, reference guides, solved GATE notes, and lab manuals directly from campus seniors.
          </p>
        </div>

        <Link
          to="/products/new?category=Books%20%26%20Study%20Materials"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 w-fit shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Sell Your Semester Books
        </Link>
      </div>

      {/* Academic Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" /> Filter by Branch & Semester
        </h2>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Branch / Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="">All Branches</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Search Title / Author / ISBN</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Grewal, Morrison, Data Structures..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
              />
              <button
                type="submit"
                className="px-4 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Semester Books Found</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first to list textbooks for this semester!</p>
          <Link to="/products/new" className="inline-block mt-4 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
            List a Book Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <ProductCard key={book.id} product={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SemesterBooksPage;
