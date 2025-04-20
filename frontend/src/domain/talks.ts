export interface Talk {
  title: string;
  presenter: string;
  summary: string;
  comments: Comment[];
}

export interface Comment {
  author: string;
  message: string;
}
