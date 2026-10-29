const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend is running'
  });
});

// GET danh sách + tìm kiếm
app.get('/api/foods', async (req, res) => {
  try {
    const search = req.query.search;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const foods = await Food.find(filter);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: 'Khong the lay danh sach mon an',
      error: error.message
    });
  }
});

// GET chi tiết
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: 'Khong tim thay mon an'
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({
      message: 'ID mon an khong hop le'
    });
  }
});

// POST thêm món
app.post('/api/foods', async (req, res) => {
  try {
    const {
      foodId,
      name,
      category,
      cuisine,
      price,
      quantity
    } = req.body;

    if (
      !foodId ||
      !name ||
      !category ||
      !cuisine ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message: 'Vui long nhap day du thong tin bat buoc'
      });
    }

    const existed = await Food.findOne({ foodId });

    if (existed) {
      return res.status(409).json({
        message: 'foodId da ton tai'
      });
    }

    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({
      message: 'Khong the them mon an',
      error: error.message
    });
  }
});

// PUT cập nhật
app.put('/api/foods/:id', async (req, res) => {
  try {
    if (req.body.foodId) {
      const existed = await Food.findOne({
        foodId: req.body.foodId,
        _id: { $ne: req.params.id }
      });

      if (existed) {
        return res.status(409).json({
          message: 'foodId da ton tai'
        });
      }
    }

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!food) {
      return res.status(404).json({
        message: 'Khong tim thay mon an'
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({
      message: 'Khong the cap nhat mon an',
      error: error.message
    });
  }
});

// DELETE
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: 'Khong tim thay mon an'
      });
    }

    res.status(200).json({
      message: 'Xoa mon an thanh cong'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Khong the xoa mon an'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});