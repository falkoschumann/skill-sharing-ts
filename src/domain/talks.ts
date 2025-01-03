export type Talk = {
  title: string;
  presenter: string;
  summary: string;
  comments: Comment[];
};

export type Comment = {
  author: string;
  message: string;
};
