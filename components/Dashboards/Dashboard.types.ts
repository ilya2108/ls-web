export type StudentData = {
  username: string;
  userStats: {
    results: {
      course: {
        id: number;
      };
      finalScorePrediction: number;
      score: number;
      scoreHistory: number[];
      percentileHistory: number[];
      percentileHistoryIdle: number[];
      userAssignmentStat: {
        results: {
          assignment: {
            id: number;
            name: string;
            median: number;
            maxScore: number;
            weekOfSemester: number;
          };
          score: number;
          percentile: number;
        }[];
      };
    }[];
  };
  coursesAsStudent: {
    totalCount: number;
    results: {
      name: string;
      id: number;
      kosTag: string;
      coursestat: {
        median: number;
        medianHistory: number[];
        medianHistoryIdle: number[];
        scoreHistogram: {
          results: {
            score: number;
            frequency: number;
          }[];
        };
      };
    }[];
  };
};
