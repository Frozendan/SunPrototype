"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { mockDashboardData } from "@/data/mock-dashboard-data";
import type { DashboardData, DashboardCardState } from "@/types/dashboard";

interface UseDashboardReturn {
  data: DashboardData;
  states: {
    timeOffSummary: DashboardCardState;
    timeOffRequests: DashboardCardState;
    myStuff: DashboardCardState;
    calendar: DashboardCardState;
    tasks: DashboardCardState;
    news: DashboardCardState;
    celebrations: DashboardCardState;
    whosOut: DashboardCardState;
    welcome: DashboardCardState;
  };
  actions: {
    onRequestTimeOff: () => void;
    onCalculateTimeOff: () => void;
    onViewAllTimeOffRequests: () => void;
    onViewFullCalendar: () => void;
    onViewAllTasks: () => void;
    onMarkTaskComplete: (taskId: string) => void;
    onViewTaskDetails: (taskId: string) => void;
    onViewAllNews: () => void;
    onReadMoreNews: (articleId: string) => void;
  };
  refreshData: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(mockDashboardData);
  const [isLoading, setIsLoading] = useState(true);

  // Individual loading states for each card
  const [states, setStates] = useState({
    timeOffSummary: { isLoading: true, error: undefined, lastUpdated: undefined },
    timeOffRequests: { isLoading: true, error: undefined, lastUpdated: undefined },
    myStuff: { isLoading: true, error: undefined, lastUpdated: undefined },
    calendar: { isLoading: true, error: undefined, lastUpdated: undefined },
    tasks: { isLoading: true, error: undefined, lastUpdated: undefined },
    news: { isLoading: true, error: undefined, lastUpdated: undefined },
    celebrations: { isLoading: true, error: undefined, lastUpdated: undefined },
    whosOut: { isLoading: true, error: undefined, lastUpdated: undefined },
    welcome: { isLoading: true, error: undefined, lastUpdated: undefined },
  });

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API calls with different loading times
        const loadingPromises = [
          new Promise(resolve => setTimeout(resolve, 800)), // timeOffSummary
          new Promise(resolve => setTimeout(resolve, 1000)), // timeOffRequests
          new Promise(resolve => setTimeout(resolve, 650)), // myStuff
          new Promise(resolve => setTimeout(resolve, 600)), // calendar
          new Promise(resolve => setTimeout(resolve, 900)), // tasks
          new Promise(resolve => setTimeout(resolve, 1200)), // news
          new Promise(resolve => setTimeout(resolve, 700)), // celebrations
          new Promise(resolve => setTimeout(resolve, 500)), // whosOut
          new Promise(resolve => setTimeout(resolve, 1100)), // welcome
        ];

        const cardNames = [
          'timeOffSummary',
          'timeOffRequests',
          'myStuff',
          'calendar',
          'tasks',
          'news',
          'celebrations',
          'whosOut',
          'welcome'
        ] as const;

        // Update each card's loading state as it completes
        loadingPromises.forEach((promise, index) => {
          promise.then(() => {
            const cardName = cardNames[index];
            setStates(prev => ({
              ...prev,
              [cardName]: {
                isLoading: false,
                error: undefined,
                lastUpdated: new Date().toISOString(),
              },
            }));
          });
        });

        // Wait for all to complete
        await Promise.all(loadingPromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set error states for all cards
        setStates(prev => {
          const newStates = { ...prev };
          Object.keys(newStates).forEach(key => {
            newStates[key as keyof typeof newStates] = {
              isLoading: false,
              error: 'Failed to load data',
              lastUpdated: undefined,
            };
          });
          return newStates;
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Action handlers
  const onRequestTimeOff = useCallback(() => {
    // Navigate to time off request page
    navigate('/time-management/request');
  }, [navigate]);

  const onCalculateTimeOff = useCallback(() => {
    // Open time off calculator modal or navigate to calculator page
    console.log('Calculate time off clicked');
  }, []);

  const onViewAllTimeOffRequests = useCallback(() => {
    navigate('/time-management/requests');
  }, [navigate]);

  const onViewFullCalendar = useCallback(() => {
    navigate('/time-management/calendar');
  }, [navigate]);

  const onViewAllTasks = useCallback(() => {
    navigate('/task-management/tasks');
  }, [navigate]);

  const onMarkTaskComplete = useCallback((taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'done' as const, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  }, []);

  const onViewTaskDetails = useCallback((taskId: string) => {
    navigate(`/task-management/tasks/${taskId}`);
  }, [navigate]);

  const onViewAllNews = useCallback(() => {
    navigate('/news/articles');
  }, [navigate]);

  const onReadMoreNews = useCallback((articleId: string) => {
    navigate(`/news/articles/${articleId}`);
  }, [navigate]);

  const refreshData = useCallback(() => {
    // Reset loading states
    setStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(key => {
        newStates[key as keyof typeof newStates] = {
          isLoading: true,
          error: undefined,
          lastUpdated: undefined,
        };
      });
      return newStates;
    });

    // Simulate refresh
    setTimeout(() => {
      setData({ ...mockDashboardData });
      setStates(prev => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach(key => {
          newStates[key as keyof typeof newStates] = {
            isLoading: false,
            error: undefined,
            lastUpdated: new Date().toISOString(),
          };
        });
        return newStates;
      });
    }, 1000);
  }, []);

  return {
    data,
    states,
    actions: {
      onRequestTimeOff,
      onCalculateTimeOff,
      onViewAllTimeOffRequests,
      onViewFullCalendar,
      onViewAllTasks,
      onMarkTaskComplete,
      onViewTaskDetails,
      onViewAllNews,
      onReadMoreNews,
    },
    refreshData,
  };
}
