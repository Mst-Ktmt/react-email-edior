'use client';

import { useState, useCallback, useEffect, type MouseEvent } from 'react';
import type { TimerBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: TimerBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeRemaining(endDate: string): TimeRemaining {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

export function TimerBlock({ props, blockId, isSelected, onClick }: Props) {
  const {
    endDate,
    showDays,
    showHours,
    showMinutes,
    showSeconds,
    fontSize,
    textColor,
    backgroundColor,
    padding,
    expiredMessage,
  } = props;

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(endDate)
  );
  const [isHovered, setIsHovered] = useState(false);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  // リアルタイム更新
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDuplicate = useCallback(() => {
    if (!blockId) return;
    const duplicatedBlock = {
      id: `timer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'timer' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [blockId, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!blockId) return;
    removeBlock(blockId);
  }, [blockId, removeBlock]);

  const formatNumber = (n: number): string => n.toString().padStart(2, '0');

  const renderTimeUnit = (value: number, label: string) => (
    <div className="flex flex-col items-center mx-2">
      <span
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
          fontWeight: 'bold',
        }}
      >
        {formatNumber(value)}
      </span>
      <span
        style={{
          fontSize: `${Math.max(fontSize * 0.5, 10)}px`,
          color: textColor,
          opacity: 0.7,
        }}
      >
        {label}
      </span>
    </div>
  );

  const renderSeparator = () => (
    <span
      style={{
        fontSize: `${fontSize}px`,
        color: textColor,
        fontWeight: 'bold',
      }}
      className="mx-1"
    >
      :
    </span>
  );

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''}`}
      style={{
        padding: paddingStyle,
        backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor,
      }}
      data-block-id={blockId}
    >
      {isHovered && blockId && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      <div className="flex justify-center items-center">
        {timeRemaining.expired ? (
          <span
            style={{
              fontSize: `${fontSize}px`,
              color: textColor,
            }}
          >
            {expiredMessage}
          </span>
        ) : (
          <div className="flex items-center">
            {showDays && (
              <>
                {renderTimeUnit(timeRemaining.days, '日')}
                {(showHours || showMinutes || showSeconds) && renderSeparator()}
              </>
            )}
            {showHours && (
              <>
                {renderTimeUnit(timeRemaining.hours, '時')}
                {(showMinutes || showSeconds) && renderSeparator()}
              </>
            )}
            {showMinutes && (
              <>
                {renderTimeUnit(timeRemaining.minutes, '分')}
                {showSeconds && renderSeparator()}
              </>
            )}
            {showSeconds && renderTimeUnit(timeRemaining.seconds, '秒')}
          </div>
        )}
      </div>
    </div>
  );
}
