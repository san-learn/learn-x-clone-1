export interface NewsInterface {
  author: string;
  content: string;
  description: string;
  publishedAt: Date;
  source: { id: string; name: string };
  title: string;
  url: string;
  urlToImage: string;
}

export interface PostInterface {
  id: string;
  image: string;
  name: string;
  profileImage: string;
  text: string;
  timestamp: Date;
  uid: string;
  username: string;
}
export interface CommentInterface {
  id: string;
  text: string;
  name: string;
  profileImage: string;
  timestamp: Date;
  uid: string;
  username: string;
}
