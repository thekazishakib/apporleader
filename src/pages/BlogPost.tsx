import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';
import Markdown from 'react-markdown';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogs } = useAdmin();
  
  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="w-full bg-[#0a0a0a] min-h-[60vh] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-400 mb-8">The article you are looking for does not exist.</p>
        <button onClick={() => navigate('/blogs')} className="px-6 py-2 bg-primary text-black font-bold rounded-full hover:bg-primary/90">
          Back to Blogs
        </button>
      </div>
    );
  }

  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing content');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pb-24">
      <Helmet>
        <title>{blog.title} | ApporLeader</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={getDriveImageUrl(blog.image)} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={getDriveImageUrl(blog.image)} />
      </Helmet>

      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[60vh] relative">
        <img 
          src={getDriveImageUrl(blog.image)} 
          alt={blog.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <Link to="/blogs" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to all blogs
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#050505] rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center text-primary font-medium">
              <Calendar size={18} className="mr-2" />
              {blog.date}
            </div>
            <button onClick={handleShare} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
            <div className="markdown-body">
              <Markdown>{blog.content}</Markdown>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
