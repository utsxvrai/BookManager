export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  created_at: string;
};

export type BookmarkInsert = Omit<Bookmark, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
