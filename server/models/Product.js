import mongoose from "mongoose";

const CATEGORY_VALUES = [
  "Paintings",
  "Indian Products",
  "Workshops",
  "Custom Orders",
  "Digital Prints",
  "Handcrafted Items",
  "Limited Editions"
];

const INDIAN_SUBCATEGORIES = [
  "Kolam coasters",
  "Kolam peetham",
  "Traditional magnets",
  "Trays",
  "Diya holders"
];

const currentYear = new Date().getFullYear();

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    category: {
      type: String,
      enum: CATEGORY_VALUES,
      required: true,
      trim: true
    },

    // Conditionally required when category is "Indian Products"
    subcategory: {
      type: String,
      enum: INDIAN_SUBCATEGORIES,
      required: function () {
        return this.category === "Indian Products";
      }
    },

    price: { type: Number, required: true, min: 0 },

    salePrice: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator: function (v) {
          if (v == null) return true;
          return v <= this.price;
        },
        message: "salePrice cannot exceed price"
      }
    },

    stock: { type: Number, default: 1, min: 0 },

    // Cover image as a single string URL
    image: {
      type: String,
      trim: true,
      default: undefined
    },

    // Gallery as an array of URL strings; setter coerces into array
    images: {
      type: [String],
      default: [],
      set: (v) => (Array.isArray(v) ? v.filter(Boolean) : v ? [v] : [])
    },

    description: { type: String, default: "" },
    dimensions: { type: String, default: "", trim: true },
    medium: { type: String, default: "", trim: true },

    year: {
      type: Number,
      min: 1900,
      max: currentYear,
      default: currentYear,
      validate: { validator: Number.isInteger, message: "year must be an integer" }
    },

    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },

    // Auto-generated slug; use unique+sparse to avoid legacy null conflicts
    slug: { type: String, index: true, unique: true, sparse: true }
  },
  { timestamps: true }
);

// Keep cover image, slug, and inStock derived before validation
productSchema.pre("validate", function (next) {
  if (Array.isArray(this.images) && this.images.length > 0) {
    this.image = this.images;
  } else if (!this.images || this.images.length === 0) {
    this.image = undefined;
  }
  if (this.title) {
    this.slug = slugify(this.title);
  }
  if (typeof this.inStock !== "boolean") {
    this.inStock = (typeof this.stock === "number" ? this.stock : 0) > 0;
  }
  next();
});

// Enforce cross-field consistency on updates as well
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() || {};
  const $set = update.$set || {};

  // If title provided, regenerate slug
  const nextTitle = $set.title ?? update.title;
  if (typeof nextTitle === "string" && nextTitle.trim()) {
    $set.slug = slugify(nextTitle);
  }

  // If images/image provided, normalize and set cover
  const collect = [];
  const pushStr = (v) => {
    if (typeof v === "string") {
      const s = v.trim();
      if (s) collect.push(s);
    }
  };
  if ("images" in update || "images" in $set || "image" in update || "image" in $set) {
    const imgsInput = $set.images ?? update.images;
    const imgInput = $set.image ?? update.image;
    if (Array.isArray(imgsInput)) imgsInput.forEach(pushStr);
    else pushStr(imgsInput);
    if (Array.isArray(imgInput)) imgInput.forEach(pushStr);
    else pushStr(imgInput);

    const unique = Array.from(new Set(collect));
    $set.images = unique;
    if (unique.length === 0) {
      update.$unset = { ...(update.$unset || {}), image: "" };
    } else {
      $set.image = unique;
    }
  }

  // If switching away from Indian Products, drop subcategory
  const nextCategory = $set.category ?? update.category;
  if (nextCategory && nextCategory !== "Indian Products") {
    update.$unset = { ...(update.$unset || {}), subcategory: "" };
  }

  // Validate salePrice ≤ price on update
  const nextSale = $set.salePrice ?? update.salePrice;
  if (nextSale != null) {
    let comparePrice = $set.price ?? update.price;
    if (comparePrice == null) {
      const doc = await this.model.findOne(this.getQuery()).select("price").lean();
      comparePrice = doc?.price;
    }
    if (typeof comparePrice === "number" && nextSale > comparePrice) {
      const err = new Error("salePrice cannot exceed price");
      err.status = 400;
      return next(err);
    }
  }

  update.$set = $set;
  this.setUpdate(update);
  next();
});

export default mongoose.model("Product", productSchema);
