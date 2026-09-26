-- Database Indexes for Exvorta Performance
-- Run this in your Neon PostgreSQL database

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_media_alternate_text ON media(alternate_text);
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_redirects_origin ON redirects(origin);

-- Full-text search indexes
ALTER TABLE pages ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE pages SET search_vector = to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''));
CREATE INDEX IF NOT EXISTS idx_pages_search_vector ON pages USING gin(search_vector);

COMMENT ON INDEX idx_leads_email IS 'Optimize lead lookup by email';
COMMENT ON INDEX idx_leads_source IS 'Optimize filtering by lead source';
COMMENT ON INDEX idx_pages_search_vector IS 'Enable full-text search on pages';
