import { ref } from "vue";

export type LottiePlayerType = "dotlottie" | "lottiejson";

/**
 * Composable to manage Lottie player feature flag
 * Toggles between DotLottieVue and @lottiejson/lottie-player
 */
export const useLottieFeatureFlag = () => {
  // Default to dotlottie if no preference is stored
  const getStoredPreference = (): LottiePlayerType => {
    if (typeof window === "undefined") return "dotlottie";

    const stored = localStorage.getItem("lottie-player-preference");
    const loggerMessage =
      stored === "lottiejson"
        ? "You are using Lottie Player"
        : "You are using DotLottie Player";
    console.log(loggerMessage);
    return stored === "lottiejson" ? "lottiejson" : "dotlottie";
  };

  const playerType = ref<LottiePlayerType>(getStoredPreference());

  // Toggle between player types
  const togglePlayerType = () => {
    playerType.value =
      playerType.value === "dotlottie" ? "lottiejson" : "dotlottie";

    if (typeof window !== "undefined") {
      localStorage.setItem("lottie-player-preference", playerType.value);
    }
  };

  // Set specific player type
  const setPlayerType = (type: LottiePlayerType) => {
    playerType.value = type;

    if (typeof window !== "undefined") {
      localStorage.setItem("lottie-player-preference", type);
    }
  };

  return {
    playerType,
    togglePlayerType,
    setPlayerType,
  };
};
