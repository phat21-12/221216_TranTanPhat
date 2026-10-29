import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const emptyForm = {
  foodId: '',
  name: '',
  category: '',
  cuisine: '',
  ingredients: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: ''
}

function App() {
  const [foods, setFoods] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadFoods = async (keyword = '') => {
    try {
      setLoading(true)
      setError('')

      const url = keyword
        ? `${API_URL}/api/foods?search=${encodeURIComponent(keyword)}`
        : `${API_URL}/api/foods`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Không thể tải danh sách món ăn')
      }

      const data = await response.json()
      setFoods(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')

      const body = {
        ...form,
        ingredients: form.ingredients
          .split(',')
          .map(item => item.trim())
          .filter(Boolean),
        price: Number(form.price),
        quantity: Number(form.quantity)
      }

      const url = editingId
        ? `${API_URL}/api/foods/${editingId}`
        : `${API_URL}/api/foods`

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra')
      }

      setForm(emptyForm)
      setEditingId(null)
      loadFoods(search)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (food) => {
    setEditingId(food._id)

    setForm({
      foodId: food.foodId || '',
      name: food.name || '',
      category: food.category || '',
      cuisine: food.cuisine || '',
      ingredients: (food.ingredients || []).join(', '),
      price: food.price ?? '',
      quantity: food.quantity ?? '',
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return

    try {
      const response = await fetch(`${API_URL}/api/foods/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa món ăn')
      }

      loadFoods(search)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadFoods(search)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <div className="container">
      <h1>Quản lý món ăn</h1>
      <p className="subtitle">221216 - Trần Tấn Phát</p>

      <form className="food-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Cập nhật món ăn' : 'Thêm món ăn'}</h2>

        <div className="form-grid">
          <input name="foodId" placeholder="Mã món" value={form.foodId} onChange={handleChange} required />
          <input name="name" placeholder="Tên món" value={form.name} onChange={handleChange} required />
          <input name="category" placeholder="Loại món" value={form.category} onChange={handleChange} required />
          <input name="cuisine" placeholder="Ẩm thực" value={form.cuisine} onChange={handleChange} required />
          <input name="ingredients" placeholder="Nguyên liệu, cách nhau bằng dấu phẩy" value={form.ingredients} onChange={handleChange} />
          <input name="price" type="number" min="0" placeholder="Giá" value={form.price} onChange={handleChange} required />
          <input name="quantity" type="number" min="0" placeholder="Số lượng" value={form.quantity} onChange={handleChange} required />
          <input name="imageUrl" placeholder="URL hình ảnh" value={form.imageUrl} onChange={handleChange} />
        </div>

        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />

        <div className="actions">
          <button type="submit">
            {editingId ? 'Lưu cập nhật' : 'Thêm món'}
          </button>

          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          placeholder="Tìm theo tên, loại món hoặc ẩm thực..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setSearch('')
            loadFoods('')
          }}
        >
          Tất cả
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="food-grid">
          {foods.map(food => (
            <div className="food-card" key={food._id}>
              <h3>{food.name}</h3>

              <p><strong>Mã:</strong> {food.foodId}</p>
              <p><strong>Loại:</strong> {food.category}</p>
              <p><strong>Ẩm thực:</strong> {food.cuisine}</p>
              <p><strong>Giá:</strong> {Number(food.price).toLocaleString()} VNĐ</p>
              <p><strong>Số lượng:</strong> {food.quantity}</p>
              <p><strong>Nguyên liệu:</strong> {(food.ingredients || []).join(', ')}</p>
              <p>{food.description}</p>

              <div className="actions">
                <button onClick={() => handleEdit(food)}>Sửa</button>
                <button className="danger" onClick={() => handleDelete(food._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App