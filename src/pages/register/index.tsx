import { useState } from "react";

import {
  AuthLayout,
  AuthButton,
  AuthLink,
  EmailField,
  PasswordField,
} from "../../components/AuthForm";
import { useFieldErrors, type FieldErrors } from "../../hooks/useFieldErrors";
import { isGmailAddress } from "../../utils/validation";

type Field = "email" | "senha" | "confirmarSenha";

export default function Registro({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const { errors, clear, submit } = useFieldErrors<Field>();

  function handleRegistro() {
    const found: FieldErrors<Field> = {};

    if (!email.trim()) {
      found.email = "É obrigatório digitar um email";
    } else if (!isGmailAddress(email)) {
      found.email = "Insira um email válido";
    }

    if (!senha) found.senha = "É obrigatório digitar uma senha";

    if (!confirmarSenha) {
      found.confirmarSenha = "É obrigatório confirmar a senha";
    } else if (senha && senha !== confirmarSenha) {
      found.confirmarSenha = "As senhas não são iguais";
    }

    if (!submit(found)) return;

    alert("Registro realizado com sucesso");
    navigation.navigate("Login");
  }

  return (
    <AuthLayout title="Faça seu Registro">
      <EmailField
        value={email}
        error={errors.email}
        onChangeText={(text) => {
          setEmail(text);
          clear("email");
        }}
      />

      <PasswordField
        label="Senha"
        placeholder="Crie uma senha"
        value={senha}
        error={errors.senha}
        onChangeText={(text) => {
          setSenha(text);
          clear("senha");
        }}
      />

      <PasswordField
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        value={confirmarSenha}
        error={errors.confirmarSenha}
        onChangeText={(text) => {
          setConfirmarSenha(text);
          clear("confirmarSenha");
        }}
      />

      <AuthLink
        label="Já tem uma conta? Faça login"
        onPress={() => navigation.navigate("Login")}
      />

      <AuthButton label="Criar Conta" onPress={handleRegistro} />
    </AuthLayout>
  );
}
