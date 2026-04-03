interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilters = ({ categories, selected, onSelect }: Props) => (
  <div className="flex gap-2 flex-wrap">
    {categories.map((cat) => {
      const active = cat === selected;
      return (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            active
              ? "bg-purple-600 text-white border-purple-500 shadow-md"
              : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export default CategoryFilters;
