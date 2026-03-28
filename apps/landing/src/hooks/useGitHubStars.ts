import { useState, useEffect } from "react";
import { GITHUB_REPO_URL } from "../constants";

const API_URL = GITHUB_REPO_URL.replace(
  "github.com",
  "api.github.com/repos"
);

export function useGitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return stars;
}
