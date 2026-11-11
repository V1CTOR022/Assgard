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

type Field = "email" | "senha";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { errors, clear, submit } = useFieldErrors<Field>();

  function handleLogin() {
    const found: FieldErrors<Field> = {};

    if (!email.trim()) {
      found.email = "É obrigatório digitar um email";
    } else if (!isGmailAddress(email)) {
      found.email = "Insira um email válido";
    }

    if (!senha) found.senha = "É obrigatório digitar uma senha";

    if (submit(found)) navigation.navigate("Main");
  }

  return (
    <AuthLayout title="Faça seu Login">
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
        placeholder="Digite sua senha"
        value={senha}
        error={errors.senha}
        onChangeText={(text) => {
          setSenha(text);
          clear("senha");
        }}
      />

      <AuthLink
        label="Não tem uma conta? Registre-se"
        onPress={() => navigation.navigate("Register")}
      />

      <AuthButton label="Entrar" onPress={handleLogin} />
    </AuthLayout>
  );
}
