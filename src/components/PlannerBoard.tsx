import React from "react";
import { Recipe, PlannerSlot, DAYS, MEAL_TYPES, MealType } from "../types";
import { User, Star, Trash2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getImageUrl } from "../utils/imageUrl";
import { useTheme } from "../context/ThemeContext";

interface MealSlotProps {
  dayIndex: number;
  mealType: MealType;
  slot?: PlannerSlot;
  onAddRequest: (dayIndex: number, mealType: MealType) => void;
  onRemoveRecipe: (dayIndex: number, mealType: MealType, recipeId: string) => void;
  onUpdateHelper: (dayIndex: number, mealType: MealType, helperName: string) => void;
}

const MealSlot: React.FC<MealSlotProps> = ({ dayIndex, mealType, slot, onAddRequest, onRemoveRecipe, onUpdateHelper }) => {
  const { isDark } = useTheme();
  const mealConfig = MEAL_TYPES.find(m => m.id === mealType);

  return (
    <div
      className={`
        relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-all duration-300 min-h-[120px] 
        ${(slot?.recipes && slot.recipes.length > 0) 
          ? (isDark ? "border-transparent bg-slate-900 shadow-sm" : "border-transparent bg-white shadow-sm") 
          : (isDark ? "border-dashed border-slate-800 bg-slate-900/40" : "border-dashed border-gray-200 bg-white/50")}
      `}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{mealConfig?.icon}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>{mealConfig?.label}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {slot?.recipes && slot.recipes.length > 0 ? (
            slot.recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative flex items-center gap-2 p-2 rounded-lg shadow-sm border transition-colors ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
              >
                <div className={`w-8 h-8 rounded overflow-hidden flex-shrink-0 transition-colors ${isDark ? "bg-slate-700" : "bg-gray-100"}`}>
                  {recipe.image ? (
                    <img src={getImageUrl(recipe.image)} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-[8px] transition-colors ${isDark ? "text-slate-500" : "text-gray-300"}`}>N/A</div>
                  )}
                </div>
                <span className={`text-xs font-bold truncate flex-1 transition-colors ${isDark ? "text-slate-200" : "text-gray-700"}`}>{recipe.title}</span>
                <button
                  onClick={() => onRemoveRecipe(dayIndex, mealType, recipe.id)}
                  className={`opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 transition-all ${isDark ? "text-red-400 md:text-slate-500 md:hover:text-red-400" : "text-red-500 md:text-gray-300 md:hover:text-red-500"}`}
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))
          ) : null}
        </AnimatePresence>

        {(!slot?.recipes || slot.recipes.length === 0) && (
          <button
            onClick={() => onAddRequest(dayIndex, mealType)}
            className={`flex-1 min-h-[60px] flex flex-col items-center justify-center gap-1.5 rounded-lg transition-all border border-transparent group ${isDark ? "text-slate-500 hover:text-indigo-400 hover:bg-indigo-900/20 hover:border-indigo-900/30" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-100"}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${isDark ? "bg-slate-800 group-hover:bg-slate-700" : "bg-gray-50 group-hover:bg-white"}`}>
              <Plus size={16} className={`transition-colors ${isDark ? "text-slate-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"}`} />
            </div>
            <span className="text-[10px] font-bold">Rezept hinzufügen</span>
          </button>
        )}
      </div>

      {slot?.recipes && slot.recipes.length > 0 && (
        <button
          onClick={() => onAddRequest(dayIndex, mealType)}
          className={`w-full mt-1 py-1.5 border border-dashed rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${isDark ? "border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-900/50 hover:bg-indigo-900/20" : "border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"}`}
        >
          <Plus size={12} /> Weiteres hinzufügen
        </button>
      )}

      {
        slot?.recipes && slot.recipes.length > 0 && (
          <div className={`mt-auto pt-2 border-t flex flex-col gap-1.5 transition-colors ${isDark ? "border-slate-800" : "border-gray-50"}`}>
            <div className="flex items-center gap-1.5 text-[10px]">
              <User size={10} className="text-indigo-400" />
              <input
                type="text"
                placeholder="Helfer..."
                value={slot.helperName || ""}
                onChange={(e) => onUpdateHelper(dayIndex, mealType, e.target.value)}
                className={`bg-transparent border-none focus:ring-0 p-0 text-[10px] w-full transition-colors ${isDark ? "text-slate-300 placeholder:text-slate-700" : "text-gray-600 placeholder:text-gray-200"}`}
              />
            </div>
          </div>
        )
      }
    </div >
  );
};

interface PlannerBoardProps {
  planner: PlannerSlot[];
  weekDates?: Date[];
  onAddRequest: (dayIndex: number, mealType: MealType) => void;
  onRemoveRecipe: (dayIndex: number, mealType: MealType, recipeId: string) => void;
  onUpdateHelper: (dayIndex: number, mealType: MealType, helperName: string) => void;
}

export const PlannerBoard: React.FC<PlannerBoardProps> = ({ planner, weekDates, onAddRequest, onRemoveRecipe, onUpdateHelper }) => {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col gap-8">
      {DAYS.map((day, dayIndex) => (
        <div key={day} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className={`font-serif italic text-2xl shrink-0 md:min-w-[140px] transition-colors ${isDark ? "text-slate-200" : "text-gray-800"}`}>
              {day}
              {weekDates && weekDates[dayIndex] && (
                <span className={`ml-2 text-sm not-italic font-sans transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                  {String(weekDates[dayIndex].getDate()).padStart(2, '0')}.{String(weekDates[dayIndex].getMonth() + 1).padStart(2, '0')}.
                </span>
              )}
            </h3>
            <div className={`h-px flex-1 transition-colors ${isDark ? "bg-slate-800" : "bg-gray-100"}`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEAL_TYPES.map((meal) => (
              <MealSlot
                key={meal.id}
                dayIndex={dayIndex}
                mealType={meal.id}
                slot={Array.isArray(planner) ? planner.find((p) => p.dayIndex === dayIndex && p.mealType === meal.id) : undefined}
                onAddRequest={onAddRequest}
                onRemoveRecipe={onRemoveRecipe}
                onUpdateHelper={onUpdateHelper}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
