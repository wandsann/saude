import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface Achievement {
  id: number;
  name: string;
  icon: string;
  backgroundColor: string;
  iconColor: string;
  isLocked?: boolean;
  isPulsing?: boolean;
}

interface AchievementCardProps {
  level: number;
  points: number;
  nextLevelPoints: number;
  achievements: Achievement[];
}

export function AchievementCard({
  level,
  points,
  nextLevelPoints,
  achievements,
}: AchievementCardProps) {
  const { t } = useLanguage();
  
  const progress = Math.min((points / nextLevelPoints) * 100, 100);
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-3">
            <span className="material-icons text-white">emoji_events</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{t("achievements.healthLevel")}</h3>
            <div className="flex items-center">
              <span className="text-amber-500 font-medium">{t("achievements.level", { level })}</span>
              <span className="text-gray-500 text-sm ml-2">
                {t("achievements.pointsToNextLevel", { points: nextLevelPoints - points })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Achievements */}
        <h4 className="text-sm font-medium text-gray-500 mb-3">{t("achievements.recent")}</h4>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1 ${
                achievement.isLocked 
                  ? "bg-gray-200 opacity-50" 
                  : achievement.backgroundColor
              } ${achievement.isPulsing ? "animate-pulse" : ""}`}>
                <span className={`material-icons ${
                  achievement.isLocked 
                    ? "text-gray-400" 
                    : achievement.iconColor
                }`}>
                  {achievement.icon}
                </span>
              </div>
              <p className="text-xs text-gray-500">{achievement.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
