import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;