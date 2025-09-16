'use client';

import { useState } from 'react';
import { CreatePollData } from '../lib/types';
import { POLL_THEMES, POLL_DURATIONS, TOKEN_REWARDS } from '../lib/constants';
import { isValidPollData, generatePollId } from '../lib/utils';

interface CreatePollFormProps {
  onPollCreated: () => void;
}

export function CreatePollForm({ onPollCreated }: CreatePollFormProps) {
  const [formData, setFormData] = useState<CreatePollData>({
    question: '',
    options: ['', ''],
    duration: 24,
    isPublic: true,
    theme: 'default',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, ''],
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    const validOptions = formData.options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    const duplicateOptions = formData.options.filter((opt, index) => 
      opt.trim() && formData.options.findIndex(o => o.trim() === opt.trim()) !== index
    );
    if (duplicateOptions.length > 0) {
      newErrors.options = 'Options must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call to create poll
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would make an API call to create the poll
      const newPoll = {
        pollId: generatePollId(),
        creatorId: 'current-user',
        question: formData.question,
        options: formData.options
          .filter(opt => opt.trim())
          .map((opt, index) => ({
            id: (index + 1).toString(),
            text: opt.trim(),
            votes: 0,
            percentage: 0,
          })),
        theme: formData.theme,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + formData.duration * 60 * 60 * 1000),
        isPublic: formData.isPublic,
        totalVotes: 0,
      };

      console.log('Poll created:', newPoll);
      console.log(`Earned ${TOKEN_REWARDS.CREATE_POLL} tokens for creating a poll!`);

      // Reset form
      setFormData({
        question: '',
        options: ['', ''],
        duration: 24,
        isPublic: true,
        theme: 'default',
      });

      onPollCreated();
    } catch (error) {
      console.error('Error creating poll:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Create a New Poll</h2>
          <p className="text-text-secondary">
            Ask the community a question and earn {TOKEN_REWARDS.CREATE_POLL} tokens when you publish!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-text-primary mb-2">
              Poll Question *
            </label>
            <textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="What would you like to ask the community?"
              className={`input-field resize-none h-24 ${errors.question ? 'border-red-500' : ''}`}
              maxLength={200}
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-500">{errors.question}</p>
            )}
            <p className="mt-1 text-xs text-text-secondary">
              {formData.question.length}/200 characters
            </p>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Poll Options * (2-6 options)
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="input-field flex-1"
                    maxLength={100}
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-md transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.options && (
              <p className="mt-1 text-sm text-red-500">{errors.options}</p>
            )}
            {formData.options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center space-x-2 text-primary hover:text-opacity-80 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Option</span>
              </button>
            )}
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-text-primary mb-2">
              Poll Duration
            </label>
            <select
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              className="input-field"
            >
              {POLL_DURATIONS.map(duration => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Poll Theme
            </label>
            <div className="grid grid-cols-5 gap-2">
              {POLL_THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                  className={`p-3 rounded-md border-2 transition-all duration-200 ${
                    formData.theme === theme.id
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mx-auto"
                    style={{ backgroundColor: theme.color }}
                  />
                  <p className="text-xs mt-1 text-text-secondary">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="isPublic" className="text-sm text-text-primary">
              Make this poll public (visible to all users)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValidPollData(formData)}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Poll...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Poll (+{TOKEN_REWARDS.CREATE_POLL} tokens)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
