import { useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const CATEGORIES = [
  { title: 'Software engineering', slug: 'engineering', blurb: 'Backend, frontend, mobile & more' },
  { title: 'Design & UX', slug: 'design', blurb: 'Product, visual, and research roles' },
  { title: 'Marketing', slug: 'marketing', blurb: 'Growth, content, and brand' },
  { title: 'Data & analytics', slug: 'data', blurb: 'Data science, BI, and ML' },
  { title: 'Sales & business', slug: 'sales', blurb: 'Account execs, SDRs, partnerships' },
  { title: 'Operations', slug: 'operations', blurb: 'Ops, logistics, and program management' },
  { title: 'HR & recruiting', slug: 'hr', blurb: 'People ops and talent' },
  { title: 'Finance', slug: 'finance', blurb: 'Accounting, FP&A, and treasury' },
  { title: 'Customer success', slug: 'customer-success', blurb: 'Support, CS, and implementation' },
];

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One category per slide; several visible at once on larger screens.
 * Pagination sits below the track so side arrows line up with the cards.
 */
function CategoryCarousel() {
  const swiperRef = useRef(null);
  const paginationClass = `category-pag-${useId().replace(/:/g, '')}`;
  const paginationSelector = `.${paginationClass}`;

  return (
    <section className="category-carousel py-4" aria-labelledby="category-carousel-heading">
      <h2 id="category-carousel-heading" className="jp-section-title h5 fw-bold mb-1 text-center">
        Browse by category
      </h2>
      <p className="text-center text-muted small mb-4 mx-auto col-md-8">
        Explore roles grouped by discipline — tap a card to filter listings.
      </p>

      <div className="category-carousel-outer">
        <div
          className={`${paginationClass} category-carousel-pagination-dots`}
          aria-label="Category slides"
        />

        <div className="category-carousel-grid">
          <button
            type="button"
            className="btn btn-primary jp-icon-btn category-carousel-nav-btn flex-shrink-0"
            aria-label="Previous categories"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft />
          </button>

          <div className="category-carousel-swiper-wrap min-w-0">
            <Swiper
              className="category-swiper"
              modules={[Pagination, Autoplay]}
              slidesPerView={1.08}
              spaceBetween={14}
              breakpoints={{
                576: { slidesPerView: 2, spaceBetween: 14 },
                992: { slidesPerView: 3, spaceBetween: 16 },
              }}
              pagination={{ clickable: true, el: paginationSelector }}
              loop={CATEGORIES.length > 3}
              grabCursor
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              watchOverflow
              onBeforeInit={(swiper) => {
                swiper.params.pagination.el = paginationSelector;
              }}
              onSwiper={(instance) => {
                swiperRef.current = instance;
              }}
            >
              {CATEGORIES.map((cat) => (
                <SwiperSlide key={cat.slug} className="h-auto">
                  <Link
                    to={`/jobs?category=${encodeURIComponent(cat.slug)}`}
                    className="card jp-cat-card h-100 text-decoration-none text-dark category-carousel-card"
                  >
                    <div className="card-body">
                      <h3 className="h6 fw-semibold text-primary mb-1">{cat.title}</h3>
                      <p className="small text-muted mb-0">{cat.blurb}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button
            type="button"
            className="btn btn-primary jp-icon-btn category-carousel-nav-btn flex-shrink-0"
            aria-label="Next categories"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CategoryCarousel;
