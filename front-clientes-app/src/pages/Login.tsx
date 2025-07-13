/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import { useClientes } from "../context/ClienteContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUsuario } = useClientes();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // impede o reload padrão do form

    try {
      const data = await loginUsuario({ email, password });
      localStorage.setItem("token", data.access_token);
      setUsuario(email); // ajuste se quiser usar nome
      navigate("/clientes");
    } catch (err: any) {
      const mensagem =
      typeof err === "string"
      ? err
      : err?.message || err?.toString() || "Erro ao fazer login";
      setErro(mensagem);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          type="text"
          placeholder="Informe seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        {erro && <div className="text-red-500 mb-2 text-sm">{erro}</div>}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
