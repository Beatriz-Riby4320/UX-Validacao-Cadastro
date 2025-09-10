import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    CPF: "",
    telefone: "",
    endereço: "",
    CEP: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    senha: "",
    confirmarSenha: "",
    CPF: "",
    telefone: "",
    CEP: "",
  });

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({
    message: "",
    type: "",
  });

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "email") {
      newErrors.email = isValidEmail(value) ? "" : "E-mail inválido";
    }

    if (name === "senha") {
      newErrors.senha = value.length >= 8 ? "" : "Senha deve ter pelo menos 8 caracteres";
    }

    if (name === "confirmarSenha") {
      newErrors.confirmarSenha =
        value === formData.senha ? "" : "Senhas não coincidem";
    }

    if (name === "CPF") {
      const formatted = value.replace(/\D/g, "").slice(0, 11);
      const masked = formatted.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      newErrors.CPF = isValidCPF(masked) ? "" : "CPF inválido";
      setFormData({ ...formData, CPF: masked });
      setErrors(newErrors);
      return;
    }

    if (name === "telefone") {
      const formatted = value.replace(/\D/g, "").slice(0, 11);
      const masked = formatted.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      newErrors.telefone =
        masked.length === 15 ? "" : "Formato esperado: (99) 99999-9999";
      setFormData({ ...formData, telefone: masked });
      setErrors(newErrors);
      return;
    }

    if (name === "CEP") {
      const formatted = value.replace(/\D/g, "").slice(0, 8);
      const masked = formatted.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
      newErrors.CEP = masked.length === 10 ? "" : "Formato esperado: 99.999-999";
      setFormData({ ...formData, CEP: masked });
      setErrors(newErrors);
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors(newErrors);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const hasErrors =
      Object.values(errors).some((err) => err !== "") ||
      Object.values(formData).some((val) => val === "");

    if (hasErrors) {
      setFeedback({
        message: "❌ Oops! Verifique os campos preenchidos.",
        type: "error",
      });
    } else {
      setFeedback({
        message: "✅ Cadastro realizado com sucesso!",
        type: "success",
      });
      console.log("Dados enviados:", formData);
    }

    setTimeout(() => {
      setFeedback({ message: "", type: "" });
    }, 4000);
  }

  return (
    <div className="container">
      <h1>Cadastro</h1>

      {feedback.message && (
        <div className={`feedback ${feedback.type}`} role="alert" aria-live="polite">
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="nome">Nome:</label>
        <input id="nome" name="nome" value={formData.nome} onChange={handleChange} />

        <label htmlFor="email">E-mail:</label>
        <input id="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">⚠️ {errors.email}</span>}

        <label htmlFor="CPF">CPF:</label>
        <input id="CPF" name="CPF" value={formData.CPF} onChange={handleChange} />
        {errors.CPF && <span className="error">⚠️ {errors.CPF}</span>}

        <label htmlFor="telefone">Telefone:</label>
        <input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
        {errors.telefone && <span className="error">⚠️ {errors.telefone}</span>}

        <label htmlFor="endereço">Endereço:</label>
        <input id="endereço" name="endereço" value={formData.endereço} onChange={handleChange} />

        <label htmlFor="CEP">CEP:</label>
        <input id="CEP" name="CEP" value={formData.CEP} onChange={handleChange} />
        {errors.CEP && <span className="error">⚠️ {errors.CEP}</span>}

        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} />
        {errors.senha && <span className="error">⚠️ {errors.senha}</span>}

        <label htmlFor="confirmarSenha">Confirmar senha:</label>
        <input
          type="password"
          id="confirmarSenha"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
        />
        {errors.confirmarSenha && <span className="error">⚠️ {errors.confirmarSenha}</span>}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default App;
