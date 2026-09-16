export type Role = "admin" | "professor";

export type Profile = {
  id: string;
  role: Role;
  display_name: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
  position: number;
  created_at: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  position: number;
  created_at: string;
};

export type CategoryWithSubs = Category & {
  subcategories: Subcategory[];
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_by: string | null;
  created_at: string;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  subcategory_id: string | null;
  professor_name: string | null;
  link_url: string | null;
  file_path: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ItemWithTags = Item & {
  tags: Tag[];
  subcategory: (Subcategory & { category: Category }) | null;
};

export type SimilarTag = {
  id: string;
  name: string;
  similarity: number;
};
