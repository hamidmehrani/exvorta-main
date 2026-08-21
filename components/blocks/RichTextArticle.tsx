import React from 'react';
import { Post } from '@/payload-types';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Hairline } from '@/components/ui/Hairline';
import Image from 'next/image';

type RichTextArticleProps = {
  post?: Post;
  content?: string;
  children?: React.ReactNode;
};

export const RichTextArticle: React.FC<RichTextArticleProps> = ({ post, content, children }) => {
  return (
    <div className="w-full bg-[#FCFAF8] text-obsidian pb-32">
      {/* Hero Section */}
      <section className="w-full pt-40 pb-20 px-6">
        <Container className="max-w-4xl mx-auto flex flex-col">
          {post && (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <MonoLabel className="text-black/50">
                  {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'UNKNOWN DATE'}
                </MonoLabel>
                <span className="text-black/30">&bull;</span>
                <MonoLabel className="text-black/50">
                  {typeof post.category === 'object' && post.category !== null && 'title' in post.category ? String((post.category as Record<string, unknown>).title) : 'UNCATEGORIZED'}
                </MonoLabel>
              </div>
              <h1 className="text-[48px] md:text-[60px] lg:text-[84px] leading-[1.1] tracking-[-0.02em] font-semibold font-serif text-[#0D0D0D] mb-8">
                {post.title}
              </h1>
              {typeof post.author === 'object' && post.author && (
                <div className="font-sans text-[15px] font-light text-[#0D0D0D]/60 italic mb-12">
                  By {post.author && typeof post.author === 'object' && 'name' in post.author ? String(post.author.name) : post.author && typeof post.author === 'object' && 'email' in post.author ? String((post.author as unknown as Record<string, unknown>).email) : 'Author'}
                </div>
              )}
              
              {typeof post.coverImage === 'object' && post.coverImage?.url && (
                <div className="w-full mb-16 aspect-video border border-black/10 relative overflow-hidden">
                  <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} className="object-cover" fill priority />
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Article Body */}
      <section className="w-full px-6">
        <Container className="max-w-4xl mx-auto">
          <div 
            className={`
              prose prose-lg max-w-none
              
              /* Typography Extracted from HTML Design */
              
              /* display-hero */
              prose-h1:text-[84px] prose-h1:leading-[1.1] prose-h1:tracking-[-0.02em] prose-h1:font-semibold prose-h1:font-serif prose-h1:mb-12
              prose-h1:text-[#0D0D0D]
              
              /* headline-xl for H2 */
              prose-h2:text-[60px] prose-h2:leading-[1.1] prose-h2:font-semibold prose-h2:font-serif prose-h2:mb-8 prose-h2:mt-16
              prose-h2:text-[#0D0D0D]
              
              /* headline-lg for H3 */
              prose-h3:text-[32px] prose-h3:leading-[1.2] prose-h3:font-semibold prose-h3:font-serif prose-h3:mb-6 prose-h3:mt-12
              prose-h3:text-[#0D0D0D]
              
              /* body-lg for standard paragraphs */
              prose-p:text-[18px] prose-p:leading-[1.6] prose-p:font-light prose-p:font-sans prose-p:mb-6
              prose-p:text-[#0D0D0D]/80
              
              /* body-md for blockquotes / smaller text */
              prose-blockquote:text-[15px] prose-blockquote:leading-[1.6] prose-blockquote:font-light prose-blockquote:font-sans prose-blockquote:italic
              prose-blockquote:border-l-2 prose-blockquote:border-black/20 prose-blockquote:pl-6 prose-blockquote:my-8
              
              /* mono-data / mono-terminal for code and pre */
              prose-code:text-[11px] prose-code:leading-[1.4] prose-code:font-normal prose-code:font-mono prose-code:bg-black/5 prose-code:px-1.5 prose-code:py-0.5
              prose-pre:text-[10px] prose-pre:leading-[1.2] prose-pre:font-normal prose-pre:font-mono prose-pre:bg-[#0A0A0A] prose-pre:text-white prose-pre:p-6 prose-pre:rounded-none
              
              /* label-caps for figcaption */
              prose-figcaption:text-[11px] prose-figcaption:leading-none prose-figcaption:tracking-[0.15em] prose-figcaption:font-medium prose-figcaption:font-sans prose-figcaption:uppercase prose-figcaption:text-black/50 prose-figcaption:mt-4 prose-figcaption:text-center
              
              /* Standard links */
              prose-a:text-black prose-a:underline prose-a:decoration-black/30 prose-a:underline-offset-4 hover:prose-a:decoration-black transition-all
              
              /* Lists */
              prose-ul:text-[18px] prose-ul:leading-[1.6] prose-ul:font-light prose-ul:font-sans prose-ul:text-[#0D0D0D]/80 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
              prose-ol:text-[18px] prose-ol:leading-[1.6] prose-ol:font-light prose-ol:font-sans prose-ol:text-[#0D0D0D]/80 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
              prose-li:mb-2
              
              /* Images */
              prose-img:w-full prose-img:border prose-img:border-black/10 prose-img:rounded-none
            `}
          >
            {post?.content ? (
              <RichText data={post.content as unknown as React.ComponentProps<typeof RichText>['data']} />
            ) : content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              children
            )}
          </div>
        </Container>
      </section>

      {/* Author Bio Section */}
      {post && typeof post.author === 'object' && post.author && (
        <section className="w-full px-6 mt-24">
          <Container className="max-w-4xl mx-auto">
            <Hairline className="bg-black/10 w-full mb-12" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-24 h-24 bg-black/5 rounded-full overflow-hidden flex-shrink-0">
                {/* Author Avatar if available */}
              </div>
              <div>
                <h4 className="text-xl font-serif text-obsidian mb-2">
                  {post.author && typeof post.author === 'object' && 'name' in post.author ? String(post.author.name) : 'Author'}
                </h4>
                <p className="text-sm text-black/60 font-light font-sans leading-relaxed">
                  {post.author && typeof post.author === 'object' && 'bio' in post.author ? String((post.author as Record<string, unknown>).bio) : 'Expert in global commodities trading and institutional-grade analysis.'}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
};
