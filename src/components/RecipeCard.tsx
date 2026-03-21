import React from "react";
import { Recipe } from "../types";
import { Clock, ExternalLink, Trash2, Plus, Edit2 } from "lucide-react";
import { motion } from "motion/react";
import { getImageUrl } from "../utils/imageUrl";
import { useTheme } from "../context/ThemeContext";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (id: string) => void;
  onEdit?: (recipe: Recipe) => void;
  onAddToPlanner?: (recipe: Recipe) => void;
  onClick?: (recipe: Recipe) => void;
  isDraggable?: boolean;
}

export const MEAL_TIME_LABELS: Record<string, { label: string, icon: string }> = {
  breakfast: { label: "Frühstück", icon: "🍳" },
  lunch: { label: "Mittagessen", icon: "🥗" },
  dinner: { label: "Abendessen", icon: "🍲" },
  snack: { label: "Snack", icon: "🍎" },
};

export const CATEGORY_LABELS: Record<string, { label: string, icon: string }> = {
  komplett: { label: "Komplett", icon: "🍱" },
  gemuese: { label: "Gemüse", icon: "🥦" },
  fleisch: { label: "Fleisch", icon: "🥩" },
  staerke: { label: "Stärke", icon: "🥔" },
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onEdit, onAddToPlanner, onClick, isDraggable }) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => onClick?.(recipe)}
      className={`p-3 shadow-md rounded-sm border transform rotate-1 hover:rotate-0 transition-all duration-300 flex flex-col gap-2 w-full max-w-[240px] ${onClick ? 'cursor-pointer' : ''} ${isDark ? "bg-slate-900 border-slate-800 shadow-slate-950/50" : "bg-white border-gray-100 shadow-gray-200"}`}
    >
      <div className={`aspect-square w-full overflow-hidden rounded-sm relative group transition-colors ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
        {recipe.image ? (
          <img
            src={getImageUrl(recipe.image)}
            alt={recipe.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center transition-colors ${isDark ? "text-slate-600" : "text-gray-400"}`}>
            Kein Bild
          </div>
        )}

        <div className="absolute bottom-2 right-2 md:inset-0 md:bottom-0 md:right-0 bg-transparent md:bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex flex-row items-end md:items-center justify-end md:justify-center gap-1.5">
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 backdrop-blur-sm rounded-full shadow-sm md:shadow-none transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:text-indigo-400" : "bg-white text-gray-700 hover:text-indigo-600"}`}
              title="Quelle ansehen"
            >
              <ExternalLink size={16} />
            </a>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
              className={`p-1.5 backdrop-blur-sm rounded-full shadow-sm md:shadow-none transition-colors ${isDark ? "bg-slate-800 text-indigo-400 hover:bg-slate-700" : "bg-white text-indigo-600 hover:bg-indigo-50"}`}
              title="Rezept bearbeiten"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
              className={`p-1.5 backdrop-blur-sm rounded-full shadow-sm md:shadow-none transition-colors ${isDark ? "bg-slate-800 text-red-400 hover:bg-slate-700" : "bg-white text-red-500 hover:bg-red-50"}`}
              title="Rezept löschen"
            >
              <Trash2 size={16} />
            </button>
          )}
          {onAddToPlanner && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToPlanner(recipe); }}
              className={`p-1.5 backdrop-blur-sm rounded-full shadow-sm md:shadow-none transition-colors ${isDark ? "bg-slate-800 text-green-400 hover:bg-slate-700" : "bg-white text-green-500 hover:bg-green-50"}`}
              title="Zum Planer hinzufügen"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className={`font-serif font-bold leading-tight line-clamp-2 transition-colors ${isDark ? "text-slate-200" : "text-gray-800"}`}>
          {recipe.title}
        </h3>

        <div className={`flex flex-wrap items-center gap-2 text-xs mt-1 transition-colors ${isDark ? "text-slate-500" : "text-gray-500"}`}>
          {recipe.prepTime && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {recipe.prepTime}
            </span>
          )}
          {recipe.mealTime && MEAL_TIME_LABELS[recipe.mealTime] && (
             <span className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded shadow-sm border transition-colors ${isDark ? "bg-yellow-900/20 text-yellow-500 border-yellow-900/30" : "bg-yellow-50 text-yellow-700 border-yellow-100/50"}`}>
               <span className="text-[12px]">{MEAL_TIME_LABELS[recipe.mealTime].icon}</span>
               {MEAL_TIME_LABELS[recipe.mealTime].label}
             </span>
          )}
           {recipe.category && CATEGORY_LABELS[recipe.category] && (
             <span className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded shadow-sm border transition-colors ${isDark ? "bg-emerald-900/20 text-emerald-500 border-emerald-900/30" : "bg-emerald-50 text-emerald-700 border-emerald-100/50"}`}>
                 <span className="text-[12px]">{CATEGORY_LABELS[recipe.category].icon}</span>
                 {CATEGORY_LABELS[recipe.category].label}
             </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {(recipe.tags || []).map((tag) => (
            <span
              key={tag}
              className={`px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider transition-colors ${isDark ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const MiniRecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl border transition-all shadow-sm ${isDark ? "bg-slate-900 border-slate-800 hover:border-indigo-900/50" : "bg-white border-gray-100 hover:border-indigo-200"}`}>
      <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-colors ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
        {recipe.image ? (
          <img src={getImageUrl(recipe.image)} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-[10px] transition-colors ${isDark ? "text-slate-600" : "text-gray-300"}`}>N/A</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-xs font-bold truncate transition-colors ${isDark ? "text-slate-200" : "text-gray-700"}`}>{recipe.title}</h4>
        <div className={`flex items-center gap-1 text-[10px] transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          <Clock size={10} /> {recipe.prepTime || "N/A"}
        </div>
      </div>
    </div>
  );
};
