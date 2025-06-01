import { useAuthStore, type User } from "../../store/useAuthStore";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAndStoreUser = async (
  accessToken: string,
  refreshToken: string,
  onSuccess?: (user: User) => void
) => {
  const { login, logout } = useAuthStore.getState();

  try {
    // TODO: /user/self API 구현 시 아래 코드 복원
    // const res = await fetch(`${API_BASE_URL}/user/self`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // if (!res.ok) {
    //   logout();
    //   return;
    // }

    // const user = (await res.json()) as User;

    const user: User = {
      id: 1,
      name: "임시 사용자",
      email: "dummy@example.com",
      // 필요한 경우 추가 필드 작성
    };

    login(user, accessToken, refreshToken);
    onSuccess?.(user);
  } catch (error) {
    console.error("❌ 사용자 정보 요청 실패:", error);
    logout();
  }
};
