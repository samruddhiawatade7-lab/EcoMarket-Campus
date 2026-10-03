import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, ArrowLeft, GraduationCap, RefreshCw, Gift } from 'lucide-react';
import { Category, ProductCondition, ListingType, ProductCreatePayload, College, Campus } from '../../types';
import { productService } from '../../services/productService';
import { collegeService } from '../../services/collegeService';
import { userService } from '../../services/userService';

export const AddEditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProductCreatePayload>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    quantity: 1,
    condition: 'GOOD',
    listingType: 'SELL',
    categoryId: 1,
    collegeId: undefined,
    campusId: undefined,
    academicYear: '',
    semester: '',
    course: '',
    subject: '',
    author: '',
    isbn: '',
    isSemesterEndResale: false,
    exchangePreference: '',
    images: []
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    const initData = async () => {
      try {
        const [catList, collegeList] = await Promise.all([
          productService.getCategories(),
          collegeService.getAllColleges()
        ]);
        setCategories(catList);
        setColleges(collegeList);

        if (catList.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: catList[0].id }));
        }

        if (isEdit) {
          const prod = await productService.getProductById(parseInt(id));
          setFormData({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            originalPrice: prod.originalPrice || prod.price,
            quantity: prod.quantity,
            condition: prod.condition,
            listingType: prod.listingType || 'SELL',
            categoryId: prod.category?.id || 1,
            collegeId: prod.collegeId,
            campusId: prod.campusId,
            academicYear: prod.academicYear || '',
            semester: prod.semester || '',
            course: prod.course || '',
            subject: prod.subject || '',
            author: prod.author || '',
            isbn: prod.isbn || '',
            isSemesterEndResale: prod.isSemesterEndResale || false,
            exchangePreference: prod.exchangePreference || '',
            images: prod.images || []
          });

          if (prod.collegeId) {
            const campusList = await collegeService.getCampusesByCollege(prod.collegeId);
            setCampuses(campusList);
          }
        }
      } catch (err) {
        console.error('Failed to initialize product form:', err);
      }
    };
    initData();
  }, [id]);

  const handleCollegeSelect = async (collegeId: number) => {
    setFormData(prev => ({ ...prev, collegeId, campusId: undefined }));
    if (collegeId) {
      const campusList = await collegeService.getCampusesByCollege(collegeId);
      setCampuses(campusList);
    } else {
      setCampuses([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'originalPrice' || name === 'quantity' || name === 'categoryId' || name === 'collegeId' || name === 'campusId'
          ? (value ? parseFloat(value) : 0)
          : value
      }));
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageUrlInput.trim()] }));
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      try {
        setUploadingImg(true);
        const url = await userService.uploadImage(files[0]);
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
      } catch (err) {
        alert('Failed to upload image');
      } finally {
        setUploadingImg(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description) {
      setError('Please fill in product name and description.');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await productService.updateProduct(parseInt(id), formData);
      } else {
        await productService.createProduct(formData);
      }
      navigate('/student-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{isEdit ? 'Edit Campus Listing' : 'List an Item on Campus'}</h2>
          <p className="text-xs text-slate-500">Post items for Sale, Exchange, or Donation to fellow college students.</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Listing Type Selector */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-900 font-bold block">Listing Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'SELL', label: 'For Sale', desc: 'Set an asking price' },
                { type: 'EXCHANGE', label: 'Exchange Only', desc: 'Swap with another item' },
                { type: 'DONATE', label: 'Free / Donation', desc: 'Give away for ₹0' },
                { type: 'FREE_CORNER', label: 'Free Corner', desc: 'Campus Free Corner' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    listingType: item.type as ListingType,
                    price: (item.type === 'DONATE' || item.type === 'FREE_CORNER') ? 0 : prev.price
                  }))}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.listingType === item.type
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold text-xs">{item.label}</div>
                  <div className="text-[10px] opacity-80">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-700">Item Title *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Higher Engineering Mathematics B.S. Grewal, Casio fx-991EX, Single Mattress..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Product Condition *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="NEW">NEW</option>
              <option value="LIKE_NEW">LIKE NEW (Mint condition)</option>
              <option value="GOOD">GOOD (Minor pencil marks / wear)</option>
              <option value="FAIR">FAIR (Functional with visible wear)</option>
              <option value="REFURBISHED">REFURBISHED</option>
              <option value="UPCYCLED">UPCYCLED</option>
            </select>
          </div>

          {formData.listingType === 'SELL' && (
            <>
              <div className="space-y-1">
                <label className="text-slate-700">Selling Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">Original / MRP Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </>
          )}

          {formData.listingType === 'EXCHANGE' && (
            <div className="space-y-1 md:col-span-2">
              <label className="text-slate-700">Exchange Preference (What item do you want in return?)</label>
              <input
                type="text"
                name="exchangePreference"
                value={formData.exchangePreference}
                onChange={handleInputChange}
                placeholder="e.g. Will exchange for Atkins Physical Chemistry book or Casio FX-991EX calculator"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {/* College & Campus Selection */}
          <div className="space-y-1">
            <label className="text-slate-700">College / University</label>
            <select
              name="collegeId"
              value={formData.collegeId || ''}
              onChange={(e) => handleCollegeSelect(parseInt(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">Select College</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Campus Branch</label>
            <select
              name="campusId"
              value={formData.campusId || ''}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">Select Campus</option>
              {campuses.map((cam) => (
                <option key={cam.id} value={cam.id}>{cam.name}</option>
              ))}
            </select>
          </div>

          {/* Academic Semester Book Section */}
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-emerald-600" /> Academic & Semester Information (Optional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 text-[11px]">Branch / Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Computer Science, Mechanical..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 text-[11px]">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="">Select Semester</option>
                  {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 text-[11px]">Author / ISBN</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isSemesterEndResale"
                checked={formData.isSemesterEndResale}
                onChange={handleInputChange}
                className="text-emerald-600 rounded"
              />
              <span>Mark as Semester-End Move / Clear Out Listing</span>
            </label>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-700">Detailed Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide details on item condition, highlights, included accessories, or pickup availability on campus..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="space-y-2 md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-slate-900 font-bold block">Listing Images</label>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste Image URL..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold"
              >
                Add URL
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> {uploadingImg ? 'Uploading...' : 'Upload Image File'}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {formData.images && formData.images.length > 0 && (
              <div className="flex gap-2 pt-2 overflow-x-auto">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                      className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {loading ? 'Posting Listing...' : (isEdit ? 'Update Campus Listing' : 'Post Campus Listing')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProductPage;
