import Product from "../models/ProductModel.js";

export const createProduct = async (req, res) => {
  const { title, price, description, category, brand, quantity, color } = req.body;
  const file = req.file;
  const url = file.path;
  console.log(url);

  try {
    const data = await Product.create({
      title: title,
      price: price,
      description: description,
      category: category,
      brand: brand,
      quantity: quantity,
      thumbnail: url,
      color: color,
    });
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const geAllProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Product.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, price, description, category, brand, quantity, color } = req.body;
  const file = req.file;
  const url = file?.path;
  console.log(url);
  try {
    const data = await Product.findByIdAndUpdate(
      id,
      {
        title: title,
        price: price,
        description: description,
        category: category,
        brand: brand,
        quantity: quantity,
        thumbnail: url,
        color: color,
      },
      {
        new: true,
      }
    );
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Product.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addImages = async (req, res) => {
  const { id } = req.params;
  const files = req.files;
  const path = files.map((file) => file.path);
  console.log(files);

  try {
    const data = await Product.findByIdAndUpdate(
      id,
      {
        images: path,
      },
      {
        new: true,
      }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
