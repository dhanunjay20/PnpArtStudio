import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

function normalizeImagesPair(imagesInput, imageInput) {
  const collected = [];
  const pushStr = (v) => {
    if (typeof v === "string") {
      const s = v.trim();
      if (s) collected.push(s);
    }
  };
  if (Array.isArray(imagesInput)) imagesInput.forEach(pushStr);
  else pushStr(imagesInput);
  if (Array.isArray(imageInput)) imageInput.forEach(pushStr);
  else pushStr(imageInput);

  const images = Array.from(new Set(collected));
  const image = images.length ? images : undefined;
  return { images, image };
}

// List
router.get("/", async (req, res, next) => {
  try {
    const { published, category, subcategory } = req.query;
    const q = {};
    if (published === "true") q.published = true;
    if (published === "false") q.published = false;
    if (category) q.category = category;
    if (subcategory) q.subcategory = subcategory;
    const items = await Product.find(q).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// Get one
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// Create
router.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};

    // Normalize gallery and cover from either field
    const { images, image } = normalizeImagesPair(b.images, b.image);

    const isIndian = b.category === "Indian Products";
    if (isIndian && !b.subcategory) {
      return res
        .status(400)
        .json({ message: "subcategory is required for Indian Products" });
    }

    const payload = {
      title: b.title,
      category: b.category,
      subcategory: isIndian ? b.subcategory : undefined,
      price: Number(b.price),
      salePrice:
        b.salePrice !== null && b.salePrice !== undefined
          ? b.salePrice === "" ? null : Number(b.salePrice)
          : null,
      stock: b.stock ? Number(b.stock) : 1,

      images,
      image,

      description: b.description || "",
      dimensions: b.dimensions || "",
      medium: b.medium || "",
      year:
        b.year !== undefined && b.year !== null && b.year !== ""
          ? Number(b.year)
          : undefined,

      inStock: b.inStock === true || b.inStock === "true",
      featured: b.featured === true || b.featured === "true",

      published: b.published === true || b.published === "true",
      slug: (b.title || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    };

    const doc = await Product.create(payload);
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const b = req.body || {};

    const update = {
      title: b.title,
      category: b.category,
      price: b.price !== undefined ? Number(b.price) : undefined,
      salePrice:
        b.salePrice !== undefined
          ? b.salePrice === "" || b.salePrice === null
            ? null
            : Number(b.salePrice)
          : undefined,
      stock: b.stock !== undefined ? Number(b.stock) : undefined,

      description: b.description,
      dimensions: b.dimensions,
      medium: b.medium,
      year:
        b.year !== undefined && b.year !== null && b.year !== ""
          ? Number(b.year)
          : undefined,

      inStock:
        b.inStock !== undefined ? (b.inStock === true || b.inStock === "true") : undefined,
      featured:
        b.featured !== undefined ? (b.featured === true || b.featured === "true") : undefined,

      published:
        b.published !== undefined ? (b.published === true || b.published === "true") : undefined,
      slug: b.title
        ? b.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : undefined
    };

    // Sync gallery and cover if provided
    if (b.images !== undefined || b.image !== undefined) {
      const { images, image } = normalizeImagesPair(b.images, b.image);
      update.images = images;
      if (images.length === 0) {
        update.$unset = { ...(update.$unset || {}), image: "" };
      } else {
        update.image = image;
      }
    }

    // Subcategory transitions
    if (b.category !== undefined) {
      if (b.category === "Indian Products") {
        if (!b.subcategory) {
          return res
            .status(400)
            .json({ message: "subcategory is required for Indian Products" });
        }
        update.subcategory = b.subcategory;
      } else {
        update.$unset = { ...(update.$unset || {}), subcategory: "" };
      }
    } else if (b.subcategory !== undefined) {
      const current = await Product.findById(req.params.id).select("category");
      if (!current) return res.status(404).json({ message: "Not found" });
      if (current.category === "Indian Products") {
        update.subcategory = b.subcategory;
      } else {
        update.$unset = { ...(update.$unset || {}), subcategory: "" };
      }
    }

    const doc = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
      context: "query"
    });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
