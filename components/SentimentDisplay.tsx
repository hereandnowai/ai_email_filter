
import React from 'react';
import { Sentiment } from '../types';
import { SENTIMENT_CONFIG, ICONS } from '../constants';

interface SentimentDisplayProps {
  sentiment?: Sentiment;
  loading?: boolean;
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment, loading }) => {
  if (loading) {
    return <span className="text-xs text-gray-500 dark:text-gray-400 italic">Analyzing...</span>;
  }

  if (!sentiment || sentiment === Sentiment.Unknown) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">N/A</span>;
  }

  const config = SENTIMENT_CONFIG[sentiment];

  let icon;
  switch (sentiment) {
    case Sentiment.Positive: icon = ICONS.checkCircle("w-4 h-4 mr-1 " + config.color); break;
    case Sentiment.Negative: icon = ICONS.xCircle("w-4 h-4 mr-1 " + config.color); break;
    case Sentiment.Neutral: icon = ICONS.informationCircle("w-4 h-4 mr-1 " + config.color); break;
    case Sentiment.Mixed: icon = ICONS.sparkles("w-4 h-4 mr-1 " + config.color); break;
    default: icon = null;
  }
  

  return (
    <span className={`flex items-center text-xs font-medium ${config.color}`}>
      {icon}
      {config.label}
    </span>
  );
};

export default SentimentDisplay;
