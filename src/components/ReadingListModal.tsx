import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useReadingListStore, ReadingStatus } from '../store/readingListStore';
import { twMerge } from 'tailwind-merge';

interface ReadingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusFilters: { label: string; value: ReadingStatus; icon: React.FC }[] = [
  { label: 'Reading', value: 'reading', icon: BookOpen },
  { label: 'Completed', value: 'completed', icon: CheckCircle },
  { label: 'Plan to Read', value: 'plan_to_read', icon: Clock },
  { label: 'Dropped', value: 'dropped', icon: XCircle },
];

export const ReadingListModal: React.FC<ReadingListModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<ReadingStatus | 'all'>('all');
  const { items, loading } = useReadingListStore();

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.status === filter);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-50"
          open={isOpen}
          onClose={onClose}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl h-[80vh] overflow-hidden rounded-2xl bg-gray-800 shadow-xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <Dialog.Title className="text-xl font-semibold">
                  Reading List
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2 p-4 border-b border-gray-700 overflow-x-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={twMerge(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  )}
                >
                  All
                </button>
                {statusFilters.map(({ label, value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={twMerge(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center space-x-2',
                      filter === value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    )}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No items in your reading list
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gray-700/50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            {item.lastChapter && (
                              <p className="text-sm text-gray-400 mt-1">
                                Last read: {item.lastChapter}
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400">
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};