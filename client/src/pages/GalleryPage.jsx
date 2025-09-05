import React, { useState } from 'react';
import { X, Filter, Grid, Search, Heart, Share2 } from 'lucide-react';

// Custom CSS to replicate styles not available in Bootstrap by default
const CustomStyles = () => (
  <style>{`
    body {
      background-color: #f8f9fa;
    }

    .gallery-page-bg {
      background: linear-gradient(to bottom right, #fff1f2, #fff7ed);
    }

    /* Masonry Layout */
    .gallery-masonry {
      column-gap: 1.5rem;
    }
    @media (min-width: 576px) { .gallery-masonry { column-count: 2; } }
    @media (min-width: 992px) { .gallery-masonry { column-count: 3; } }
    @media (min-width: 1200px) { .gallery-masonry { column-count: 4; } }

    .masonry-item {
      break-inside: avoid;
      margin-bottom: 1.5rem;
    }

    /* Gallery Card Hover Effects */
    .gallery-card .card-img-top {
      transition: transform 0.7s ease;
    }
    .gallery-card:hover .card-img-top {
      transform: scale(1.1);
    }
    .gallery-card .card-img-overlay {
      background-color: rgba(0,0,0,0);
      transition: background-color 0.3s ease;
    }
    .gallery-card:hover .card-img-overlay {
      background-color: rgba(0,0,0,0.5);
    }
    .gallery-card .overlay-content {
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .gallery-card:hover .overlay-content {
      opacity: 1;
      transform: scale(1);
    }

    /* Modal Styling */
    .modal.show {
      background-color: rgba(0,0,0,0.85);
    }
    .modal-content {
      border: none;
      border-radius: 1rem; /* .rounded-4 */
    }
    .btn-close-modal {
      position: absolute;
      top: -3rem;
      right: 0;
      color: white;
      background: none;
      border: none;
      opacity: 0.9;
    }
    .btn-close-modal:hover {
      opacity: 1;
    }
  `}</style>
);

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('masonry');
  const [searchTerm, setSearchTerm] = useState('');

  const galleryImages = [
    { id: 1, src: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop", title: "Abstract Harmony", category: "Paintings", year: 2024, medium: "Acrylic on Canvas", description: "A vibrant exploration of color and form that speaks to the soul." },
    { id: 2, src: "https://images.pexels.com/photos/1183021/pexels-photo-1183021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", title: "Mountain Serenity", category: "Paintings", year: 2024, medium: "Oil on Canvas", description: "Peaceful landscape capturing nature's magnificent beauty." },
    { id: 3, src: "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop", title: "Urban Dreams", category: "Paintings", year: 2023, medium: "Mixed Media", description: "Contemporary urban scene with bold colors and dynamic energy." },
    { id: 4, src: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop", title: "Floral Elegance", category: "Paintings", year: 2023, medium: "Watercolor", description: "Delicate flowers painted with soft, flowing brushstrokes." },
    { id: 5, src: "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", title: "Handcrafted Beauty", category: "Handcrafted Items", year: 2024, medium: "Mixed Materials", description: "Unique handcrafted piece combining multiple artistic techniques." },
    { id: 6, src: "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop", title: "Ocean Waves", category: "Paintings", year: 2024, medium: "Oil on Canvas", description: "Dynamic seascape capturing the power of nature." },
    { id: 7, src: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop", title: "Workshop Memories", category: "Exhibitions", year: 2023, medium: "Photography", description: "Behind-the-scenes moments from our art workshops." },
    { id: 8, src: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop", title: "Portrait Study", category: "Paintings", year: 2024, medium: "Oil on Canvas", description: "Expressive portrait capturing human emotion and character." }
  ];

  const categories = ['All', 'Paintings', 'Handcrafted Items', 'Exhibitions'];

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = filterCategory === 'All' || image.category === filterCategory;
    const matchesSearch = searchTerm === '' ||
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (image) => setSelectedImage(image);
  const closeLightbox = () => setSelectedImage(null);

  return (
    <>
      <CustomStyles />
      <div className="min-vh-100 gallery-page-bg">
        <div className="container-xl py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-4">Art Gallery</h1>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: '42rem' }}>
              Explore our complete collection of original artworks, exhibitions, and creative moments
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-4 shadow-lg p-4 mb-5">
            <div className="d-flex flex-column flex-lg-row gap-4 align-items-center justify-content-between">
              {/* Search */}
              <div className="position-relative w-100" style={{ maxWidth: '450px' }}>
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5 py-2"
                />
              </div>

              <div className="d-flex align-items-center gap-2 gap-md-4 flex-wrap justify-content-center">
                {/* Category Filter */}
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`btn rounded-pill ${filterCategory === category ? 'btn-danger' : 'btn-light text-secondary'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="btn-group bg-light p-1 rounded">
                  <button onClick={() => setViewMode('masonry')} className={`btn border-0 ${viewMode === 'masonry' ? 'bg-white shadow-sm' : 'bg-transparent'}`} title="Masonry View">
                    <Filter size={16} />
                  </button>
                  <button onClick={() => setViewMode('grid')} className={`btn border-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'bg-transparent'}`} title="Grid View">
                    <Grid size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-muted">
              Showing {filteredImages.length} artwork{filteredImages.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className={viewMode === 'masonry' ? 'gallery-masonry' : 'row g-4'}>
            {filteredImages.map((image) => {
              const galleryItem = (
                <div className="gallery-card" onClick={() => openLightbox(image)} style={{ cursor: 'pointer' }}>
                  <div className="card border-0 overflow-hidden rounded-4 shadow-lg h-100">
                    <img src={image.src} alt={image.title} className="card-img-top w-100" style={{ objectFit: 'cover' }} />
                    <div className="card-img-overlay d-flex align-items-center justify-content-center p-4">
                      <div className="overlay-content text-white text-center">
                        <h3 className="h5 fw-semibold mb-2">{image.title}</h3>
                        <p className="small mb-2">{image.medium} • {image.year}</p>
                      </div>
                    </div>
                    <span className="badge bg-light text-dark position-absolute top-0 start-0 m-3">{image.category}</span>
                  </div>
                </div>
              );

              if (viewMode === 'masonry') {
                return <div key={image.id} className="masonry-item">{galleryItem}</div>;
              } else {
                return <div key={image.id} className="col-sm-6 col-lg-4 col-xl-3">{galleryItem}</div>;
              }
            })}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-5">
            <button className="btn btn-danger btn-lg rounded-pill px-5 py-3 fw-semibold">
              Load More Artworks
            </button>
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
            <div className="modal fade show" style={{ display: 'block', zIndex: 1055 }} onClick={closeLightbox}>
              <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <button onClick={closeLightbox} className="btn-close-modal">
                    <X size={32} />
                  </button>
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="img-fluid"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  />
                  <div className="modal-body p-4">
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <h2 className="h4 fw-bold text-dark mb-2">{selectedImage.title}</h2>
                        <p className="text-muted mb-2">{selectedImage.medium} • {selectedImage.year}</p>
                        <p className="text-secondary">{selectedImage.description}</p>
                      </div>
                      <div className="d-flex gap-2 ps-3">
                        <button className="btn btn-light text-danger">
                          <Heart size={20} />
                        </button>
                        <button className="btn btn-light">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GalleryPage;