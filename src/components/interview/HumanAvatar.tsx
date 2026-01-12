import { AnimatedAvatar, AvatarEmotion } from "./AnimatedAvatar";

interface HumanAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
  emotion?: AvatarEmotion;
  statusText?: string;
}

export const HumanAvatar = ({ isSpeaking, isLoading, emotion = "neutral", statusText }: HumanAvatarProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(220_20%_12%)] via-[hsl(220_25%_10%)] to-[hsl(220_30%_8%)]">
      <AnimatedAvatar 
        isSpeaking={isSpeaking} 
        isLoading={isLoading}
        emotion={emotion}
        statusText={statusText}
      />
    </div>
  );
};
