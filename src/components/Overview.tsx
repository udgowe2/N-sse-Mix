import React from "react";
import { PlannerSlot, Recipe, DAYS, MEAL_TYPES, DailyTask, ShoppingItem } from "../types";
import { motion } from "motion/react";
import { User, Clock, ChefHat, ArrowRight, ShoppingBag, ListTodo, CheckCircle2, RefreshCw } from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";
import { useTheme } from "../context/ThemeContext";

interface OverviewProps {
  planner: PlannerSlot[];
  recipes: Recipe[];
  tasks?: DailyTask[];
  shoppingItems?: ShoppingItem[];
  onSwitchTab: (tab: "overview" | "planner" | "shopping" | "recipes" | "tasks") => void;
  onClickRecipe?: (recipe: Recipe) => void;
  onShowAdminUpdate?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  planner,
  recipes,
  tasks = [],
  shoppingItems = [],
  onSwitchTab,
  onClickRecipe,
  onShowAdminUpdate,
}) => {
  const { isDark } = useTheme();
  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayName = DAYS[todayIndex];

  const todayMeals = MEAL_TYPES.map(mealType => {
    const slot = Array.isArray(planner) ? planner.find(p => p.dayIndex === todayIndex && p.mealType === mealType.id) : null;
    const mealRecipes = slot?.recipeIds?.map(id => recipes.find(r => r.id === id)).filter(Boolean) as Recipe[] || [];
    return { ...mealType, recipes: mealRecipes, helper: slot?.helperName };
  });

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.filter(t => !t.isCompleted).length;
  const pendingShopping = shoppingItems.filter(i => !i.isCompleted).length;

  return (
    <div className="flex flex-col gap-10">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className={`text-3xl md:text-4xl font-serif font-black tracking-tight transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
            Schönen {todayName}! 👋
          </h2>
          <p className={`font-medium mt-1 transition-colors ${isDark ? "text-slate-400" : "text-gray-500"}`}>Hier ist der Menüplan für heute.</p>
        </div>
        <button
          onClick={() => onSwitchTab("planner")}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm self-start ${isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          Ganze Woche <ArrowRight size={16} />
        </button>
      </div>

      {/* Today's Meals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayMeals.map((meal, idx) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-3xl p-6 border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{meal.icon}</span>
              <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>{meal.label}</span>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {meal.recipes.length > 0 ? (
                meal.recipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className={`flex flex-col gap-3 ${onClickRecipe ? "cursor-pointer" : ""}`}
                    onClick={() => onClickRecipe?.(recipe)}
                  >
                    <div className={`aspect-video rounded-2xl overflow-hidden relative transition-colors ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                      {recipe.image ? (
                        <img
                          src={getImageUrl(recipe.image)}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center transition-colors ${isDark ? "text-slate-600" : "text-gray-300"}`}>
                          <ChefHat size={32} />
                        </div>
                      )}
                    </div>
                    <h3 className={`font-serif font-bold text-base leading-tight transition-colors ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                      {recipe.title}
                    </h3>
                    {recipe.prepTime && (
                      <div className={`flex items-center gap-1 text-xs transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        <Clock size={12} /> {recipe.prepTime}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${isDark ? "bg-slate-800 text-slate-600" : "bg-gray-50 text-gray-300"}`}>
                    <ChefHat size={20} />
                  </div>
                  <p className={`text-xs italic transition-colors ${isDark ? "text-slate-600" : "text-gray-400"}`}>Nichts geplant</p>
                </div>
              )}
            </div>

            {meal.helper && (
              <div className={`mt-auto pt-3 border-t flex items-center gap-2 text-xs font-bold transition-colors ${isDark ? "border-slate-800 text-indigo-400" : "border-gray-50 text-indigo-600"}`}>
                <User size={12} />
                <span>Sous-Chef: {meal.helper}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Tasks Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => onSwitchTab("tasks")}
          className="cursor-pointer bg-indigo-900 rounded-3xl p-6 text-white flex items-center gap-5 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-200 group"
        >
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all">
            <ListTodo size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-1">Aufgaben</p>
            <p className="text-3xl font-black text-white">{pendingTasks}</p>
            <p className="text-indigo-300 text-sm mt-0.5">
              offen · {completedTasks} erledigt
            </p>
          </div>
          <ArrowRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Shopping Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => onSwitchTab("shopping")}
          className={`cursor-pointer rounded-3xl p-6 border shadow-sm flex items-center gap-5 transition-all group ${isDark ? "bg-slate-900 border-slate-800 hover:shadow-md hover:border-emerald-900/50" : "bg-white border-gray-100 hover:shadow-md hover:border-emerald-100"}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${isDark ? "bg-emerald-900/20 text-emerald-400 group-hover:bg-emerald-900/40" : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"}`}>
            <ShoppingBag size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-black uppercase tracking-widest mb-1 transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>Einkaufsliste</p>
            <p className={`text-3xl font-black transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>{pendingShopping}</p>
            <p className={`text-sm mt-0.5 transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              {pendingShopping === 1 ? "Artikel ausstehend" : "Artikel ausstehend"}
            </p>
          </div>
          <ArrowRight size={20} className={`transition-all group-hover:translate-x-1 ${isDark ? "text-slate-700 group-hover:text-emerald-400" : "text-gray-300 group-hover:text-emerald-400"}`} />
        </motion.div>

      </div>

      {/* Admin Section */}
      <div className="mt-10 pt-10 border-t border-dashed border-gray-200 flex justify-center">
        <button
          onClick={onShowAdminUpdate}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isDark ? "bg-slate-900 border border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-900/50" : "bg-gray-50 border border-gray-100 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm"}`}
        >
          <RefreshCw size={14} />
          System Update (GitHub)
        </button>
      </div>
    </div>
  );
};
