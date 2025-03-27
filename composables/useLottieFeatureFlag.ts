import { ref } from "vue";

export type LottiePlayerType = "dotlottie" | "lottiefiles";

/**
 * Composable to manage Lottie player feature flag
 * Toggles between DotLottieVue and @lottiefiles/lottie-player
 */
export const useLottieFeatureFlag = () => {
  // Default to dotlottie if no preference is stored
  const getStoredPreference = (): LottiePlayerType => {
    if (typeof window === "undefined") return "dotlottie";

    const stored = localStorage.getItem("lottie-player-preference");
    const loggerMessage =
      stored === "lottiefiles"
        ? "You are using Lottie Player"
        : "You are using DotLottie Player";
    console.log(loggerMessage);
    return stored === "lottiefiles" ? "lottiefiles" : "dotlottie";
  };

  const playerType = ref<LottiePlayerType>(getStoredPreference());

  // Toggle between player types
  const togglePlayerType = () => {
    playerType.value =
      playerType.value === "dotlottie" ? "lottiefiles" : "dotlottie";

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
