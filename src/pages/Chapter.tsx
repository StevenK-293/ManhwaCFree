import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { getChapter } from '../api';
import { ChapterData } from '../types';

const Chapter = () => {
  const { slug, chapter } = useParams<{ slug?: string; chapter?: string }>();
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!slug || !chapter) return;
      
      setLoading(true);
      setError(null);

      try {
        const chapterData = await getChapter(slug, chapter);
        setData(chapterData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chapter. Please try again later.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
    window.scrollTo(0, 0);
  }, [slug, chapter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center text-red-400 bg-red-900/20 py-3 px-4 rounded-lg max-w-md">
          {error}
        </div>
        <Link
          to={`/manga/${slug}`}
          className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Manga</span>
        </Link>
      </div>
    );
  }

  if (!data || !data.images?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center text-gray-400">
          No chapter data found.
        </div>
        <Link
          to={`/manga/${slug}`}
          className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Manga</span>
        </Link>
      </div>
    );
  }

const extractChapterNumber = (chapterUrl: string | null) => {
  if (!chapterUrl) return null;

  const match = chapterUrl.match(/chapter-(\d+)/);
  return match ? match[0] : null;
};

const prevChapterNumber = extractChapterNumber(data?.prevChapter);
const nextChapterNumber = extractChapterNumber(data?.nextChapter);

const prevChapter = prevChapterNumber ? `/manga/${slug}/${prevChapterNumber}` : null;
const nextChapter = nextChapterNumber ? `/manga/${slug}/${nextChapterNumber}` : null;

// console.log("Extracted Prev Chapter:", prevChapter);
// console.log("Extracted Next Chapter:", nextChapter);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm p-4 -mx-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            to={`/manga/${slug}`}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Manga</span>
          </Link>

          <div className="flex items-center space-x-4">
            {prevChapter ? (
              <Link
                to={prevChapter}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Link>
            ) : null}
            
            {nextChapter ? (
              <Link
                to={nextChapter}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Chapter Images */}
      <div className="space-y-4">
        {data.images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.proxied}
              alt={`Page ${index + 1}`}
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
              {index + 1} / {data.images.length}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 z-50 bg-gray-900/95 backdrop-blur-sm p-4 -mx-4">
        <div className="flex items-center justify-center space-x-4 max-w-4xl mx-auto">
          {prevChapter ? (
            <Link
              to={prevChapter}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Chapter</span>
            </Link>
          ) : null}
          
          {nextChapter ? (
            <Link
              to={nextChapter}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chapter;
