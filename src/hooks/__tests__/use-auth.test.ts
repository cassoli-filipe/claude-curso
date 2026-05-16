import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getAnonWorkData as any).mockReturnValue(null);
    (getProjects as any).mockResolvedValue([]);
    (createProject as any).mockResolvedValue({ id: "new-project-id" });
  });

  describe("estado inicial", () => {
    test("isLoading começa como false", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isLoading).toBe(false);
    });

    test("expõe signIn, signUp e isLoading", () => {
      const { result } = renderHook(() => useAuth());
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signUp).toBe("function");
      expect(typeof result.current.isLoading).toBe("boolean");
    });
  });

  describe("signIn", () => {
    test("chama signInAction com email e senha", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      expect(signInAction).toHaveBeenCalledWith("user@test.com", "senha123");
    });

    test("define isLoading como true durante a chamada e false ao terminar", async () => {
      let resolveFn: (value: any) => void;
      (signInAction as any).mockImplementation(
        () => new Promise((resolve) => { resolveFn = resolve; })
      );

      const { result } = renderHook(() => useAuth());

      let signInPromise: Promise<any>;
      act(() => {
        signInPromise = result.current.signIn("user@test.com", "senha123");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveFn!({ success: false, error: "erro" });
        await signInPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("retorna o resultado de signInAction em caso de sucesso", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.signIn("user@test.com", "senha123");
      });

      expect(returnValue).toEqual({ success: true });
    });

    test("retorna o resultado de signInAction em caso de erro", async () => {
      (signInAction as any).mockResolvedValue({
        success: false,
        error: "Credenciais inválidas",
      });
      const { result } = renderHook(() => useAuth());

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.signIn("user@test.com", "errada");
      });

      expect(returnValue).toEqual({
        success: false,
        error: "Credenciais inválidas",
      });
    });

    test("não chama handlePostSignIn se signIn falhar", async () => {
      (signInAction as any).mockResolvedValue({ success: false, error: "erro" });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      expect(getProjects).not.toHaveBeenCalled();
      expect(createProject).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("garante isLoading false mesmo se signInAction lançar exceção", async () => {
      (signInAction as any).mockRejectedValue(new Error("Falha de rede"));
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123").catch(() => {});
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("signUp", () => {
    test("chama signUpAction com email e senha", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("novo@test.com", "senha123");
      });

      expect(signUpAction).toHaveBeenCalledWith("novo@test.com", "senha123");
    });

    test("define isLoading como true durante a chamada e false ao terminar", async () => {
      let resolveFn: (value: any) => void;
      (signUpAction as any).mockImplementation(
        () => new Promise((resolve) => { resolveFn = resolve; })
      );

      const { result } = renderHook(() => useAuth());

      let signUpPromise: Promise<any>;
      act(() => {
        signUpPromise = result.current.signUp("novo@test.com", "senha123");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveFn!({ success: false });
        await signUpPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("retorna o resultado de signUpAction em caso de sucesso", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.signUp("novo@test.com", "senha123");
      });

      expect(returnValue).toEqual({ success: true });
    });

    test("não chama handlePostSignIn se signUp falhar", async () => {
      (signUpAction as any).mockResolvedValue({
        success: false,
        error: "Email já cadastrado",
      });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("existente@test.com", "senha123");
      });

      expect(getProjects).not.toHaveBeenCalled();
      expect(createProject).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("garante isLoading false mesmo se signUpAction lançar exceção", async () => {
      (signUpAction as any).mockRejectedValue(new Error("Falha de rede"));
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("novo@test.com", "senha123").catch(() => {});
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("handlePostSignIn — trabalho anônimo existe", () => {
    test("cria projeto com dados anônimos e redireciona", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue({
        messages: [{ role: "user", content: "olá" }],
        fileSystemData: { "/App.jsx": { content: "export default () => <div/>" } },
      });
      (createProject as any).mockResolvedValue({ id: "anon-project-id" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^Design from /),
        messages: [{ role: "user", content: "olá" }],
        data: { "/App.jsx": { content: "export default () => <div/>" } },
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/anon-project-id");
      expect(getProjects).not.toHaveBeenCalled();
    });

    test("ignora dados anônimos se messages estiver vazia", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue({
        messages: [],
        fileSystemData: {},
      });
      (getProjects as any).mockResolvedValue([{ id: "existing-project" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      expect(clearAnonWork).not.toHaveBeenCalled();
      expect(getProjects).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/existing-project");
    });
  });

  describe("handlePostSignIn — sem trabalho anônimo", () => {
    test("redireciona para o projeto mais recente quando existir", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getProjects as any).mockResolvedValue([
        { id: "projeto-recente" },
        { id: "projeto-antigo" },
      ]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      expect(mockPush).toHaveBeenCalledWith("/projeto-recente");
      expect(createProject).not.toHaveBeenCalled();
    });

    test("cria novo projeto quando não há projetos e redireciona", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue({ id: "projeto-novo" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #/),
        messages: [],
        data: {},
      });
      expect(mockPush).toHaveBeenCalledWith("/projeto-novo");
    });

    test("nome do projeto novo contém número aleatório", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue({ id: "id" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha123");
      });

      const call = (createProject as any).mock.calls[0][0];
      expect(call.name).toMatch(/^New Design #\d+$/);
    });
  });

  describe("handlePostSignIn — via signUp", () => {
    test("executa o mesmo fluxo pós-autenticação após signUp bem-sucedido", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      (getProjects as any).mockResolvedValue([{ id: "primeiro-projeto" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("novo@test.com", "senha123");
      });

      expect(mockPush).toHaveBeenCalledWith("/primeiro-projeto");
    });
  });
});
